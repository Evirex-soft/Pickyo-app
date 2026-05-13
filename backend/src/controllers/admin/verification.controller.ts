import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";
import dotenv from 'dotenv';

dotenv.config();
const BASE_URL = process.env.BACKEND_URL;

export const getPendingVerificationsController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const pendingDrivers = await prisma.driverProfile.findMany({
            where: {
                isApproved: false
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                documents: true,

                vehicles: true
            },
            orderBy: {
                lastSeen: "desc"
            }
        });

        const formattedDrivers = pendingDrivers.map(driver => ({
            ...driver,
            documents: driver.documents.map(doc => ({
                ...doc,
                url: `${BASE_URL}/${doc.url.replace(/\\/g, '/')}`
            }))
        }))

        logger.info(
            `Fetched ${pendingDrivers.length} pending verifications`
        );

        res.status(200).json({
            success: true,
            data: formattedDrivers
        });

    } catch (error) {
        logger.error(
            `Error fetching pending verifications: ${error}`
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch pending verifications"
        });
    }
};

export const processVerification = async (req: AuthRequest, res: Response) => {
    const { driverId, status, reason } = req.body;
    const adminId = req.user?.userId || "system-admin";

    const cleanStatus = status?.trim().toLowerCase();
    const isApproving = cleanStatus === 'approve';

    try {
        const currentProfile = await prisma.driverProfile.findFirst({
            where: {
                OR: [
                    { id: driverId },
                    { userId: driverId }
                ]
            }
        });

        if (!currentProfile) {
            return res.status(404).json({ success: false, message: 'Driver profile not found' });
        }

        const [updatedProfile, updatedDocs] = await prisma.$transaction([
            // update the profile
            prisma.driverProfile.update({
                where: { id: currentProfile.id },
                data: {
                    isApproved: isApproving,
                    rejectionReason: !isApproving ? reason : null
                }
            }),

            // update the docs
            prisma.driverDocument.updateMany({
                where: { driverId: currentProfile.id },
                data: { isVerified: isApproving }
            })
        ]);

        await prisma.auditLog.create({
            data: {
                adminId: adminId,
                adminName: 'Admin',
                action: isApproving ? 'DRIVER_APPROVED' : 'DRIVER_REJECTED',
                entity: 'DriverProfile',
                entityId: currentProfile.id,
                severity: isApproving ? 'info' : 'warning',
                // Storing snapshots of the data
                oldValue: { isApproved: currentProfile.isApproved },
                newValue: { isApproved: updatedProfile.isApproved, docsVerified: updatedDocs.count }
            }
        });

        logger.info(`Verification Processed: Driver ${currentProfile.id} approved=${updatedProfile.isApproved}`);

        res.json({
            success: true,
            message: `Driver and ${updatedDocs.count} documents processed successfully.`,
            isApproved: updatedProfile.isApproved
        });

    } catch (error: any) {
        logger.error(`Error processing verification: ${error}`);
        res.status(500).json({
            success: false,
            message: 'Failed to process verification',
            error: error.message
        });
    }
};