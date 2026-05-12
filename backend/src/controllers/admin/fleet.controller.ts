import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getFleetController = async (req: AuthRequest, res: Response) => {
    try {
        const [vehicleStats, typeStats, fleetList] = await Promise.all([
            // Verification Status
            prisma.vehicle.groupBy({
                by: ['isVerified'],
                _count: { id: true }
            }),
            // Composition by Type
            prisma.vehicle.groupBy({
                by: ['type'],
                _count: { id: true }
            }),
            // Fleet List
            prisma.vehicle.findMany({
                include: {
                    driver: {
                        include: { user: { select: { name: true } } }
                    }
                },
                orderBy: { type: 'asc' },
                take: 20
            })
        ]);

        logger.info("Fetched fleet dashboard successfully");

        res.json({
            summary: {
                totalVehicles: fleetList.length,
                verified: vehicleStats.find(v => v.isVerified)?._count.id || 0,
                pending: vehicleStats.find(v => !v.isVerified)?._count.id || 0,
                activeTypes: typeStats.length
            },
            composition: typeStats.map(t => ({
                name: t.type.replace('_', ' '),
                count: t._count.id
            })),
            fleet: fleetList
        });
    } catch (error) {
        logger.error("Error fetching fleet dashboard", error);
        res.status(500).json({ message: "Fleet sync failed" });
    }
};