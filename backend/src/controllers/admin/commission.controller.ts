import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getCommissionController = async (req: AuthRequest, res: Response) => {
    try {
        const [stats, vehicleBreakdown] = await Promise.all([
            prisma.payment.aggregate({
                _sum: { adminCommission: true, driverEarning: true, amount: true },
                where: { status: 'paid' }
            }),
            // performance by vehicle type
            prisma.ride.findMany({
                where: { status: 'completed', payment: { status: 'paid' } },
                include: { payment: true }
            })
        ]);

        const fleetStats = vehicleBreakdown.reduce((acc: any, curr: any) => {
            const type = curr.vehicleType;
            if (!acc[type]) acc[type] = { type, total: 0, commission: 0 };
            acc[type].total += curr.payment?.amount || 0;
            acc[type].commission += curr.payment?.adminCommission || 0;
            return acc;
        }, {});

        logger.info("Commission data calculated successfully");

        res.json({
            summary: {
                totalRevenue: stats._sum.amount || 0,
                platformEarnings: stats._sum.adminCommission || 0,
                driverDisbursements: stats._sum.driverEarning || 0,
                avgCommissionRate: stats._sum.amount ? ((stats._sum.adminCommission || 0) / stats._sum.amount) * 100 : 0
            },
            fleet: Object.values(fleetStats)
        });
    } catch (error) {
        logger.error("Error fetching commission data", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};