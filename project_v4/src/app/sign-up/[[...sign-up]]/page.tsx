import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { isClerkEnabled } from "@/lib/authConfig";

export default function SignUpPage() {
  if (!isClerkEnabled) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/45 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-cyan-300/75">
            Local Demo Mode
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-50">
            Account creation is not configured
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Add Clerk environment variables to enable accounts and saved study items.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl border border-cyan-300/30 bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <SignUp />
    </div>
  );
}
