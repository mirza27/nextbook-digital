import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";
import { getSession } from "@/lib/session";


interface Params {
    id: string;
}


// Get author and their book
export async function GET(request: Request, { params }: { params: Params }) {
    const author_id = parseInt(params.id);

    try {
        if (isNaN(author_id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid author id",
                    data: null

                }, {
                status: 400
            });
        }

        const author = await prisma.user.findUnique({
            where: {
                user_id: author_id
            }, include: {
                books: true,
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: "Successfully retrieved author and book data",
                data: author,
            },
            {
                status: 200,
            }
        );


    } catch (error) {
        console.error("Error fetching author and their book:", error);
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
