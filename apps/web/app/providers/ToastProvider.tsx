"use client";

import { Toaster } from "sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-center" theme="dark" />
    </>
  );
}
