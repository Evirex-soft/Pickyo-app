export type EstimateRidePayload = {
    pickup: {
        lat: number;
        lng: number;
    };
    drop: {
        lat: number;
        lng: number;
    };
};

export type EstimateRideResponse = {
    distanceKm: number;
    durationMin: number;
    price: number;
};

export type LocationPayload = {
    address: string;
    lat: number;
    lng: number;
};

export type CreateRidePayload = {
    pickup: LocationPayload;
    drop: LocationPayload;
    distance: number;
    price: number;
    vehicleType: string;
};

export type Ride = {
    id: string;
    customerId: string;
    vehicleType: string;
    pickupLat: number;
    pickupLng: number;
    dropLat: number;
    dropLng: number;
    distanceKm: number;
    price: number;
    status: string;
    createdAt: string;
};

export type CreateRideResponse = {
    ride: Ride;
};