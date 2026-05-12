import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getPermissionController = async (req: AuthRequest, res: Response) => {
    try {
        const [admins, roleStats] = await Promise.all([
            prisma.user.findMany({
                where: { role: { in: ['admin'] } },
                select: {
                    id: true, name: true, email: true,
                    isActive: true, createdAt: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.groupBy({
                by: ['isActive'],
                where: { role: 'admin' },
                _count: { id: true }
            })
        ]);

        logger.info("Fetched admin data successfully");

        res.json({
            summary: {
                totalAdmins: admins.length,
                activeStaff: roleStats.find(r => r.isActive)?._count.id || 0,
                securityLevel: "High",
                mfaEnabled: "85%"
            },
            staff: admins
        });
    } catch (error) {
        logger.error("Error while fetching permission data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

