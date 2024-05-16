"use client";
import Link from "next/link";
import next from "next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { formatDate } from "@/lib/time";


export default function MyBookPage() {
  const [mybooks, setMyBooks] = useState([]);
  const [collection, setCollection] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  
  function handleRedirect(url: string) {
    window.location.href = url;
  }

  const getMyBook = async () => {
    try {
      const response = await fetch("/api/mybook");
      const data = await response.json();
      setMyBooks(data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    }
  };

  const getMyCollections = async () => {
    try {
      const response = await fetch("/api/collection");
      const data = await response.json();
      setCollection(data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyBook();
    getMyCollections();
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
                      My Book
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                My Book
              </h2>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white">
        <div className="mx-auto px-4 py-2 sm:px-6">
          <div className="mt-2.5 space-y-16 sm:mt-16">
            <section key="My Book" aria-labelledby={`mybook-heading`}>
              <div className="space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4">
                <h2
                  id={`mybook-heading`}
                  className="text-lg font-medium text-gray-900 md:flex-shrink-0"
                >
                  My Book Created
                </h2>
                <div className="space-y-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                  <p className="text-sm font-medium text-gray-500"></p>
                  <div className="flex text-sm font-medium">
                    <a
                      href={`/dashboard/myBook/addBook`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Add New Book
                    </a>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <p className="text-center my-4">Loading...</p>
              ) : (
                <div className="mt-6 -mb-6 flow-root divide-y divide-gray-200 border-t border-gray-200">
                  {mybooks.map((book: Book) => (
                    <div key={book.book_id} className="py-6 sm:flex">
                      <div className="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
                        <img
                          src={`https://${book.img_url!}`}
                          alt={book.img_url!}
                          className="h-20 w-20 flex-none rounded-md object-cover object-center sm:h-48 sm:w-48"
                        />
                        <div className="min-w-0 flex-1 pt-1.5 sm:pt-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            <a href={`/dashboard/book/${book.book_id}`}>
                              {book.title}
                            </a>
                          </h3>
                          <p className="truncate text-sm text-gray-500">
                            <span>{book.desc}</span>{" "}
                            <span
                              className="mx-1 text-gray-400"
                              aria-hidden="true"
                            >
                              &middot;
                            </span>{" "}
                            <span>
                              {formatDate(book.updatedAt.toLocaleString())}
                            </span>
                          </p>
                          <p className="mt-1 font-medium text-gray-900">
                            {book.price}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4 sm:mt-0 sm:ml-6 sm:w-40 sm:flex-none">
                        <Link href={`/dashboard/myBook/editBook/${book.book_id}`}>
                          <button
                            type="button"
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                          >
                            Edit
                          </button>
                        </Link>

                        <button
                          type="button"
                          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                          onClick={() => handleRedirect(`/${book.book_url}`)}
                        >
                          Read Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* COLLECTION */}
          <div className="mt-2.5 space-y-16 sm:mt-16">
            <section key="My Book" aria-labelledby={`mybook-heading`}>
              <div className="space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4">
                <h2
                  id={`mybook-heading`}
                  className="text-lg font-medium text-gray-900 md:flex-shrink-0"
                >
                  My Collection Purchased
                </h2>
                <div className="space-y-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                  <p className="text-sm font-medium text-gray-500"></p>
                  <div className="flex text-sm font-medium">
                    <a
                      href={`/dashboard`}
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Find More Book
                    </a>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <p className="text-center my-4">Loading...</p>
              ) : (
                <div className="mt-6 -mb-6 flow-root divide-y divide-gray-200 border-t border-gray-200">
                  {collection.map((book: Collection) => (
                    <div key={book.book_id} className="py-6 sm:flex">
                      <div className="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
                        <img
                          src={`https://${book.book.img_url!}`}
                          alt={book.book.img_url!}
                          className="h-20 w-20 flex-none rounded-md object-cover object-center sm:h-48 sm:w-48"
                        />
                        <div className="min-w-0 flex-1 pt-1.5 sm:pt-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            <a href={`/dashboard/book/${book.book_id}`}>
                              {book.book.title}
                            </a>
                          </h3>
                          <p className="truncate text-sm text-gray-500">
                            <span>{book.book.desc}</span>{" "}
                            <span
                              className="mx-1 text-gray-400"
                              aria-hidden="true"
                            >
                              &middot;
                            </span>{" "}
                            <span>
                              Purchased At{" "}
                              {formatDate(book.updatedAt.toLocaleString())}
                            </span>
                          </p>
                          <p className="mt-1 font-medium text-gray-900">
                            {book.book.price}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4 sm:mt-0 sm:ml-6 sm:w-40 sm:flex-none">
                        <button
                          type="button"
                          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                          onClick={() =>
                            handleRedirect(`/${book.book.book_url}`)
                          }
                        >
                          Read Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}


