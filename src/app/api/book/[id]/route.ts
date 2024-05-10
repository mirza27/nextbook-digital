import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";
import { getSession } from "@/lib/session";

interface Params {
    id: string;
}

// GET BUKU BY ID ====================================
export async function GET(request: Request, { params }: { params: Params }) {
    const book_id = parseInt(params.id);

    // ambil user id
    const session = await getSession();

    try {
        // Pengecekan jika id param kosong
        if (isNaN(book_id)) {
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

        const book = await prisma.book.findUnique({
            where: {
                book_id: book_id, // Menggunakan book_id yang sudah di-parse
            }, include: {
                category: true,
                user: true,
            },
        });

        if (!book) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Book data not found",
                    data: null,
                },
                {
                    status: 404, // Not Found
                }
            );
        } else {
            return NextResponse.json(
                {
                    success: true,
                    message: "Book data found",
                    data: book,
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

// UPDATE BUKU ====================================
export async function PATCH(request: Request, { params }: { params: Params }) {
    const book_id = parseInt(params.id);
    const {
        title,
        description,
        img_url,
        book_url,
        price,
        book_category_id,
    } = await request.json();

    try {
        // Pengecekan jika id param kosong
        if (isNaN(book_id)) {
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

        const updatedBook = await prisma.book.update({
            where: {
                book_id: book_id,
            },
            data: {
                title: title,
                desc: description,
                img_url: img_url,
                book_url: book_url,
                price: price,
                book_category_id: book_category_id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Book updated successfully",
                data: updatedBook,
            },
            {
                status: 200, // OK
            }
        );
    } catch (error) {
        console.error("Error updating book:", error);
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

// DELETE BUKU ====================================
export async function DELETE(request: Request, { params }: { params: Params }) {
    const book_id = parseInt(params.id);

    try {
        // Pengecekan jika id param kosong
        if (isNaN(book_id)) {
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

        await prisma.book.delete({
            where: {
                book_id: book_id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Book deleted successfully",
                data: null,
            },
            {
                status: 200, // OK
            }
        );
    } catch (error) {
        console.error("Error deleting book:", error);
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
