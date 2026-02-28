export type Role = "customer" | "driver" | "admin";

export type UserType = "individual" | "business";

export interface RegisterPayload {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    userType?: UserType;
    vehicleType?: string;
};


export interface BasicResponse {
    message: string;
}