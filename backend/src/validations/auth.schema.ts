import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Phone number is too short"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["customer", "driver", "admin"]),
    userType: z.enum(["individual", "business"]).optional(),
    vehicleType: z.enum(["bike", "pickups", "mini_truck", "truck"]).optional(),
});