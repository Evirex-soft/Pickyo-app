import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getGeoZoneAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const [zones, rideData, driverData] = await Promise.all([
            prisma.geoZone.findMany(),
            prisma.ride.findMany({
                where: { status: 'completed' },
                select: { pickupLat: true, pickupLng: true, price: true }
            }),
            // Current online drivers
            prisma.driverLocation.findMany({
                include: { driver: true }
            })
        ]);

        const zonePerformance = zones.map((zone: any) => {
            const ridesInZone = rideData.filter((r: any) => calculateDistance(r.pickupLat, r.pickupLng, zone.centerLat, zone.centerLng) <= zone.radiusKm);

            const driversInZone = driverData.filter((d: any) =>
                calculateDistance(d.lat, d.lng, zone.centerLat, zone.centerLng) <= zone.radiusKm
            );

            return {
                ...zone,
                rideCount: ridesInZone.length,
                revenue: ridesInZone.reduce((sum: any, r: any) => sum + r.price, 0),
                driverCount: driversInZone.length,
                demandScore: Math.min(100, (ridesInZone.length / (driversInZone.length || 1)) * 10)
            };
        });

        logger.info("Fetched geo-zone analytics");
        res.json(zonePerformance);
    } catch (error) {
        logger.error("Error fetching geo-zone analytics", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
}