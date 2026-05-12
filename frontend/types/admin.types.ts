export interface DashboardStats {
    totalRevenue: number;
    revenueChange: number;
    activeTrips: number;
    onlineDrivers: number;
    pendingDisputes: number;

    chartData: {
        name: string;
        revenue: number;
        trips: number;
    }[];

    recentTrips: {
        riderName: string;
        driverName: string;
        pickup: string;
        dropoff: string;
        fare: number;
        status: string;
    }[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    _count: {
        ridesAsCustomer: number;
    };
    isActive: 'active' | 'blocked' | 'pending';
    createdAt: string;
    avatar?: string;
}

export interface Driver {
    id: string;
    userId: string;

    vehicleType: 'bike' | 'pickups' | 'mini_truck' | 'truck';

    rating: number;
    totalTrips: number;

    isOnline: boolean;
    isBusy: boolean;

    totalEarnings: number;

    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        isActive: boolean;
        createdAt: string;
    };

    vehicles: {
        plateNumber: string;
        type: 'bike' | 'pickups' | 'mini_truck' | 'truck';
    }[];
}