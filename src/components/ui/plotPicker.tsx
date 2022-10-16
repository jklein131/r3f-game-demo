import React from 'react';

const files = [
    {
        title: 'Plot 2X-981',
        size: '3.9 MB',
        source: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
    },
    {
        title: 'Plot K8-764',
        size: '3.9 MB',
        source: 'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
    },
    // More files...
];

export default function PlotPicker() {
    const [pickedPlot, setPickedPlot] = React.useState('');
    const FormReady = true;
    const checkoutForm = (
        <section
            aria-labelledby="payment-and-shipping-heading"
            className=" lg:mx-auto lg:w-full lg:max-w-lg lg:pt-0"
        >
            <h2 id="payment-and-shipping-heading" className="sr-only">
                Payment and shipping details
            </h2>

            <form>
                <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                    <div>
                        <h3
                            id="contact-info-heading"
                            className="text-lg font-medium text-gray-900"
                        >
                            Contact information
                        </h3>

                        <div className="mt-6">
                            <label
                                htmlFor="email-address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    id="email-address"
                                    name="email-address"
                                    autoComplete="email"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-lg font-medium text-gray-900">
                            Payment details
                        </h3>

                        <div className="mt-6 grid grid-cols-3 gap-y-6 gap-x-4 sm:grid-cols-4">
                            <div className="col-span-3 sm:col-span-4">
                                <label
                                    htmlFor="card-number"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Card number
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="card-number"
                                        name="card-number"
                                        autoComplete="cc-number"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2 sm:col-span-3">
                                <label
                                    htmlFor="expiration-date"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Expiration date (MM/YY)
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="expiration-date"
                                        id="expiration-date"
                                        autoComplete="cc-exp"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="cvc"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    CVC
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="cvc"
                                        id="cvc"
                                        autoComplete="csc"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-lg font-medium text-gray-900">
                            Shipping address
                        </h3>

                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Address
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        autoComplete="street-address"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    City
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        autoComplete="address-level2"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="region"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    State / Province
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="region"
                                        name="region"
                                        autoComplete="address-level1"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="postal-code"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Postal code
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="postal-code"
                                        name="postal-code"
                                        autoComplete="postal-code"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 mb-5">
                        <h3 className="text-lg font-medium text-gray-900">
                            Billing information
                        </h3>

                        <div className="mt-6 flex items-center">
                            <input
                                id="same-as-shipping"
                                name="same-as-shipping"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="ml-2">
                                <label
                                    htmlFor="same-as-shipping"
                                    className="text-sm font-medium text-gray-900"
                                >
                                    Same as shipping information
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={
                            'inline-flex mt-5 w-full justify-center rounded-md border border-gray-300 ' +
                            (FormReady
                                ? 'bg-green-600 text-white hover:bg-green-500'
                                : 'bg-gray text-gray-700 ') +
                            ' px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:text-sm'
                        }
                        onClick={() => window.location.replace('/mine')}
                    >
                        {FormReady ? 'Checkout' : 'Please Fill Out Form'}
                    </button>
                </div>
            </form>
        </section>
    );
    return files.find(t => t.title === pickedPlot) !== undefined ? (
        checkoutForm
    ) : (
        <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-1 sm:gap-x-6 lg:grid-cols-2 xl:gap-x-8"
        >
            {files.map(file => (
                <li key={file.source} className="relative">
                    <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                        <img
                            src={file.source}
                            alt=""
                            className="pointer-events-none object-cover group-hover:opacity-75"
                        />
                        <button
                            onClick={() => setPickedPlot(file.title)}
                            type="button"
                            className="absolute inset-0 focus:outline-none"
                        >
                            <span className="sr-only">
                                View details for {file.title}{' '}
                            </span>
                        </button>
                    </div>

                    <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                        {file.title}
                    </p>
                    <p className="pointer-events-none block text-sm font-medium text-gray-500">
                        {file.size}
                    </p>
                </li>
            ))}
        </ul>
    );
}
