'use client'
import next from "next";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const orders = [
    {
      number: '4376',
      status: 'Delivered on January 22, 2021',
      href: '#',
      invoiceHref: '#',
      products: [
        {
          id: 1,
          name: 'Machined Brass Puzzle',
          href: '#',
          price: '$95.00',
          color: 'Brass',
          size: '3" x 3" x 3"',
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/order-history-page-07-product-01.jpg',
          imageAlt: 'Brass puzzle in the shape of a jack with overlapping rounded posts.',
        },
        // More products...
      ],
    },
    // More orders...
  ]
  
  export default function MyBookPage() {
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
            {orders.map((order) => (
              <section key={order.number} aria-labelledby={`${order.number}-heading`}>
                <div className="space-y-1 md:flex md:items-baseline md:space-y-0 md:space-x-4">
                  <h2 id={`${order.number}-heading`} className="text-lg font-medium text-gray-900 md:flex-shrink-0">
                    Order #{order.number}
                  </h2>
                  <div className="space-y-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                    <p className="text-sm font-medium text-gray-500">{order.status}</p>
                    <div className="flex text-sm font-medium">
                      <a href={order.href} className="text-indigo-600 hover:text-indigo-500">
                        Manage order
                      </a>
                      <div className="ml-4 border-l border-gray-200 pl-4 sm:ml-6 sm:pl-6">
                        <a href={order.invoiceHref} className="text-indigo-600 hover:text-indigo-500">
                          View Invoice
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="mt-6 -mb-6 flow-root divide-y divide-gray-200 border-t border-gray-200">
                  {order.products.map((product) => (
                    <div key={product.id} className="py-6 sm:flex">
                      <div className="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="h-20 w-20 flex-none rounded-md object-cover object-center sm:h-48 sm:w-48"
                        />
                        <div className="min-w-0 flex-1 pt-1.5 sm:pt-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            <a href={product.href}>{product.name}</a>
                          </h3>
                          <p className="truncate text-sm text-gray-500">
                            <span>{product.color}</span>{' '}
                            <span className="mx-1 text-gray-400" aria-hidden="true">
                              &middot;
                            </span>{' '}
                            <span>{product.size}</span>
                          </p>
                          <p className="mt-1 font-medium text-gray-900">{product.price}</p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4 sm:mt-0 sm:ml-6 sm:w-40 sm:flex-none">
                        <button
                          type="button"
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                        >
                          Buy again
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                        >
                          Shop similar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      </>
    )
  }
  