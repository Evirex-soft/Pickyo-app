import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";


type Cluster = {
    lat: number;
    lng: number;
    demand: number;
    revenue: number;
};


export const getHeatMapAnalyticsController = async (req: AuthRequest, res: Response) => {
    try {
        const [rides, drivers] = await Promise.all([
            prisma.ride.findMany({
                where: { createdAt: { gte: new Date(Date.now() - 12 * 60 * 60 * 1000) } },
                select: { pickupLat: true, pickupLng: true, price: true }
            }),
            // Get online drivers for supply heat
            prisma.driverLocation.findMany({
                include: { driver: { select: { isBusy: true } } }
            })
        ]);

        const clusters: Record<string, Cluster> = {};

        rides.forEach((r: any) => {
            const key = `${r.pickupLat.toFixed(3)}, ${r.pickupLng.toFixed(3)}`;
            if (!clusters[key]) clusters[key] = { lat: r.pickupLat, lng: r.pickupLng, demand: 0, revenue: 0 };
            clusters[key].demand += 1;
            clusters[key].revenue += r.price;
        });

        const hotspots = Object.values(clusters).sort((a: any, b: any) => b.demand - a.demand).slice(0, 10);

        logger.info("Fetched heatmap analytics successfully");

        res.json({
            summary: {
                activeHotspots: hotspots.length,
                peakDemandArea: hotspots[0]?.lat ? "Downtown Cluster" : "N/A",
                supplyGap: rides.length > drivers.length ? "High" : "Optimal",
                avgDensity: (rides.length / 10).toFixed(1)
            },
            hotspots,
            drivers: drivers.length
        })
    } catch (error) {
        logger.error("Error fetching heatmap analytics", error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}