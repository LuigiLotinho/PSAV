import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewSection } from "@/components/docs/overview-section"
import { FeaturesSection } from "@/components/docs/features-section"
import { DataModelSection } from "@/components/docs/data-model-section"
import { ApiSection } from "@/components/docs/api-section"
import { UserJourneysSection } from "@/components/docs/user-journeys-section"
import { WireframesSection } from "@/components/docs/wireframes-section"

export default function CursorDocumentation() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Auroville Problem-Solution Platform</h1>
              <p className="text-muted-foreground">Cursor Implementation Guide - Engineering Ready</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3 max-w-3xl">
            Open, anonymous platform for the Auroville community. Focus on collective intelligence without social media
            dynamics. Anonymity by design, upvotes only, AI as support, fully Open Source.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="flex flex-wrap gap-2 h-auto bg-muted p-2 rounded-lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wireframes">Wireframes</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="data-model">Data Model</TabsTrigger>
            <TabsTrigger value="api">API Endpoints</TabsTrigger>
            <TabsTrigger value="user-journeys">User Journeys</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewSection />
          </TabsContent>

          <TabsContent value="wireframes">
            <WireframesSection />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesSection />
          </TabsContent>

          <TabsContent value="data-model">
            <DataModelSection />
          </TabsContent>

          <TabsContent value="api">
            <ApiSection />
          </TabsContent>

          <TabsContent value="user-journeys">
            <UserJourneysSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
