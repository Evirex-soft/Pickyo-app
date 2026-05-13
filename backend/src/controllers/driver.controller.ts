import { Response } from "express";
import { prisma } from '../config/prisma';
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../utils/logger";
import { getIO } from "../config/socket";
import { RideStatus } from "@prisma/client";
import { COMMISSION_RATE } from "../config/commision";


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

        const COMMISION_RATE = COMMISSION_RATE;

        const rideResponse = rides.map((ride) => {
            const driverEarning = ride.price * (1 - COMMISION_RATE);

            return {
                id: ride.id,
                price: ride.price,
                driverEarning: driverEarning,

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

        await prisma.notification.create({
            data: {
                userId: ride.customerId,
                title: "Ride Accepted",
                message: "Your driver is on the way 🚗",
                type: "ride_update"
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

        await prisma.notification.create({
            data: {
                userId: ride.customerId,
                title: "Ride Started",
                message: "Your trip has started",
                type: "ride_update"
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

        // Commision calculation
        const COMMISION_RATE = COMMISSION_RATE

        const totalAmount = ride.price;
        const adminCommision = totalAmount * COMMISION_RATE;
        const driverEarning = totalAmount - adminCommision;

        await prisma.payment.create({
            data: {
                rideId: ride.id,
                amount: totalAmount,
                adminCommission: adminCommision,
                driverEarning,
                method: "cash",
                status: "paid"
            }
        });

        await prisma.rideStatusHistory.create({
            data: {
                rideId,
                status: "completed"
            }
        });

        await prisma.notification.create({
            data: {
                userId: ride.customerId,
                title: "Ride Completed",
                message: "Your ride is completed successfully",
                type: "ride_update"
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


export const getDriverTripsController = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const whereCondition = {
            driverId: req.user.userId,
            status: RideStatus.completed
        };

        const [trips, totalTrips] = await prisma.$transaction([
            prisma.ride.findMany({
                where: whereCondition,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    rideLocation: true,
                    payment: true,
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true
                        }
                    }
                }
            }),
            prisma.ride.count({ where: whereCondition }),
        ]);

        const totalPages = Math.ceil(totalTrips / limit);

        logger.info(`Fetched trips for driver ${req.user.userId} - Page ${page}`);
        res.json({ trips, totalPages });
    } catch (error) {
        logger.error(`Error fetching trips for driver ${req.user?.userId}: ${error}`);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getDriverProfileController = async (req: AuthRequest, res: Response) => {
    try {
        const driverId = req.user.userId;

        const driverProfile = await prisma.driverProfile.findUnique({
            where: { userId: driverId },
            include: {
                vehicles: true,
                documents: true,
            }
        });
        if (!driverProfile) {
            return res.status(404).json({ message: "Driver profile not found" });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const updatedDocuments = driverProfile.documents.map((doc) => ({
            ...doc,
            url: doc.url ? `${baseUrl}/${doc.url.replace(/\\/g, '/')}` : null
        }));

        const updatedProfile = {
            ...driverProfile,
            documents: updatedDocuments
        };

        logger.info(`Fetched profile for driver ${driverId}`);
        res.json({ driverProfile: updatedProfile });
    } catch (error) {
        logger.error(`Error fetching profile for driver ${req.user?.userId}: ${error}`);
        res.status(500).json({ message: "Server error" });
    }
};


export const uploadDriverDocumentController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const { type, expiryDate } = req.body || {};

        if (!type) {
            return res.status(400).json({ message: "Document type is required" });
        }

        // Get Driver Profile
        const driver = await prisma.driverProfile.findUnique({
            where: { userId }
        });

        if (!driver) {
            return res.status(404).json({ message: "Driver profile not found" });
        };

        //  Check if a document of this type already exists 
        const existingDoc = await prisma.driverDocument.findFirst({
            where: {
                driverId: driver.id,
                type: type
            }
        });

        let document;

        if (existingDoc) {
            // UPDATE existing document
            document = await prisma.driverDocument.update({
                where: { id: existingDoc.id },
                data: {
                    url: req.file.path,
                    expiryDate: expiryDate ? new Date(expiryDate) : null,
                    isVerified: false,
                    createdAt: new Date()
                },
            });
            logger.info(`Updated existing ${type} for driver ${userId}`);
        } else {
            // CREATE new document if it doesn't exist
            document = await prisma.driverDocument.create({
                data: {
                    driverId: driver.id,
                    type,
                    url: req.file.path,
                    expiryDate: expiryDate ? new Date(expiryDate) : null,
                    isVerified: false
                },
            });
            logger.info(`Created new ${type} for driver ${userId}`);
        }

        res.json(document);
    } catch (error) {
        logger.error(`Error processing document for driver ${req.user?.userId}: ${error}`);
        res.status(500).json({ message: "Upload failed" });
    }
};

export const updateVehicleController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const { model, licenseNo, vehicleType, color } = req.body;

        const driver = await prisma.driverProfile.findUnique({
            where: { userId }
        });

        if (!driver) {
            return res.status(404).json({ message: "Driver profile not found" })
        };

        const existingVehicle = await prisma.vehicle.findFirst({
            where: { driverId: driver.id }
        });

        let vehicle;

        if (existingVehicle) {
            vehicle = await prisma.vehicle.update({
                where: { id: existingVehicle.id },
                data: {
                    model,
                    plateNumber: licenseNo,
                    color,
                    type: vehicleType,
                },
            });
        } else {
            vehicle = await prisma.vehicle.create({
                data: {
                    driverId: driver.id,
                    model,
                    plateNumber: licenseNo,
                    color,
                    type: vehicleType,
                },
            });
        }

        res.json(vehicle);
    } catch (error) {
        logger.error(`Error updating vehicle for driver ${req.user?.userId}: ${error}`);
        res.status(500).json({ message: "Update failed" });
    }
};

export const deleteDriverDocumentController = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        const driver = await prisma.driverProfile.findUnique({
            where: { userId }
        });

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" })
        };

        const document = await prisma.driverDocument.findFirst({
            where: {
                id: documentId,
                driverId: driver.id
            },
        });

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        await prisma.driverDocument.delete({
            where: { id: document.id }
        });

        res.json({ message: "Document deleted successfully" });
    } catch (error) {
        logger.error(`Error deleting document for driver ${req.user?.userId}: ${error}`);
        res.status(500).json({ message: "Delete failed" });
    }
};
