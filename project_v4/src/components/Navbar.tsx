"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "01" },
  { href: "/explore", label: "Explore", icon: "02" },
  { href: "/chips", label: "Chip Lab", icon: "03" },
  { href: "/saved", label: "Saved", icon: "04" },
  { href: "/lessons", label: "Lessons", icon: "05" },
  { href: "/questions", label: "Questions", icon: "06" },
  { href: "/industry", label: "Industry", icon: "07" },
  { href: "/career", label: "Career", icon: "08" },
  { href: "/companies", label: "Companies", icon: "09" },
  { href: "/checklist", label: "Checklist", icon: "10" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-cyan-400/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="group flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 shadow-[0_0_24px_rgba(87,212,255,0.16)]">
                <span className="font-mono text-sm font-semibold tracking-[0.3em] text-cyan-200">
                  EP
                </span>
              </div>
              <div>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.35em] text-cyan-300/80">
                  Embedded Toolkit
                </p>
                <p className="text-lg font-semibold text-slate-50 transition group-hover:text-cyan-200">
                  EmbedPrep Control Deck
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 lg:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,255,211,0.9)]" />
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.25em] text-emerald-100">
                System Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            {!isLoaded ? (
              <div className="h-10 w-10 animate-pulse rounded-full border border-cyan-300/20 bg-slate-800/70" />
            ) : isSignedIn ? (
              <div className="rounded-full border border-cyan-300/20 bg-slate-900/70 p-1">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="rounded-xl border border-cyan-300/30 bg-cyan-400/90 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-flex min-w-full gap-2 rounded-2xl border border-cyan-300/10 bg-slate-900/65 p-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-cyan-400/16 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(87,212,255,0.25)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  }`}
                >
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-cyan-300/70">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
