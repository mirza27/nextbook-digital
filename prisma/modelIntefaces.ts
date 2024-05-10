// Book model interface
interface Book {
    book_id: number;
    title: string;
    desc?: string | null;
    img_url?: string | null;
    book_url?: string | null;
    price: number;
    user: User;
    user_id: number;
    category: BookCategory;
    book_category_id: number;
    createdAt: Date;
    updatedAt: Date;
}

// User model interface
interface User {
    user_id: number;
    name: string;
    email: string;
    password: string;
    bio?: string | null;
    credit: number;
    books: Book[];
}

// Collection model interface
interface Collection {
    collection_id: number;
    book: Book;
    book_id: number;
    createdAt: Date;
    updatedAt: Date;
}

// BookCategory model interface
interface BookCategory {
    book_category_id: number;
    category_name: string;
    books: Book[];
}
