import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";
import { getSession } from "@/lib/session";


interface Params {
    id: string;
}

// update user profile
export async function PATCH(request: Request, { params }: { params: Params }) {
    const user_id = parseInt(params.id);
    const session = await getSession();
    const {
        name,
        email,
        bio,
        credit,
    } = await request.json();

    try {
        if (isNaN(parseInt(session?.userId as string)) || isNaN(user_id) || user_id !== parseInt(session?.userId as string)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID cannot be empty or must be a valid number",
                    data: null,
                },
                {
                    status: 400, // Bad Request
                }
            );
        }

        const updatedUser = await prisma.user.update({
            where: {
                user_id: parseInt(session?.userId as string)
            },
            data: {
                name,
                email,
                bio,
                credit,
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: "Profile updated successfully",
                data: updatedUser,
            },
            {
                status: 200, // OK
            }
        );
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
                error: error,
            },
            {
                status: 500, // Internal Server Error
            }
        );
    }
}
