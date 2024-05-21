"use client";
import next from "next";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import Swal from "sweetalert2";
import Link from "next/link";

export default function BooksPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [book, setBook] = useState<Book | undefined>();
  const [collection, setCollection] = useState<Collection | undefined>();
  const [isPurchased, setIsPurchased] = useState(false);

  const handlePurchase = async (bookId: Number) => {
    try {
      const result = await Swal.fire({
        title: "Confirm Purchase",
        text: "Are you sure you want to purchase this book?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, purchase it!",
      });

      if (result.isConfirmed) {
        // Proceed with purchase
        const response = await fetch("/api/collection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            book_id: bookId,
          }),
        });
        const data = await response.json();

        if (response.ok) {
          // Handle successful purchase
          Swal.fire("Success!", "Book purchased successfully!", "success");
          setIsPurchased(true);
        } else {
          // Handle error cases
          Swal.fire(
            "Error!",
            data.message || "Failed to purchase the book.",
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error purchasing book:", error);
      Swal.fire("Error!", "Failed to purchase the book.", "error");
    }
  };

  const getBook = async () => {
    try {
      const response = await fetch(`/api/book/${params.id}`);
      const data = await response.json();
      setBook(data.data);
      console.log(response);
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
    }
  };

  const checkIfbookIsPurchased = async () => {
    if (book && collection) {
      const purchasedBook = collection.find(
        (item: any) => item.book_id === book.book_id
      );
      setIsPurchased(!!purchasedBook); // Set isPurchased menjadi true jika buku telah dibeli
    }
  };

  useEffect(() => {
    getBook();
    getMyCollections();
  }, []);

  useEffect(() => {
    checkIfbookIsPurchased();
  }, [book, collection]);

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
                      Book Detail
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Book Detail
              </h2>
            </div>
          </div>
        </div>
      </header>
      {book ? (
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Book Detail Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {book.title} by {book.user.name}
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Book Title
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {book.title}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Descryption / Synopsis
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {book.desc}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {book.category.category_name}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Author</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {book.user.name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  ${book.price}
                </dd>
              </div>
              {isPurchased ? (
                <>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Buy Book
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <ul
                        role="list"
                        className="divide-y divide-gray-200 rounded-md border border-gray-200"
                      >
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 w-0 flex-1 truncate">
                              book_url.pdf
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <Link
                              href={"https://" + book?.book_url ?? ""}
                              target="_blank"
                            >
                              {" "}
                              <p className="font-medium text-indigo-600 hover:text-indigo-500">
                                Download
                              </p>
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Book URL / Book file
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <ul
                        role="list"
                        className="divide-y divide-gray-200 rounded-md border border-gray-200"
                      >
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                          <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <div>
                              {/* Tombol Purchase */}
                              <button
                                onClick={() => handlePurchase(book.book_id)}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Purchase (Click to buy)
                              </button>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
