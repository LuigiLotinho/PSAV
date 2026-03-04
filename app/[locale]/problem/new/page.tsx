import { NewProblemForm } from "@/components/forms/NewProblemForm"
import { type Locale } from "@/lib/i18n/locales"

type PageProps = {
  params: Promise<{ locale: Locale }>
}

export default async function NewProblemPage({ params }: PageProps) {
  const { locale } = await params
  return <NewProblemForm locale={locale} />
}
