import { NextResponse } from "next/server";
import prisma from '../../../../prisma';


// get all categories
export async function GET() {
    try {
        const categories: BookCategory[] = await prisma.bookCategory.findMany(
            {include : {
                books: true
            }}
        );

        return NextResponse.json(
            {
                success: true,
                message: "Successfully retrieved book data",
                data: categories,
            },
            {
                status: 200,
            }
        );
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