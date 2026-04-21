"use client";

import { UserRound } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";

export function AppSidebar() {
  return (
    <aside className="fixed inset-x-0 top-0 z-40 h-20 bg-[#373b53] lg:inset-x-auto lg:left-0 lg:h-screen lg:w-18 lg:rounded-r-3xl lg:border-r lg:border-[var(--color-stroke)] lg:bg-[var(--color-surface)]">
      <div className="flex h-full items-center lg:hidden">
        <div className="relative h-20 w-18 shrink-0 overflow-hidden rounded-r-2xl bg-[var(--color-brand)]">
          <Image
            src="/invoice-logo.png"
            alt="InvoXpress logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-1 items-center justify-end gap-4 px-4">
          <ThemeToggle
            className="h-8 w-8 border-none bg-transparent text-[#7E88C3] hover:border-none hover:text-white"
            iconSize={16}
          />
          <div className="h-8 w-px bg-white/20" aria-hidden />
          <div
            className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white text-[#1E2139]"
            aria-label="User avatar"
            role="img"
          >
            <UserRound size={14} />
          </div>
        </div>
      </div>

      <div className="hidden h-full items-center justify-between px-4 lg:flex lg:flex-col lg:justify-between lg:px-0">
        <div className="relative h-24 w-full">
          <Image
            src="/invoice-logo.png"
            alt="InvoXpress logo"
            fill
            className="object-contain object-top"
            priority
          />
        </div>

        <div className="flex items-center gap-2 lg:flex-col lg:gap-3">
          <ThemeToggle />
          <div className="h-px w-8 bg-[var(--color-stroke)]" aria-hidden />
          <div
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-stroke)] bg-[var(--color-surface-strong)] text-[var(--color-text)]"
            aria-label="User avatar"
            role="img"
          >
            <UserRound size={18} />
          </div>
        </div>
      </div>
    </aside>
  );
}
