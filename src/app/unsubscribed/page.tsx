import Link from "next/link";

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          Successfully Unsubscribed
        </h2>
        <p className="mt-2 text-gray-600">
          You have been successfully unsubscribed from our newsletter.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          We're sorry to see you go. You can resubscribe anytime.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
