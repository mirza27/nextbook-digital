import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";



interface Params {
    id: string;
}

// Get author and their book
export async function GET(request: Request, { params }: { params: Params }) {
    const author_id = parseInt(params.id);
    console.log("penulis", author_id);

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
        console.log(author);

        if (!author) {
            throw new Error("Author not found");
        }

        // ambil data user yang beli
        const collections = await prisma.collection.findMany({
            where: {
                book_id: {
                    in: author.books.map(book => book.book_id)
                }
            },
            include: {
                user: true,
            },
            take: 3, // Batasi hasil hingga 3
            orderBy: {
                createdAt: 'desc' // Urutkan hasil dari yang terbaru
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: "Successfully retrieved author and book data",
                data: author,
                userBuyed: collections,
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
