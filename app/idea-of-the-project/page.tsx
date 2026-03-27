import { redirect } from "next/navigation"
import { defaultLocale } from "@/lib/i18n/locales"

export default function IdeaOfTheProjectRedirect() {
  redirect(`/${defaultLocale}/idea-of-the-project`)
}
