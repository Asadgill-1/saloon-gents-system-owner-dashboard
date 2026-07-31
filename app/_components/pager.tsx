"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function Pager({ cursorKey, nextCursor }: { cursorKey: string; nextCursor: string | null }) {
  const pathname = usePathname(); const current = useSearchParams();
  const href = (cursor: string | null) => { const params = new URLSearchParams(current.toString()); if (cursor) params.set(cursorKey, cursor); else params.delete(cursorKey); return `${pathname}?${params}`; };
  if (!nextCursor && !current.has(cursorKey)) return null;
  return <nav aria-label="Pagination" className="flex justify-end gap-3 border-t border-stone-200 p-4">
    {current.has(cursorKey) && <Link href={href(null)} className="flex min-h-[44px] items-center rounded-lg border border-stone-300 px-4 text-sm font-bold text-stone-700 hover:bg-stone-100">First page</Link>}
    {nextCursor && <Link href={href(nextCursor)} className="flex min-h-[44px] items-center rounded-lg bg-stone-900 px-4 text-sm font-bold text-yellow-400 hover:bg-stone-800">Next 50</Link>}
  </nav>;
}
