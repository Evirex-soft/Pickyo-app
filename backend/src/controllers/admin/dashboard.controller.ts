import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getDashboardStatsController = async (req: AuthRequest, res: Response) => {
    try {
        // Total Revenue
        const totalRevenueData = await prisma.payment.aggregate({
            _sum: {
                adminCommission: true,
            },
            where: {
                status: "paid"
            },
        });

        const totalRevenue = totalRevenueData._sum.adminCommission || 0;

        // Active Trips
        const activeTrips = await prisma.ride.count({
            where: {
                status: {
                    in: ["driver_arriving", "driver_assigned", "ride_started"]
                },
            },
        });

        // Online drivers
        const onlineDrivers = await prisma.driverProfile.count({
            where: {
                isOnline: true,
            },
        });

        // Pending Disputes
        const pendingDisputes = await prisma.ride.count({
            where: {
                status: "cancelled",
                cancelReason: {
                    not: null,
                }
            },
        });

        // Chart Data
        const last7Days = await prisma.ride.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
            },
            include: {
                payment: true
            },
        });

        const chartMap: any = {};

        last7Days.forEach((ride) => {
            const day = ride.createdAt.toLocaleDateString("en-US", {
                weekday: "short"
            });

            if (!chartMap[day]) {
                chartMap[day] = { name: day, revenue: 0, trips: 0 }
            }

            chartMap[day].trips += 1;
            if (ride.payment?.status === "paid") {
                chartMap[day].revenue += ride.payment.adminCommission;
            }
        });

        const chartData = Object.values(chartMap);

        // Recent Trips
        const recentTrips = await prisma.ride.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                customer: true,
                driver: true,
                rideLocation: true
            }
        });

        const formattedTrips = recentTrips.map((trip) => ({
            riderName: trip.customer?.name,
            driverName: trip.driver?.name || "Not Assigned",
            pickup: trip.rideLocation?.pickupAddress,
            dropoff: trip.rideLocation?.dropAddress,
            fare: trip.price,
            status: trip.status,
        }));

        const revenueChange = 0;

        logger.info("Dashboard stats fetched successfully");
        res.json({
            totalRevenue,
            revenueChange,
            activeTrips,
            onlineDrivers,
            pendingDisputes,
            chartData,
            recentTrips: formattedTrips,
        });
    } catch (error) {
        logger.error("Error fetching dashboard stats", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
