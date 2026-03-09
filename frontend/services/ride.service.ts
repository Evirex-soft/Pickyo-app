import { api } from '@/api/axios';
import { EstimateRidePayload, EstimateRideResponse, CreateRidePayload, CreateRideResponse } from '@/types/ride.types';



export const estimateRide = async (
    payload: EstimateRidePayload
): Promise<EstimateRideResponse> => {
    const { data } = await api.post<EstimateRideResponse>(
        "/rides/estimate",
        payload
    );

    return data;
};

export const getVehicles = async (distanceKm: number) => {
    const { data } = await api.post("/rides/vehicles", { distanceKm });
    return data;
};

export const createRide = async (payload: CreateRidePayload): Promise<CreateRideResponse> => {
    const { data } = await api.post<CreateRideResponse>("/rides/create", payload);
    return data;
}