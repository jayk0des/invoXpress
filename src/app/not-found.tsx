import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold text-[var(--color-text)]">404</h1>
      <p className="mt-3 text-lg text-[var(--color-muted)]">Invoice not found.</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-[var(--color-brand)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Return Home
      </Link>
    </main>
  );
}
