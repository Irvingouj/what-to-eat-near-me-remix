import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-red-100 p-4">
      <div className="max-w-sm w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <Outlet />
      </div>
    </div>
  );
} 