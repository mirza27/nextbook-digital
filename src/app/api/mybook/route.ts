import { NextResponse } from "next/server";
import prisma from "../../../../prisma";
import { getSession } from "@/lib/session";

// GET MY BOOK I added
export async function GET() {
    const session = await getSession();

    try {
        const books: Book[] = await prisma.book.findMany({
            where: {
                user_id: parseInt(session?.userId as string),
            }
        });


        return NextResponse.json(
            {
                success: true,
                message: "Book created successfully",
                data: books,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Error Collecting book:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to collect book",
                error: error,
            },
            {
                status: 500,
            }
        );
    }
}

