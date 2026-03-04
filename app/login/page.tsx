import { redirect } from "next/navigation"
import { defaultLocale } from "@/lib/i18n/locales"

export default function LoginRedirect() {
  redirect(`/${defaultLocale}/login`)
}
