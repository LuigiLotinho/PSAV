import { NewSolutionForm } from "@/components/forms/NewSolutionForm"
import { type Locale } from "@/lib/i18n/locales"

type PageProps = {
  params: Promise<{ locale: Locale }>
}

export default async function NewSolutionPage({ params }: PageProps) {
  const { locale } = await params
  return <NewSolutionForm locale={locale} />
}
