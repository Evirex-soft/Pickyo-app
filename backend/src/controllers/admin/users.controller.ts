import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getUsersController = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: {
                    role: 'customer'
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    isActive: true,
                    createdAt: true,

                    _count: {
                        select: {
                            ridesAsCustomer: true,
                        }
                    }

                }
            }),
            prisma.user.count({
                where: {
                    role: 'customer'
                },
            }),
        ]);
        logger.info(`Fetched users - Page: ${page}, Limit: ${limit}`);
        res.json({ users, total });
    } catch (error) {
        logger.error("Error fetching users", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getDriversController = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [drivers, total] = await Promise.all([
            prisma.driverProfile.findMany({
                skip,
                take: limit,
                orderBy: {
                    user: {
                        createdAt: "desc",
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            isActive: true,
                            createdAt: true
                        }
                    },
                    vehicles: {
                        select: {
                            plateNumber: true,
                            type: true,
                        },
                        take: 1,
                    }
                }

            }),
            prisma.driverProfile.count(),
        ]);

        // Calculate driver earnings
        const driversWithEarnings = await Promise.all(
            drivers.map(async (driver) => {
                const earnings = await prisma.payment.aggregate({
                    where: {
                        ride: {
                            driverId: driver.userId,
                        },
                    },
                    _sum: {
                        driverEarning: true,
                    }
                });

                return {
                    ...driver,

                    totalEarnings:
                        earnings._sum.driverEarning || 0,
                };
            })
        )

        logger.info(`Fetched drivers - Page: ${page}, Limit: ${limit}`);
        res.json({ drivers: driversWithEarnings, total, currentPage: page, totalPages: Math.ceil(total / limit) });
    } catch (error) {
        logger.error("Error fetching drivers", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};