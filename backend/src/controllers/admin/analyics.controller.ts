import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getAnalytics = async (req: AuthRequest, res: Response) => {
    try {

        const [
            revenueStats,
            rideCounts,
            activeDrivers,
            vehicleStats,
            revenueByDay
        ] = await Promise.all([

            // Revenue summary
            prisma.payment.aggregate({
                _sum: {
                    amount: true,
                    adminCommission: true
                },
                where: {
                    status: 'paid'
                }
            }),

            // Ride status distribution
            prisma.ride.groupBy({
                by: ['status'],
                _count: {
                    id: true
                }
            }),

            // Active drivers
            prisma.user.count({
                where: {
                    role: 'driver',
                    isActive: true
                }
            }),

            // Fleet distribution
            prisma.ride.groupBy({
                by: ['vehicleType'],
                _count: {
                    id: true
                }
            }),

            // Revenue chart (last 7 days)
            prisma.payment.findMany({
                where: {
                    status: 'paid'
                },
                select: {
                    adminCommission: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })
        ]);

        // Total rides
        const totalRides = rideCounts.reduce(
            (acc, curr) => acc + curr._count.id,
            0
        );

        // Status colors
        const statusColorMap: Record<string, string> = {
            completed: "bg-emerald-500",
            cancelled: "bg-red-500",
            requested: "bg-yellow-500",
            ride_started: "bg-blue-500",
            driver_assigned: "bg-purple-500",
            driver_arriving: "bg-orange-500"
        };

        // Revenue chart grouping
        const revenueMap: Record<string, number> = {};

        revenueByDay.forEach((payment) => {
            const day = new Date(payment.createdAt).toLocaleDateString(
                "en-US",
                { weekday: "short" }
            );

            revenueMap[day] =
                (revenueMap[day] || 0) + payment.adminCommission;
        });

        const chartData = Object.entries(revenueMap).map(
            ([name, revenue]) => ({
                name,
                revenue
            })
        );

        // Final response
        res.json({
            summary: {
                grossVolume: revenueStats._sum.amount || 0,
                netRevenue:
                    revenueStats._sum.adminCommission || 0,
                totalRides,
                activeDrivers
            },

            chartData,

            statusBreakdown: rideCounts.map((ride) => ({
                status: ride.status.toUpperCase(),
                count: ride._count.id,
                color:
                    statusColorMap[ride.status] ||
                    "bg-gray-500"
            })),

            fleet: vehicleStats.map((vehicle) => ({
                label: vehicle.vehicleType
                    .replace('_', ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase()),

                count: vehicle._count.id,

                percentage:
                    totalRides > 0
                        ? Number(
                            (
                                (vehicle._count.id /
                                    totalRides) *
                                100
                            ).toFixed(1)
                        )
                        : 0
            }))
        });

        logger.info("Fetched analytics successfully");

    } catch (error) {

        logger.error("Error fetching analytics", error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};