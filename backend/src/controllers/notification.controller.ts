import { Response } from "express";
import { prisma } from '../config/prisma';
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../utils/logger";

export const getNotificationsController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        res.json(notifications);
        logger.info(`Fetched notifications for user ${userId}`);
    } catch (error) {
        logger.error(`Error fetching notifications: ${error}`);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};

export const markAsReadController = async (req: AuthRequest, res: Response) => {
    try {
        const idParam = req.params.id;
        const id = typeof idParam === 'string' ? idParam : idParam?.[0];
        const userId = req.user.userId;

        if (!id) {
            return res.status(400).json({ message: 'Invalid notification id' });
        }

        await prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true }
        });

        res.json({ message: 'Notification marked as read' });
        logger.info(`Marked notification ${id} as read for user ${userId}`);
    } catch (error) {
        logger.error(`Error marking notification as read: ${error}`);
        res.status(500).json({ message: 'Failed to mark notification as read' });
    }
};

export const markAllAsReadController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;

        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });

        res.json({ message: "All marked as read" });
        logger.info(`Marked all notifications as read for user ${userId}`);
    } catch (error) {
        logger.error(`Error marking all notifications as read: ${error}`);
        res.status(500).json({ message: 'Failed to mark all notifications as read' });
    }
};