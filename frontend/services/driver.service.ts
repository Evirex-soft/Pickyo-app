import { api } from "@/api/axios";
import { TripResponse } from "@/types/user.types";

export const toggleDriverStatusAPI = async (online: boolean) => {
    const { data } = await api.post("/driver/status", { online });
    return data;
};

export const checkPendingRidesAPI = async () => {
    const { data } = await api.get("/driver/rides/pending");
    return data;
};

export const acceptRideAPI = async (rideId: string) => {
    const { data } = await api.post(`/driver/rides/${rideId}/accept`);
    return data;
};

export const rejectRideAPI = async (rideId: string) => {
    const { data } = await api.post(`/driver/rides/${rideId}/reject`);
    return data;
};

export const verifyOtpAPI = async (rideId: string, otp: string) => {
    const { data } = await api.post(`/driver/rides/${rideId}/start`, { otp });
    return data;
};

export const completeTripAPI = async (rideId: string) => {
    const { data } = await api.post(`/driver/rides/${rideId}/complete`);
    return data;
};

export const getDriverTrips = async (page: number, limit: number): Promise<TripResponse> => {
    const response = await api.get(`/driver/trips?page=${page}&limit=${limit}`);
    return response.data;
};

export const getDriverProfile = async () => {
    const { data } = await api.get("/driver/profile");
    return data;
};

export const updateVehicle = async (payload: any) => {
    const { data } = await api.put(`/driver/vehicle`, payload);
    return data;
};

export const uploadVehicleDocument = async (formData: FormData) => {
    const { data } = await api.post(`/driver/documents`, formData);
    return data;
};

export const deleteDriverDocument = async (docId: string) => {
    const { data } = await api.delete(`/driver/documents/${docId}`);
    return data;
};