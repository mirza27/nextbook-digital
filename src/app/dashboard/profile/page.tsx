"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  "https://cywxxjvvycwkbndxufbk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3h4anZ2eWN3a2JuZHh1ZmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyNjMxNDQsImV4cCI6MjAzMTgzOTE0NH0.Tbgu20t6W467n1YuIvfitXorggdYU6ajmLapnLRlI08"
);
export default function UserProfile() {
  const [user, setUser] = useState<User | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const getUserProfile = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.log(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // rubah file image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File) => {
    const { data, error } = await supabase.storage
      .from("profile_image")
      .upload(`/${file.name}`, file);
    if (error) {
      throw new Error(`Failed to upload image ${error.message}`);
    }
    const imageUrl = supabase.storage
      .from("profile_image")
      .getPublicUrl(data.path).data.publicUrl;
    return imageUrl;
  };

  const saveProfileData = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    if (!user) {
      throw new Error("User is undefined");
    }

    try {
      let imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        console.log(imageUrl);
      }

      console.log(user);
      const response = await fetch(`/api/user/${user.user_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name!,
          email: user.email!,
          bio: user.bio!,
          credit: user.credit!,
          img_url: imageUrl ?? user.img_url,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
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
                      Profile
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                My Profile
              </h2>
            </div>
          </div>
        </div>
      </header>

      {isLoading || !user ? (
        <p className="text-center my-4">Loading...</p>
      ) : (
        <form
          className="space-y-6"
          action="#"
          method="PATCH"
          onSubmit={saveProfileData}
        >
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Personal Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information
                </p>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="grid grid-cols-6 gap-6">
                  <div className="sm:col-span-6">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Photo
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                        {user.img_url ? (
                          <img
                            src={user.img_url}
                            alt="Profile"
                            className="h-full w-full"
                          />
                        ) : (
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="ml-5"
                        onChange={handleImageChange}
                      />
                    </div>{" "}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      value={user!.name}
                      onChange={(e) =>
                        setUser({ ...user!, name: e.target.value })
                      }
                      autoComplete="given-name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      type="text"
                      name="email-address"
                      id="email-address"
                      value={user!.email}
                      onChange={(e) =>
                        setUser({ ...user!, email: e.target.value })
                      }
                      autoComplete="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bio
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        value={user!.bio ?? ""}
                        onChange={(e) =>
                          setUser({ ...user!, bio: e.target.value! })
                        }
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Write something about yourself"
                        defaultValue={""}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Credit
                    </label>
                    <input
                      type="number"
                      name="postal-code"
                      id="postal-code"
                      value={user!.credit}
                      onChange={(e) =>
                        setUser({ ...user!, credit: parseInt(e.target.value) })
                      }
                      autoComplete="postal-code"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              <Link href={"/dashboard"}>Cancel</Link>
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? "Loading..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
