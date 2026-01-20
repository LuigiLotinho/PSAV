import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Shield, Sparkles, AlertCircle, Ban } from "lucide-react"

export function OverviewSection() {
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold">Product Vision</h2>
        <p className="text-muted-foreground text-lg">
          Open, anonymous platform for the Auroville community to capture problems and solutions in a structured way.
          Focus on collective intelligence without social media dynamics. Anonymity by design, upvotes only, AI as
          support only, fully Open Source.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <Target className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Problem Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Problems with 300 char short description, 2500 char long description, and 5 rankings (1-10 scale)
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Solution Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Solutions can be linked to multiple problems (many-to-many). 500 char improvement field included
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Anonymous Identity</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Device-ID based identity with optional alias. Max 500 users via invite system (2 invites per user)
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">AI-Assisted (Non-Blocking)</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Duplicate detection via embeddings (score {">"}0.78 = suggestion). No automatic AI decisions
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Four distinct permission levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <Badge variant="secondary" className="mb-2">
                Reader
              </Badge>
              <p className="text-sm text-muted-foreground">Read content without any interaction. No authentication.</p>
            </div>
            <div className="border rounded-lg p-4">
              <Badge className="mb-2">Contributor</Badge>
              <p className="text-sm text-muted-foreground">
                Submit problems & solutions, upvote content. Requires invitation.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Badge variant="outline" className="mb-2 border-orange-500 text-orange-600">
                Moderator
              </Badge>
              <p className="text-sm text-muted-foreground">
                Review content, merge duplicates, manage categories & invitations.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Badge variant="outline" className="mb-2 border-purple-500 text-purple-600">
                Admin
              </Badge>
              <p className="text-sm text-muted-foreground">Full system access, user management, configuration.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-destructive" />
            <CardTitle>Non-Goals (Important for Scope)</CardTitle>
          </div>
          <CardDescription>Features explicitly excluded from this platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <span className="text-sm">No Social Network features (friends, profiles, awards)</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <span className="text-sm">No Chat or Messaging system</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <span className="text-sm">No Project Management (groups, tasks, calendar)</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <span className="text-sm">No automatic AI moderation without human approval</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <span className="text-sm">No complex comment threads on problems</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <span className="text-sm">No gamification elements</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack Recommendations</CardTitle>
          <CardDescription>Suggested technologies for implementation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Next.js 14+ (App Router)</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">Supabase (Auth + DB)</Badge>
            <Badge variant="secondary">PostgreSQL + pgvector</Badge>
            <Badge variant="secondary">OpenAI Embeddings</Badge>
            <Badge variant="secondary">Vercel</Badge>
          </div>

          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground mb-2"># Cursor prompt for project setup:</p>
            <code>
              Create a Next.js 14 project with TypeScript, Tailwind CSS, and Supabase integration. Set up the folder
              structure for a problem-solution platform with anonymous device-based auth, upvotes-only voting, and
              AI-powered duplicate detection. Max 500 users with invite system. Mobile-first, calm UI without
              gamification.
            </code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <Badge className="mb-2">V1 MVP (0-3 months)</Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Homepage: Solutions top, Problems bottom</li>
                <li>Upvote system (anonymous, final)</li>
                <li>Invite system (max 500 users, 2 invites each)</li>
                <li>Basic moderation dashboard</li>
                <li>Duplicate detection (non-blocking)</li>
                <li>Category management</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <Badge variant="outline" className="mb-2">
                V2 (3-9 months)
              </Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>AI Matching (solution suggestions)</li>
                <li>Category prediction</li>
                <li>Analytics dashboard</li>
                <li>UX improvements</li>
                <li>Weighted upvotes (optional)</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <Badge variant="outline" className="mb-2">
                V3 (9-18 months)
              </Badge>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Senior-friendly interface</li>
                <li>Self-hosting option</li>
                <li>Sub-communities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
