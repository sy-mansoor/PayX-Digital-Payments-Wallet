"use client";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full m-0 p-0">
      <body className="w-full h-full m-0 p-0">
        <Toaster position="top-center" richColors />
        <div className="flex w-full h-full">
          <div className="flex-1">
            <main className="w-full h-full">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}