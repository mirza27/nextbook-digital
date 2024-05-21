import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {

    const session = await getSession();

    if (!session) {
        return NextResponse.json({
            success: false,
            data: null,
            message: "No session found",
        }, {
            status: 400
        });
    }

    try {
        const authors = await prisma.user.findMany({
            where: {
                user_id: {
                    not: parseInt(session?.userId as string),
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: authors,
            message: "Authors fetched successfully",
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Error fetching book categories:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve book categories",
                error: error,
            },
            {
                status: 500,
            }
        );
    }
}