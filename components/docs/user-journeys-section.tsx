import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Eye, Edit, Shield, Settings } from "lucide-react"

export function UserJourneysSection() {
  const journeys = [
    {
      role: "Reader",
      icon: Eye,
      color: "text-gray-500",
      description: "Unauthenticated visitor - can read everything, no interactions",
      steps: [
        "Opens platform",
        "Sees Solutions (top section)",
        "Sees Problems (bottom section)",
        "Can filter by category",
        "Can click to view details",
        "Cannot vote or submit",
        "No call-to-actions shown",
      ],
      implementation: `// middleware.ts - Reader access to public routes
export function middleware(request: NextRequest) {
  const publicPaths = ['/', '/problems', '/solutions', '/categories']
  const isPublic = publicPaths.some(p => 
    request.nextUrl.pathname === p || 
    request.nextUrl.pathname.startsWith(p + '/')
  )
  
  if (isPublic) return NextResponse.next()
  
  // Protected routes require device-ID session
  const session = request.cookies.get('session')
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Reader sees NO voting buttons, NO submit buttons
// Just clean, calm reading experience`,
    },
    {
      role: "Contributor",
      icon: Edit,
      color: "text-blue-500",
      description: "Invited user - can read, submit, and vote",
      steps: [
        "Receives invite code",
        "Opens invite link",
        "Device-ID auto-generated",
        "Sets optional alias",
        "Gets 2 invites to share",
        "Can submit problems/solutions",
        "Can upvote (permanent)",
        "Can view own submissions",
      ],
      implementation: `// app/invite/[code]/page.tsx
export default async function InvitePage({ params }: { params: { code: string } }) {
  const invite = await validateInvite(params.code)
  
  if (!invite || invite.used_at || invite.expires_at < new Date()) {
    return <InvalidInvite />
  }
  
  // Check platform capacity
  const totalUsers = await db.users.count()
  if (totalUsers >= 500) {
    return <PlatformAtCapacity />
  }
  
  return <InviteRedemptionForm code={params.code} />
}

// components/invite-form.tsx
'use client'
export function InviteRedemptionForm({ code }: { code: string }) {
  const [alias, setAlias] = useState('')
  
  async function handleSubmit() {
    const deviceId = await generateDeviceId()  // Fingerprint hash
    await redeemInvite({ code, deviceId, alias })
    // User now has contributor role with 2 invites
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Input placeholder="Choose an alias (optional)" value={alias} onChange={...} />
      <Button type="submit">Join Community</Button>
      {/* Add CAPTCHA here */}
    </form>
  )
}`,
    },
    {
      role: "Moderator",
      icon: Shield,
      color: "text-orange-500",
      description: "Trusted user - content review, merge, delete, ban",
      steps: [
        "Login with device-ID",
        "Access moderation dashboard",
        "View AI duplicate hints (>0.78)",
        "Review flagged content",
        "Merge duplicates (with justification)",
        "Delete spam/abuse (with justification)",
        "Ban devices (temporary/permanent)",
        "Manage categories",
        "Manage invitations",
        "All actions logged",
      ],
      implementation: `// app/moderation/page.tsx
import { requireModerator } from '@/lib/auth'

export default async function ModerationPage() {
  await requireModerator()
  
  // AI duplicate hints - non-blocking, just suggestions
  const duplicates = await getAIInsights({ 
    type: 'duplicate', 
    reviewed: false,
    minScore: 0.78  // Only show if score > 0.78
  })
  const flagged = await getFlaggedContent()
  
  return (
    <ModerationDashboard 
      duplicates={duplicates}
      flagged={flagged}
    />
  )
}

// Server Action for merging - requires justification
'use server'
export async function mergeDuplicates(
  sourceId: string, 
  targetId: string,
  type: 'problem' | 'solution',
  justification: string  // REQUIRED
) {
  const mod = await requireModerator()
  
  if (!justification || justification.length < 10) {
    throw new Error('Justification required (min 10 chars)')
  }
  
  // Transfer links to target (for solutions)
  if (type === 'solution') {
    await db.problem_solution_links.updateMany({
      where: { solution_id: sourceId },
      data: { solution_id: targetId }
    })
  }
  
  // Mark source as merged
  await db[type + 's'].update({
    where: { id: sourceId },
    data: { status: 'merged', merged_into: targetId }
  })
  
  // Log action with justification
  await db.moderation_logs.create({
    data: {
      moderator_id: mod.id,
      action_type: 'merge',
      target_type: type,
      target_id: sourceId,
      details: { 
        merged_into: targetId, 
        justification 
      }
    }
  })
}`,
    },
    {
      role: "Admin",
      icon: Settings,
      color: "text-purple-500",
      description: "Platform administrator - full system access",
      steps: [
        "All moderator capabilities",
        "Promote/demote moderators",
        "Manage all categories",
        "View platform analytics",
        "Adjust invite limits",
        "Configure AI thresholds",
        "Access audit logs",
        "System configuration",
      ],
      implementation: `// app/admin/page.tsx
import { requireAdmin } from '@/lib/auth'

export default async function AdminPage() {
  await requireAdmin()
  
  const stats = await getPlatformStats()
  // { totalUsers, totalProblems, totalSolutions, totalVotes }
  
  const users = await getUsers({ limit: 50 })
  const categories = await getCategories()
  const logs = await getModerationLogs({ limit: 100 })
  
  return (
    <AdminDashboard>
      <StatsOverview stats={stats} />
      <UserManager users={users} />  {/* Promote/demote */}
      <CategoryManager categories={categories} />
      <ModerationLogViewer logs={logs} />
      <SystemSettings />
    </AdminDashboard>
  )
}`,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold">User Journeys</h2>
        <p className="text-muted-foreground">
          Detailed user flows for each role: Reader, Contributor, Moderator, Admin.
        </p>
      </div>

      <div className="space-y-6">
        {journeys.map((journey) => (
          <Card key={journey.role}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${journey.color}`}>
                  <journey.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>{journey.role}</CardTitle>
                  <CardDescription>{journey.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Flow Steps */}
              <div className="flex flex-wrap items-center gap-2">
                {journey.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Badge variant="outline" className="whitespace-nowrap">
                      {i + 1}. {step}
                    </Badge>
                    {i < journey.steps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>

              {/* Implementation Code */}
              <div>
                <p className="text-sm font-medium mb-2">Implementation Reference</p>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                  <code>{journey.implementation}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy Notes</CardTitle>
          <CardDescription>Important considerations for implementation</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                Auth
              </Badge>
              <span>No email/phone required. Device-ID is hashed for privacy. Invite-only access.</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                Capacity
              </Badge>
              <span>Maximum 500 users. Each user gets exactly 2 invites (not activity-based).</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                Votes
              </Badge>
              <span>Anonymous, permanent, one per device per target. Cannot be removed or changed.</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                CAPTCHA
              </Badge>
              <span>Add CAPTCHA to invite redemption to prevent abuse.</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                Rate Limit
              </Badge>
              <span>Implement rate limiting on content creation and invite generation.</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                AI
              </Badge>
              <span>
                Embeddings for duplicate detection only. Non-blocking hints. No automatic decisions. GDPR-compliant.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                Audit
              </Badge>
              <span>All moderation actions logged with moderator ID, timestamp, and required justification.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
