"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import next from "next";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://cywxxjvvycwkbndxufbk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3h4anZ2eWN3a2JuZHh1ZmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyNjMxNDQsImV4cCI6MjAzMTgzOTE0NH0.Tbgu20t6W467n1YuIvfitXorggdYU6ajmLapnLRlI08"
);

export default function AddBook() {
  const [book, setBook] = useState<Book | undefined>();
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const addHttp = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return "http://" + url;
    }
    return url;
  };

  const addNewBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!book) {
      throw new Error("Book data is undefined");
    }

    try {
      setIsLoading(true);
      let imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        imageUrl = imageUrl.replace(/^https?:\/\//, "");
        console.log(imageUrl);
      }

      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: book.title,
          description: book.desc,
          img_url: imageUrl,
          book_url: addHttp(book.book_url as string),
          price: book.price,
          book_category_id: book.book_category_id,
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
      console.error("Error insert book:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to add new book.",
      });
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

  // rubah file image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageFileName(e.target.files[0].name);
    }
  };

  const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage
      .from("profile_image")
      .upload(`/book_cover/${file.name}`, file);
    if (error) {
      throw new Error(`Failed to upload image ${error.message}`);
    }
    const imageUrl = supabase.storage
      .from("profile_image")
      .getPublicUrl(data.path).data.publicUrl;
    return imageUrl;
  };

  useEffect(() => {
    getCategories();
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
                      Add Book
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Add New Book
              </h2>
            </div>
          </div>
        </div>
      </header>

      <form className="space-y-6" action="#" onSubmit={addNewBook}>
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
                  value={book?.title ?? ""}
                  onChange={(e) => setBook({ ...book!, title: e.target.value })}
                  id="email-address"
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
                      http://
                    </span>
                    <input
                      type="text"
                      name="company-website"
                      id="company-website"
                      value={book?.book_url ?? ""}
                      onChange={(e) =>
                        setBook({ ...book!, book_url: e.target.value })
                      }
                      className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="www.example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Cover photo
                </label>

                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        {imageFileName ? ( // Tampilkan nama file yang dipilih
                          <p className="text-sm text-gray-500">
                            {imageFileName}
                          </p>
                        ) : (
                          <p className="pl-1">or drag and drop</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                    </div>
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
                  value={book?.price ?? ""}
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
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  value={book?.book_category_id ?? ""}
                  onChange={(e) =>
                    setBook({
                      ...book!,
                      book_category_id: parseInt(e.target.value),
                    })
                  }
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
            disabled={isLoading}
          >
            {isLoading ? "Loading.." : "Add"}
          </button>
        </div>
      </form>
    </>
  );
}
