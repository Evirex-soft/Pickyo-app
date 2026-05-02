import { api } from "@/api/axios";

export const fetchNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

export const markNotificationAsRead = async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch(`/notifications/read-all`);
    return response.data;
};