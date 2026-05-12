import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getAuditLogsController = async (req: AuthRequest, res: Response) => {
    try {
        const [logs, severityStats] = await Promise.all([
            prisma.auditLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 20
            }),
            prisma.auditLog.groupBy({
                by: ['severity'],
                _count: { id: true }
            })
        ]);

        logger.info('Fetched audit logs successfully');

        res.json({
            summary: {
                totalLogs: await prisma.auditLog.count(),
                criticalActions: severityStats.find((s: any) => s.severity === 'critical')?._count.id || 0,
                warningActions: severityStats.find((s: any) => s.severity === 'warning')?._count.id || 0,
                uniqueAdmins: await prisma.auditLog.groupBy({ by: ['adminId'] }).then((res: any) => res.length)
            },
            logs
        });
    } catch (error) {

    }
}