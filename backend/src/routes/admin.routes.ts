import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { allowRoles } from '../middleware/role.middleware';
import { getDashboardStatsController } from '../controllers/admin/dashboard.controller';
import { getDriversController, getUsersController } from '../controllers/admin/users.controller';
import { getActiveTripsController } from '../controllers/admin/activetrips.controller';
import { getSurgePricingController, updateSurgePricingController } from '../controllers/admin/dynamicsurge.controller';
import { getAnalytics } from '../controllers/admin/analyics.controller';
import { getDisputeController } from '../controllers/admin/dispute.controller';
import { getPaymentController } from '../controllers/admin/payment.controller';
import { getPromoController } from '../controllers/admin/promo.controller';
import { getCommissionController } from '../controllers/admin/commission.controller';
import { getGeoZoneAnalytics } from '../controllers/admin/geozone.controller';
import { getFleetController } from '../controllers/admin/fleet.controller';
import { getNotificationsController } from '../controllers/admin/notifications.controller';
import { getFraudReportListController } from '../controllers/admin/fraud.controller';
import { getHeatMapAnalyticsController } from '../controllers/admin/heatmap.controller';
import { getPermissionController } from '../controllers/admin/permission.controller';
import { getAuditLogsController } from '../controllers/admin/audit.controller';
import { getPendingVerificationsController, processVerification } from '../controllers/admin/verification.controller';

const router = Router();

// Get Dashboard Stats
router.get('/dashboard-stats', protect, allowRoles("admin"), getDashboardStatsController);

// Get Users
router.get('/users', protect, allowRoles("admin"), getUsersController);

// Get Drivers
router.get('/drivers', protect, allowRoles("admin"), getDriversController);

// Get Active Trips
router.get('/trips/active', protect, allowRoles("admin"), getActiveTripsController);

// Surge Pricing
router.get('/surge', protect, allowRoles("admin"), getSurgePricingController);
router.post('/surge', protect, allowRoles("admin"), updateSurgePricingController);

// Analytics
router.get('/analytics', protect, allowRoles("admin"), getAnalytics);

// Disputes
router.get('/disputes', protect, allowRoles("admin"), getDisputeController);

// Payments
router.get('/payments', protect, allowRoles("admin"), getPaymentController);

// Promo codes
router.get('/promo', protect, allowRoles("admin"), getPromoController);

// Commission
router.get('/commission', protect, allowRoles("admin"), getCommissionController);

// Geo Zones
router.get('/geozones', protect, allowRoles("admin"), getGeoZoneAnalytics);

// Get Fleets
router.get('/fleets', protect, allowRoles("admin"), getFleetController);

// Get Notifications
router.get('/notifications', protect, allowRoles("admin"), getNotificationsController);

// Get Fraud list
router.get('/frauds', protect, allowRoles("admin"), getFraudReportListController);

// Get Heat Maps
router.get('/heatmaps', protect, allowRoles("admin"), getHeatMapAnalyticsController);

// Get Permissions
router.get('/permissions', protect, allowRoles("admin"), getPermissionController);

// Get Audit logs
router.get('/audit-logs', protect, allowRoles("admin"), getAuditLogsController);

// Verifications
router.get('/verification', protect, allowRoles("admin"), getPendingVerificationsController);
router.post('/verification', protect, allowRoles("admin"), processVerification);

export default router;