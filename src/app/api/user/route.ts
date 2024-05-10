import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { getSession } from "@/lib/session";


// GET User data
export async function GET(request: Request) {
    const session = await getSession();

    try {
        const user: User = await prisma.user.findUnique({
            where: {
                user_id: parseInt(session?.userId as string),
            }
        });

        if (user == null) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404, // Not Found
                }
            );
        } else {
            return NextResponse.json(
                {
                    success: true,
                    user: user,
                },
                {
                    status: 200, // OK
                }
            );
        }
    } catch (error) {
        console.error("Error fetching book details:", error);
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