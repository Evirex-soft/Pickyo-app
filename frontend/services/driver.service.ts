import { api } from "@/api/axios";

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