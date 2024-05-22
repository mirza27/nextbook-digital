"use client";

import { formatDate } from "@/lib/time";
import { UserIcon } from "@heroicons/react/20/solid";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const eventTypes = {
  applied: { icon: UserIcon, bgColorClass: "bg-gray-400" },
};
const timeline = [
  {
    id: 1,
    type: eventTypes.applied,
    content: "Applied to",
    target: "Front End Developer",
    date: "Sep 20",
    datetime: "2020-09-20",
  },
];
const books = [
  {
    id: 1,
    name: "title",
    date: "price",
    imageId: "1494790108377-be9c29b29330",
    body: "Ducimus quas delectus ad maxime totam doloribus reiciendis ex. Tempore dolorem maiores. Similique voluptatibus tempore non ut.",
  },
];

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const specificEventType = eventTypes.applied;
  const params = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [author, setAuthor] = useState<User>();
  const [buyedUser, setBuyedUser] = useState<Collection[]>([]);
  const router = useRouter();

  const getAuthor = async () => {
    try {
      const response = await fetch(`/api/author/${params.id}`);
      const data = await response.json();
      setAuthor(data.data);
      setBuyedUser(data.userBuyed);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    getAuthor();
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="min-h-full">
        <main className="py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqIcU3viBYjZFG-QKpWRF0_wusCpjEhVBg8TanplfNKg&s"
                    alt=""
                  />
                  <span
                    className="absolute inset-0 rounded-full shadow-inner"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {author?.name}
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Join on{" "}
                  <time dateTime="2020-08-25">
                    {formatDate(author?.createdAt.toLocaleString() ?? "")}
                  </time>
                </p>
              </div>
            </div>
          </div>
          {isLoading ? (
            <p className="text-center my-4">Loading...</p>
          ) : (
            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2 lg:col-start-1">
                {/* Description list*/}
                <section aria-labelledby="applicant-information-title">
                  <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h2
                        id="applicant-information-title"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Author Information
                      </h2>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Personal details and application.
                      </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Email
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {author?.email}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Book created
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {author?.books.length ?? 0}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Bio
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {author?.bio}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </section>

                {/* Books */}
                <section aria-labelledby="notes-title">
                  <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
                    <div className="divide-y divide-gray-200">
                      <div className="px-4 py-5 sm:px-6">
                        <h2
                          id="notes-title"
                          className="text-lg font-medium text-gray-900"
                        >
                          User Books
                        </h2>
                      </div>
                      <div className="px-4 py-6 sm:px-6">
                        <ul role="list" className="space-y-8">
                          {author?.books.map((book: Book) => (
                            <li key={book?.book_id}>
                              <div className="flex space-x-3">
                                <div className="flex-shrink-0">
                                  {book.img_url && (
                                    <img
                                      className="h-40 w-40 rounded-lg"
                                      src={`https://${book.img_url}`}
                                      alt=""
                                    />
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm">
                                    <a
                                      href="#"
                                      className="font-medium text-gray-900"
                                    >
                                      {book?.title}
                                    </a>
                                  </div>
                                  <div className="mt-1 text-sm text-gray-700">
                                    <p>{book?.category?.category_name}</p>
                                  </div>
                                  <div className="mt-2 space-x-2 text-sm">
                                    <span className="font-medium text-gray-500">
                                      {book?.price}
                                    </span>{" "}
                                    <span className="font-medium text-gray-500">
                                      &middot;
                                    </span>{" "}
                                    <button
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/book/${book?.book_id}`
                                        )
                                      }
                                      type="button"
                                      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                                    >
                                      Buy Book
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section
                aria-labelledby="timeline-title"
                className="lg:col-span-1 lg:col-start-3"
              >
                <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                  <h2
                    id="timeline-title"
                    className="text-lg font-medium text-gray-900"
                  >
                    People Who Buy
                  </h2>

                  {/* Activity Feed */}
                  <div className="mt-6 flow-root">
                    <ul role="list" className="-mb-8">
                      {buyedUser.map((collection, itemIdx) => (
                        <li key={collection.id}>
                          <div className="relative pb-8">
                            {itemIdx !== timeline.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span>
                                  <img
                                    className="h-8 w-8 rounded-full"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqIcU3viBYjZFG-QKpWRF0_wusCpjEhVBg8TanplfNKg&s"
                                    alt=""
                                  />
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    {collection.user.name}{" "}
                                    <a
                                      href="#"
                                      className="font-medium text-gray-900"
                                    ></a>
                                  </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  <time
                                    dateTime={formatDate(
                                      collection.updatedAt.toLocaleString()
                                    )}
                                  >
                                    {/* {item.date} */}
                                  </time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
