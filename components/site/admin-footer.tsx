import Link from "next/link"
import { isAdmin } from "@/lib/auth"

export async function AdminFooter() {
  const admin = await isAdmin()
  if (!admin) return null

  return (
    <footer className="border-t py-4 mt-auto">
      <div className="container mx-auto px-4 flex justify-center">
        <Link
          href="/admin"
          className="inline-flex items-center justify-center w-[300px] h-12 rounded-md text-base font-medium bg-amber-200/60 hover:bg-amber-200/80 text-amber-900 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-100 transition-colors"
        >
          Admin
        </Link>
      </div>
    </footer>
  )
}
