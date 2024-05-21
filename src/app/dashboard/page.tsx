"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAllBooks = async () => {
    try {
      const response = await fetch("/api/book");
      const data = await response.json();
      setBooks(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllBooks();
    setIsLoading(false);
  }, []);

  return (
    <>
      <header className="mb-2.5">
        <div>
          <div>
            <nav className="sm:hidden" aria-label="Back">
              <a
                href="#"
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <ChevronLeftIcon
                  className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                Back
              </a>
            </nav>
            <nav className="hidden sm:flex" aria-label="Breadcrumb">
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div className="flex">
                    <a
                      href="#"
                      className="text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Dashboard
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      aria-hidden="true"
                    />
                    <a
                      href="#"
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Home
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Get your books
              </h2>
            </div>
          </div>
        </div>
      </header>

      <hr />
      <div className="bg-white">
        <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
          <h2 className="sr-only">Books</h2>
          {isLoading ? (
            <p className="text-center my-4">Loading...</p>
          ) : (
            <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
              {books?.map((book: Book) => (
                <div
                  key={book.book_id}
                  className="group relative border-r border-b border-gray-200 p-4 sm:p-6"
                >
                  <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                    <img
                      src={`https://${book.img_url}`}
                      alt={book.title}
                      className="h-full w-full object-cover object-center sm:h-48"
                    />
                  </div>
                  <div className="pt-10 pb-4 text-center">
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/dashboard/book/${book.book_id}`}>
                        <p className="hover:underline">
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {book.title}
                        </p>
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm text-gray-500">{book.desc}</p>
                    <p className="mt-4 text-base font-medium text-gray-900">
                      {book.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
