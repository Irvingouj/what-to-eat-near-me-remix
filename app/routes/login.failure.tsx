import type { MetaFunction } from "@remix-run/react";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Login Failed" }];
};

export default function LoginFailure() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-red-600">Login Failed</h1>
        <p className="mb-6 text-center text-gray-600">
          We were unable to log you in. This could be due to:
        </p>
        <ul className="mb-6 list-disc pl-6 text-gray-600">
          <li>An authentication error with your provider</li>
          <li>Missing or invalid credentials</li>
          <li>A temporary system issue</li>
        </ul>
        <div className="text-center">
          <Link
            to="/login"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 