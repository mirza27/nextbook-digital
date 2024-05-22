"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Swal from "sweetalert2";
import { FormEvent } from "react";
import next from "next";

export default function EditBook() {
  const params = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [book, setBook] = useState<Book | undefined>();
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [choosedCategory, setChoosedCategory] = useState<string>("");
  const router = useRouter();

  const getBookData = async () => {
    try {
      const response = await fetch(`/api/book/${params.id}`);
      const data = await response.json();
      setBook(data.data);
      setChoosedCategory(data.data.book_category_id);
    } catch (error) {
      console.error("Error fetching book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const saveBookData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!book) {
      throw new Error("Book data is undefined");
    }

    try {
      const response = await fetch(`/api/book/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: book.title,
          description: book.desc,
          img_url: book.img_url,
          book_url: book.book_url,
          price: book.price,
          book_category_id: parseInt(choosedCategory),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
        });

        router.push("/dashboard/myBook");
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Error saving book:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save book.",
      });
    }
  };

  useEffect(() => {
    getCategories();
    getBookData();
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
                      Edit Book
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Edit your book
              </h2>
            </div>
          </div>
        </div>
      </header>
      {!book ? (
        <p className="text-center my-4">Loading...</p>
      ) : (
        <form
          className="space-y-6"
          action="#"
          method="ATCH"
          onSubmit={saveBookData}
        >
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Book Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
              <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
                <div className="col-span-4 sm:col-span-4">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Book Title
                  </label>
                  <input
                    type="text"
                    name="email-address"
                    id="email-address"
                    value={book!.title}
                    onChange={(e) =>
                      setBook({ ...book!, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Synopsis or Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      name="about"
                      rows={3}
                      value={book?.desc || ""}
                      onChange={(e) =>
                        setBook({ ...book!, desc: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Story of..."
                      defaultValue={""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="company-website"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Book url / pdf url
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        http:// {}
                      </span>
                      <input
                        type="text"
                        name="company-website"
                        id="company-website"
                        value={book!.book_url ?? ""}
                        onChange={(e) =>
                          setBook({ ...book!, book_url: e.target.value })
                        }
                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="www.example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="company-website"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Book cover url
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                        http://
                      </span>
                      <input
                        type="text"
                        name="company-website"
                        id="company-website"
                        value={book!.img_url ?? ""}
                        onChange={(e) =>
                          setBook({ ...book!, img_url: e.target.value })
                        }
                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="www.example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-4 sm:col-span-4">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="email-address"
                    id="email-address"
                    value={book!.price as number}
                    onChange={(e) =>
                      setBook({ ...book!, price: parseInt(e.target.value) })
                    }
                    placeholder="60000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Book Categories
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={choosedCategory}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setChoosedCategory(e.target.value)
                    }
                    autoComplete="category-name"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  >
                    {categories.map((category: BookCategory) => (
                      <option
                        key={category.book_category_id}
                        value={category.book_category_id}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </>
  );
}
