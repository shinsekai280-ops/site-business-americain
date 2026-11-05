import Link from "next/link";

export function AccountNav({ email, admin }: { email?: string | null; admin?: boolean }) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <span className="hidden text-muted md:inline">{email}</span>
      {admin && (
        <Link href="/admin" className="rounded-full border border-line bg-white px-4 py-2 font-medium">
          Admin
        </Link>
      )}
      <Link href="/account" className="rounded-full border border-line bg-white px-4 py-2 font-medium">
        My orders
      </Link>
      <form action="/auth/logout" method="post">
        <button className="rounded-full px-3 py-2 text-muted hover:text-ink">Log out</button>
      </form>
    </div>
  );
}
