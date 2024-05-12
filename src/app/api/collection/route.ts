import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../../prisma';
import { getSession } from "@/lib/session";


// GET all my collection
export async function GET() {
    const session = await getSession();

    try {
        const collection: Collection[] = await prisma.collection.findMany({
            where: {
                user: {
                    user_id: parseInt(session?.userId as string),
                }
            },
            include: {
                book: true,
            }
        })


        return NextResponse.json(
            {
                success: true,
                message: "Successfully retrieved book data",
                data: collection,
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

// BUY BOOK / add to collection
export async function POST(request: Request) {
    const {
        book_id,
    } = await request.json();

    const session = await getSession();

    try {
        if (book_id == null) {
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


        const user: User | null = await prisma.user.findUnique({
            where: {
                user_id: parseInt(session?.userId as string)
            },
        })

        const book: Book = await prisma.book.findUnique({
            where: {
                book_id: book_id,

            }, include: {
                user: true,
            }
        });

        // jika buku user sendiri
        if (user!.user_id == book.user_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You cannot collect your own book",
                    data: null,
                },
                {
                    status: 400, // Bad Request
                }
            )
        }


        if (user!.credit < book.price) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Insufficient credit",
                    data: null,
                },
                {
                    status: 400, // Bad Request
                }
            );
        } else {
            // tambah ke koleksi user
            const collection: Collection = await prisma.collection.create({


                data: {
                    user: {
                        connect: {
                            user_id: parseInt(session?.userId as string)
                        }
                    },
                    book: {
                        connect: {
                            book_id: book_id,
                        }
                    }
                }
            });

            // update credit user
            await prisma.user.update({
                where: {
                    user_id: parseInt(session?.userId as string)
                },
                data: {
                    credit: user!.credit - book.price
                }
            });

            // update author credit
            await prisma.user.update({
                where: {
                    user_id: book.user_id
                },
                data: {
                    credit: book.user.credit + book.price
                }
            });
        }

        return NextResponse.json(
            {
                success: true,
                message: "Succes add book to collection",
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Error purchase book:", error);
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