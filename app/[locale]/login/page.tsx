import { Suspense } from "react"
import LoginForm from "@/app/login/LoginForm"
import { type Locale } from "@/lib/i18n/locales"

type PageProps = {
  params: Promise<{ locale: Locale }>
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <LoginForm locale={locale} />
    </Suspense>
  )
}
