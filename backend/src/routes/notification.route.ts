import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { getNotificationsController, markAsReadController, markAllAsReadController } from "../controllers/notification.controller";

const router = Router()

// Get notifications
router.get('/', protect, getNotificationsController);

// Mark all notifications as read
router.patch('/read-all', protect, markAllAsReadController);

// Mark notification as read
router.patch('/:id/read', protect, markAsReadController);


export default router;