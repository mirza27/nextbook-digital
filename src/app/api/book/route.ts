// import prisma instance and necessary types
import { NextResponse } from "next/server";
import prisma from '../../../../prisma';
import { getSession } from "@/lib/session";

// GET all books
export async function GET() {
    try {
        const books = await prisma.book.findMany({
            include: {
                category: true,
                user: true,

            }
        });

        return NextResponse.json(
            {
                success: true,
                message: "Successfully retrieved book data",
                data: books,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error fetching books:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve book data",
                error: error,
            },
            {
                status: 500,
            }
        );
    }
}

// POST a new book
export async function POST(request: Request) {
    const {
        title,
        description,
        img_url,
        book_url,
        price,
        book_category_id,
    } = await request.json();


    const session = await getSession();

    try {
        const newBook = await prisma.book.create({
            data: {
                title: title,
                desc: description,
                img_url: img_url,
                book_url: book_url,
                price: price,
                user_id: parseInt(session?.userId as string),
                book_category_id: book_category_id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Book created successfully",
                data: newBook,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Error creating book:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create book",
                error: error,
            },
            {
                status: 500,
            }
        );
    }
}
