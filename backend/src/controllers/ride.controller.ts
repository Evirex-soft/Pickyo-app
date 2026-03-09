import { Request, Response } from "express";
import axios from "axios";
import { prisma } from '../config/prisma';
import { logger } from "../utils/logger";
import { AuthRequest } from "../middleware/auth.middleware";

export const estimateRideController = async (req: Request, res: Response) => {
    try {
        const { pickup, drop } = req.body;

        if (!pickup || !drop) {
            return res.status(400).json({ message: "Pickup and drop required" });
        }

        const origin = `${pickup.lat},${pickup.lng}`;
        const destination = `${drop.lat},${drop.lng}`;

        const googleRes = await axios.get(
            "https://maps.googleapis.com/maps/api/distancematrix/json",
            {
                params: {
                    origins: origin,
                    destinations: destination,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
            }
        );

        const element = googleRes.data.rows[0].elements[0];

        const distanceMeters = element.distance.value;
        const durationSeconds = element.duration.value;

        const distanceKm = distanceMeters / 1000;
        const durationMin = Math.ceil(durationSeconds / 60);

        const baseFare = 50;
        const perKm = 10;

        const price = baseFare + distanceKm * perKm;

        res.json({
            distanceKm,
            durationMin,
            price,
        });


    } catch (error) {
        logger.error("Error estimating ride", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getVehicleController = async (req: Request, res: Response) => {
    try {
        const { distanceKm } = req.body;

        if (!distanceKm) {
            return res.status(400).json({ message: "Distance required" });
        }

        const vehicles = [
            {
                type: "bike",
                name: "Bike",
                multiplier: 0.8
            },
            {
                type: "pickups",
                name: "Pickup",
                multiplier: 1.2
            },
            {
                type: "mini_truck",
                name: "Mini Truck",
                multiplier: 1.5,
            },
            {
                type: "truck",
                name: "Truck",
                multiplier: 2.5
            }
        ];

        const baseFare = 50;

        const result = vehicles.map((v) => ({
            ...v,
            price: Math.round(baseFare + distanceKm * 10 * v.multiplier)
        }));

        res.json({ vehicles: result })
    } catch (error) {
        logger.error("Error getting vehicles", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const createRideController = async (req: AuthRequest, res: Response) => {
    try {
        const { pickup, drop, distance, price, vehicleType } = req.body;

        const ride = await prisma.ride.create({
            data: {
                customerId: req.user.userId,
                vehicleType,
                pickupLat: pickup.lat,
                pickupLng: pickup.lng,
                dropLat: drop.lat,
                dropLng: drop.lng,
                distanceKm: distance,
                price,
                status: "requested"
            }
        });

        logger.info(`Ride ${ride.id} created by user ${req.user.userId}`);
        res.json({ ride });
    } catch (error) {
        logger.error("Error creating ride", error);
        res.status(500).json({ message: "Server error" });
    }
}