import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getNotificationsController = async (req: AuthRequest, res: Response) => {
    try {
        const [stats, totalCount, typeStats, recentNotifications] = await Promise.all([
            prisma.notification.aggregate({
                _count: { id: true },
                where: { isRead: true }
            }),

            // Total Count
            prisma.notification.count(),

            prisma.notification.groupBy({
                by: ['type'],
                _count: { id: true }
            }),

            prisma.notification.findMany({
                include: { user: { select: { name: true, role: true } } },
                orderBy: { createdAt: 'desc' },
                take: 15
            })
        ]);

        const total = stats._count.id || 0;

        const readCount = await prisma.notification.count({ where: { isRead: true } });

        logger.info("Notifications fetched successfully");

        res.json({
            summary: {
                totalSent: totalCount,
                readRate: totalCount > 0 ? ((readCount / totalCount) * 100).toFixed(1) : 0,
                activeAlerts: await prisma.notification.count({
                    where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
                }),
            },
            distribution: typeStats?.map((t: any) => ({
                name: t.type.replace('_', ' '),
                count: t._count.id
            })),
            history: recentNotifications
        });
    } catch (error) {
        logger.error("Error fetching notifications", error);
        res.status(500).json({ message: "Error fetching notifications" })
    }
}