import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getFraudReportListController = async (req: AuthRequest, res: Response) => {
    try {
        const [sosCount, flaggedUsers, recentIncidents] = await Promise.all([
            prisma.rideStatusHistory.count({
                where: { status: 'ride_started', createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            }),
            // High cancellation Driver side
            prisma.ride.groupBy({
                by: ['driverId'],
                where: { status: 'cancelled' },
                _count: { id: true },
                having: { id: { _count: { gt: 5 } } }
            }),
            // Recent flagged incidents
            prisma.ride.findMany({
                where: {
                    OR: [
                        { status: 'cancelled' },
                        { payment: { status: 'failed' } }
                    ]
                },
                include: {
                    customer: { select: { name: true } },
                    driver: { select: { name: true } },
                    payment: { select: { status: true, amount: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            })
        ]);

        logger.info('Fetched fraud list details successfully');

        res.json({
            summary: {
                criticalAlerts: sosCount,
                flaggedAccounts: flaggedUsers.length,
                suspiciousVolume: recentIncidents.length,
                riskScore: "Low"
            },
            incidents: recentIncidents
        });
    } catch (error) {
        logger.error('Error fetching fraud list details', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}