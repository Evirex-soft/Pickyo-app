import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';
import crypto from 'crypto';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});


export const getWalletController = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Get wallet
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId },
        });

        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" })
        }

        const [transactions, totalTransactions] = await prisma.$transaction([
            prisma.walletTransaction.findMany({
                where: { walletId: wallet.id },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.walletTransaction.count({
                where: { walletId: wallet.id }
            })
        ]);

        const totalPages = Math.ceil(totalTransactions / limit);

        res.json({
            balance: wallet.balance, transactions: transactions.map((tx) => ({
                id: tx.id,
                type: tx.type,
                amount: tx.amount,
                description: tx.reason || "Wallet transaction",
                createdAt: tx.createdAt,
                status: "success"
            })),
            totalPages
        });
    } catch (error) {
        logger.error(`Error fetching wallet ${error}`);
        res.status(500).json({ message: "Server error" });
    }
}


export const createWalletOrderController = async (req: AuthRequest, res: Response) => {
    try {
        console.log("Creating wallet order with data:", req.body);
        const { amount } = req.body;


        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        res.json(order);
    } catch (error) {
        logger.error('Error creating wallet order:', error);
        console.log("Error details:", error);
        res.status(500).json({ message: 'Failed to create order', error });
    }
};

export const verifyWalletController = async (req: AuthRequest, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            res.status(400).json({ message: 'Invalid signature' });
            return;
        }

        // Find wallet
        const wallet = await prisma.wallet.findUnique({
            where: { userId: req.user.userId }
        });

        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        const amountInRupees = amount;

        // Transaction record
        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                    balance: {
                        increment: amountInRupees,
                    }
                },
            }),
            prisma.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: amountInRupees,
                    type: 'credit',
                    reason: "Added via Razorpay"
                }
            })
        ])

        res.json({ message: 'Payment verified successfully' });
    } catch (error) {
        logger.error('Error verifying wallet payment:', error);
        res.status(500).json({ message: 'Failed to verify payment', error });
    }
}