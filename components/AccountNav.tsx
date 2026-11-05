import Link from "next/link";

/** Header links of the client space and admin. Compact on phones so everything fits on one line. */
export function AccountNav({ email, admin }: { email?: string | null; admin?: boolean }) {
  const pill = "whitespace-nowrap rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium sm:px-4 sm:py-2 sm:text-[14px]";
  return (
    <div className="flex items-center gap-1.5 sm:gap-4">
      <span className="hidden text-muted md:inline">{email}</span>
      {admin && (
        <Link href="/admin" className={pill}>
          Admin
        </Link>
      )}
      <Link href="/account" className={pill}>
        <span className="sm:hidden">Orders</span>
        <span className="hidden sm:inline">My orders</span>
      </Link>
      <form action="/auth/logout" method="post">
        <button className="whitespace-nowrap rounded-full px-2 py-1.5 text-[13px] text-muted hover:text-ink sm:px-3 sm:py-2 sm:text-[14px]">Log out</button>
      </form>
    </div>
  );
}
