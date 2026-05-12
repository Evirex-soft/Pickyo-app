import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getActiveTripsController = async (req: AuthRequest, res: Response) => {
    try {
        const activeTrips = await prisma.ride.findMany({
            where: {
                status: {
                    in: ["driver_arriving", "driver_assigned", "ride_started", "completed"]
                }
            },
            include: {
                driver: {
                    include: {
                        driverProfile: {
                            include: {
                                location: true, // Check if this record exists in DB!
                                vehicles: true
                            }
                        }
                    }
                },
                rideLocation: true // Check if this record exists in DB!
            },
            orderBy: { createdAt: "desc" }
        });

        const formattedTrips = activeTrips.map((trip) => {
            const driverProfile = trip.driver?.driverProfile;
            const driverLocation = driverProfile?.location;
            const vehicle = driverProfile?.vehicles?.[0];

            return {
                id: trip.id,
                status: trip.status.toUpperCase(),
                // FALLBACK: If rideLocation is null, show coordinates from the Ride model
                pickup: trip.rideLocation?.pickupAddress || `Lat: ${trip.pickupLat}, Lng: ${trip.pickupLng}`,
                dropoff: trip.rideLocation?.dropAddress || `Lat: ${trip.dropLat}, Lng: ${trip.dropLng}`,

                driverName: trip.driver?.name || "Searching...",
                driverPhone: trip.driver?.phone || "N/A",

                // LOCATION LOGIC
                // If driver hasn't moved yet, use pickup location as fallback for the map
                currentLat: driverLocation?.lat || trip.pickupLat,
                currentLng: driverLocation?.lng || trip.pickupLng,
                lastPingAt: driverLocation?.updatedAt || trip.updatedAt,

                fare: trip.price,
                vehiclePlate: vehicle?.plateNumber || "No Plate"
            };
        });

        logger.info("Fetched active trips successfully");

        return res.status(200).json({
            totalActive: formattedTrips.length,
            trips: formattedTrips
        });
    } catch (error) {
        logger.error("Error fetching active trips", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
