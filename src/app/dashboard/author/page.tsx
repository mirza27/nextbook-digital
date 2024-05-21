"use client";
import next from "next";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function AuthorPage() {
  const [authors, setAuthors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getAuthors = async () => {
    try {
      const response = await fetch("/api/author");
      const data = await response.json();
      setAuthors(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAuthors();
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
                      Authors
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Authors
              </h2>
            </div>
          </div>
        </div>
      </header>
      {isLoading ? (
        <p className="text-center my-4">Loading...</p>
      ) : (
        <div className="bg-white">
          <div className="mx-auto max-w-7xl pt-2 pb-12 px-6 text-center lg:px-8 ">
            <div className="space-y-8 sm:space-y-12">
              <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                  All of the authors
                </h2>
                <p className="text-xl text-gray-500">Find your best author</p>
              </div>
              <ul
                role="list"
                className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-12 xl:grid-cols-6"
              >
                {authors?.map((author: User) => (
                  <li key={author.user_id}>
                    <div
                      className="space-y-4"
                      onClick={() =>
                        (window.location.href = `/dashboard/author/${author.user_id}`)
                      }
                    >
                      <img
                        className="mx-auto h-20 w-20 rounded-full lg:h-24 lg:w-24"
                        src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                        alt=""
                      />
                      <div className="space-y-2">
                        <div className="text-xs font-medium lg:text-sm">
                          <h3>{author.name}</h3>
                          <p className="text-indigo-600">
                            {author.bio}
                            {author.books?.length ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
