import { api } from '@/api/axios';
import { DashboardStats } from '@/types/admin.types';
import { User, Driver } from '@/types/admin.types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await api.get("/admin/dashboard-stats");
    return response.data;
};

export const getUsers = async (page: number, limit: number): Promise<{ users: User[]; total: number }> => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
};

export const getDrivers = async (page: number, limit: number): Promise<{ drivers: Driver[]; total: number }> => {
    const response = await api.get(`/admin/drivers?page=${page}&limit=${limit}`);
    return response.data;
};

export const getActiveTrips = async () => {
    const response = await api.get(`/admin/trips/active`);
    return response.data;
};

export const getSurgePricing = async (): Promise<{ multiplier: number }> => {
    const response = await api.get(`/admin/surge`);
    return response.data;
};

export const updateSurgePricing = async (multiplier: number): Promise<{ multiplier: number; message: string }> => {
    const response = await api.post(`/admin/surge`, { multiplier });
    return response.data;
};

export const getAnalytics = async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
};

export const getDisputes = async () => {
    const response = await api.get('/admin/disputes');
    return response.data;
};

export const getPayments = async () => {
    const response = await api.get('/admin/payments');
    return response.data;
};

export const getPromos = async () => {
    const response = await api.get('/admin/promos');
    return response.data;
};

export const getCommissionStats = async () => {
    const response = await api.get('/admin/commission');
    return response.data;
};

export const getGeoZones = async () => {
    const response = await api.get('/admin/geozones');
    return response.data;
};

export const getFleetStats = async () => {
    const response = await api.get('/admin/fleets');
    return response.data;
};

export const getNotificationStats = async () => {
    const response = await api.get('/admin/notifications');
    return response.data;
};

export const getFraudStats = async () => {
    const response = await api.get('/admin/fraud');
    return response.data;
};

export const getHeatmapStats = async () => {
    const response = await api.get('/admin/heatmap');
    return response.data;
};

export const getPermissionsStats = async () => {
    const response = await api.get('/admin/permissions');
    return response.data;
};

export const getAuditLogs = async () => {
    const response = await api.get('/admin/audit-logs');
    return response.data;
};
