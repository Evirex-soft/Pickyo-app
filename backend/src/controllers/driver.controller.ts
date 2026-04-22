import { Response } from "express";
import { prisma } from '../config/prisma';
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../utils/logger";
import { getIO } from "../config/socket";


export const toggleDriverStatusController = async (req: AuthRequest, res: Response) => {
    try {
        const { online } = req.body;

        const driver = await prisma.driverProfile.update({
            where: { userId: req.user.userId },
            data: { isOnline: online }
        });

        logger.info(`Driver ${req.user.userId} set status to ${online ? 'online' : 'offline'}`);

        res.json({
            message: online ? "Driver is now online" : "Driver is now offline",
            driver
        });
    } catch (error) {
        logger.error("Error toggling driver status", error);
        res.status(500).json({ message: "Server error" })
    }
};


export const checkPendingRidesController = async (req: AuthRequest, res: Response) => {
    try {
        const driver = await prisma.driverProfile.findUnique({
            where: { userId: req.user.userId }
        });

        if (!driver) {
            return res.status(404).json({ message: "Driver profile not found" });
        }


        const rides = await prisma.ride.findMany({
            where: {
                status: "requested",
                vehicleType: driver.vehicleType
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                rideLocation: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });


        logger.info(`Driver ${req.user.userId} checked for pending rides, found ${rides.length}`);

        const rideResponse = rides.map((ride) => {
            return {
                id: ride.id,
                price: ride.price,
                distance: ride.distanceKm,
                pickup: {
                    address: ride.rideLocation?.pickupAddress || "Unknown location",
                    lat: Number(ride.pickupLat),
                    lng: Number(ride.pickupLng)
                },
                drop: {
                    address: ride.rideLocation?.dropAddress || "Unknown location",
                    lat: Number(ride.dropLat),
                    lng: Number(ride.dropLng),
                },
                passenger: ride.customer?.name,
            };
        });

        res.json(rideResponse);
    } catch (error) {
        logger.error("Error checking pending rides", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const acceptRideController = async (req: AuthRequest, res: Response) => {
    try {
        const rideId = Array.isArray(req.params.rideId) ? req.params.rideId[0] : req.params.rideId;

        const ride = await prisma.ride.update({
            where: { id: rideId },
            data: {
                driverId: req.user.userId,
                status: "driver_assigned"
            },
            include: {
                driver: {
                    include: {
                        driverProfile: true
                    }
                }
            }
        });

        await prisma.rideStatusHistory.create({
            data: {
                rideId,
                status: "driver_assigned"
            }
        });

        const io = getIO();

        io.to(`user-${ride.customerId}`).emit("ride-accepted", {
            rideId: ride.id,
            status: ride.status,
            driver: {
                name: ride.driver?.name,
                phone: ride.driver?.phone,
                vehicleType: ride.driver?.driverProfile?.vehicleType,
                plate: ride.driver?.driverProfile?.licenseNo,
                rating: ride.driver?.driverProfile?.rating
            }
        });

        logger.info(`Ride ${rideId} accepted by driver ${req.user.userId}`);

        res.json({ ride });

    } catch (error) {
        logger.error("Error accepting ride", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const rejectRideController = async (req: AuthRequest, res: Response) => {
    try {
        const rideId = Array.isArray(req.params.rideId) ? req.params.rideId[0] : req.params.rideId;
        await prisma.ride.update({
            where: { id: rideId },
            data: { driverId: null, status: "cancelled" }
        });
        await prisma.rideStatusHistory.create({
            data: {
                rideId,
                status: "cancelled"
            }
        });
        logger.info(`Driver ${req.user.userId} rejected ride ${rideId}`);

        res.json({
            message: "Ride rejected"
        });
    } catch (error) {
        logger.error("Error rejecting ride", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const startRideController = async (req: AuthRequest, res: Response) => {
    try {

        const rideId = Array.isArray(req.params.rideId) ? req.params.rideId[0] : req.params.rideId;
        const { otp } = req.body;
        const cleanOtp = String(otp).trim();

        const ride = await prisma.ride.findUnique({
            where: { id: rideId }
        });

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (cleanOtp !== "1234") {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const updatedRide = await prisma.ride.update({
            where: { id: rideId },
            data: {
                status: "ride_started"
            }
        });

        await prisma.rideStatusHistory.create({
            data: {
                rideId,
                status: "ride_started"
            }
        });

        const io = getIO();
        console.log("IO INSTANCE:", io);

        io.to(`user-${ride.customerId}`).emit("ride-started");

        res.json({ ride: updatedRide });

    } catch (error) {
        logger.error("Error starting ride", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const completeTripController = async (req: AuthRequest, res: Response) => {
    try {

        const rideId = Array.isArray(req.params.rideId) ? req.params.rideId[0] : req.params.rideId;

        const ride = await prisma.ride.update({
            where: { id: rideId },
            data: {
                status: "completed"
            }
        });

        await prisma.rideStatusHistory.create({
            data: {
                rideId,
                status: "completed"
            }
        });

        const io = getIO();

        io.to(`user-${ride.customerId}`).emit("ride-completed");

        logger.info(`Ride ${rideId} completed by driver ${req.user.userId}`);

        res.json({
            message: "Ride completed",
            ride
        });

    } catch (error) {
        logger.error("Error completing ride", error);
        res.status(500).json({ message: "Server error" });
    }
};