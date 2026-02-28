import { z } from "zod";

const roleEnum = z.enum(["customer", "driver"]);

const vehicleEnum = z.enum([
    "bike",
    "pickups",
    "mini_truck",
    "truck",
]);

const userTypeEnum = z.enum([
    "individual",
    "business",
]);


export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name cannot exceed 50 characters")
            .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters"),

        email: z
            .string()
            .email("Invalid email format")
            .toLowerCase(),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .regex(
                /^(?=.*[A-Z])(?=.*[0-9])/,
                "Password must contain at least 1 uppercase letter and 1 number"
            ),

        phone: z
            .string()
            .regex(/^[6-9]\d{9}$/, "Invalid mobile number"), // Indian format

        role: roleEnum,

        userType: userTypeEnum.optional(),

        vehicleType: vehicleEnum.optional(),
    })
    .superRefine((data, ctx) => {
        if (data.role === "customer" && !data.userType) {
            ctx.addIssue({
                path: ["userType"],
                message: "User type is required for customers",
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.role === "driver" && !data.vehicleType) {
            ctx.addIssue({
                path: ["vehicleType"],
                message: "Vehicle type is required for drivers",
                code: z.ZodIssueCode.custom,
            });
        }
    });