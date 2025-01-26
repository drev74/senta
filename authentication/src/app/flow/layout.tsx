import React from "react";

import { ThemeToggle } from "@/components/themeToggle";

export default function FlowLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center space-y-4">
      <div className="absolute right-4 top-4 flex items-center space-x-4">
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
