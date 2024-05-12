"use client";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/dashboard/", current: true },
  { name: "Authors", href: "/dashboard/author", current: false },
  { name: "My Book", href: "/dashboard/myBook", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "/dashboard/profile" },
  { name: "Sign out", },
];

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>();

  const getUserProfile = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.log(error);
      Swal.fire("Error!", "You Have to login first!", "error");
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <>
      <div className="min-h-full">
        <div className="bg-gray-800 pb-32">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="border-b border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8"
                            src="https://plus.unsplash.com/premium_vector-1711505230579-e446d3e5b86f?bg=FFFFFF&q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
                            "
                            alt="Your Company"
                          />
                        </div>
                        <div className="hidden md:block">
                          <div className="ml-10 flex items-baseline space-x-4">
                            {navigation.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                  "px-3 py-2 rounded-md text-sm font-medium"
                                )}
                                aria-current={item.current ? "page" : undefined}
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                          {/* Profile dropdown */}
                          {user ? (
                            <>
                              <Menu as="div" className="relative ml-3">
                                <div>
                                  <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="sr-only">
                                      Open user menu
                                    </span>
                                    <img
                                      className="h-8 w-8 rounded-full bg-cover-circle"
                                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmyoQ5HI7MXBYtxT9xBSpbUvVbcUPgpJaIOHfgP3_ahQ&s"
                                      alt=""
                                    />
                                  </Menu.Button>
                                </div>
                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {userNavigation.map((item) => (
                                      <Menu.Item key={item.name}>
                                        {({ active }) => (
                                          <a
                                            href={item.href}
                                            className={classNames(
                                              active ? "bg-gray-100" : "",
                                              "block px-4 py-2 text-sm text-gray-700"
                                            )}
                                          >
                                            {item.name}
                                          </a>
                                        )}
                                      </Menu.Item>
                                    ))}
                                  </Menu.Items>
                                </Transition>
                              </Menu>
                            </>
                          ) : (
                            <Link href={`/login`}>
                              <button
                                type="button"
                                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                              >
                                Login
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <XMarkIcon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          ) : (
                            <Bars3Icon
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </Disclosure.Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="border-b border-gray-700 md:hidden">
                  <div className="space-y-1 px-2 py-3 sm:px-3">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 pt-4 pb-3">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          // src={user.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">
                          {user?.name}
                        </div>
                        <div className="text-sm font-medium leading-none text-gray-400">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
              {children}
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  );
}
