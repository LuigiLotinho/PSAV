import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      name: "Public Homepage",
      description: "All visitors can view solutions and problems. Solutions on top, problems below. Sorted by upvotes.",
      status: "mvp",
      priority: "P0",
      implementation: `// app/page.tsx - Server Component
export default async function HomePage() {
  // Solutions displayed ABOVE problems
  const solutions = await getSolutions({ limit: 10, orderBy: 'upvotes' })
  const problems = await getProblems({ limit: 10, orderBy: 'upvotes' })
  
  return (
    <main>
      <CategoryFilter categories={categories} />
      <SolutionsList solutions={solutions} /> {/* TOP */}
      <ProblemsList problems={problems} />    {/* BOTTOM */}
    </main>
  )
}`,
    },
    {
      name: "Problem Creation",
      description:
        "300 char short text, 2500 char long text, 5 rankings (1-10 scale): Impact, Urgency, Feasibility, Affected, Costs",
      status: "mvp",
      priority: "P0",
      implementation: `// Schema for problem creation
const problemSchema = z.object({
  short_text: z.string().max(300),  // Max 300 chars
  long_text: z.string().max(2500).optional(),  // Max 2500 chars
  category_id: z.string().uuid(),
  rankings: z.object({
    impact: z.number().min(1).max(10),       // 1-10 scale
    urgency: z.number().min(1).max(10),      // (Dringlichkeit)
    feasibility: z.number().min(1).max(10),  // (Umsetzbarkeit)
    affected: z.number().min(1).max(10),     // (Betroffenheitsgrad)
    costs: z.number().min(1).max(10),        // (Kosten)
  }),
})

// Helper questions (fixed, not stored):
// 1. Who is affected?
// 2. Since when?
// 3. How severe?
// 4. What was tried?
// 5. Examples?
// 6. Frequency?
// 7. Emotional burden?`,
    },
    {
      name: "Solution Creation",
      description: "300 char short text, 2500 char long text, 500 char improvements field. No rankings in MVP.",
      status: "mvp",
      priority: "P0",
      implementation: `// Schema for solution creation
const solutionSchema = z.object({
  short_text: z.string().max(300),    // Max 300 chars
  long_text: z.string().max(2500).optional(),  // Max 2500 chars
  improvements: z.string().max(500).optional(), // Max 500 chars
  // No rankings for solutions in MVP
  // linked_problem_ids handled separately (many-to-many)
})`,
    },
    {
      name: "Problem-Solution Links (Many-to-Many)",
      description: "Solutions can be linked to multiple problems. Manual linking only in MVP.",
      status: "mvp",
      priority: "P0",
      implementation: `// Link table for many-to-many relationship
CREATE TABLE problem_solution_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id),
  solution_id UUID NOT NULL REFERENCES solutions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(problem_id, solution_id)
);

// Server Action for linking
'use server'
export async function linkSolutionToProblem(
  solutionId: string, 
  problemId: string
) {
  await db.problem_solution_links.create({
    data: { solution_id: solutionId, problem_id: problemId }
  })
}`,
    },
    {
      name: "Upvotes-Only Voting",
      description: "Anonymous, one vote per device, votes are FINAL and cannot be removed.",
      status: "mvp",
      priority: "P0",
      implementation: `// Voting system - NO TOGGLE, votes are permanent
'use server'
export async function upvote(targetType: 'problem' | 'solution', targetId: string) {
  const deviceId = await getDeviceId()
  const voteHash = hash(deviceId + targetId) // Unique constraint
  
  // Check if already voted
  const existing = await db.votes.findFirst({
    where: { hash_id: voteHash }
  })
  
  if (existing) {
    throw new Error('You have already voted on this item. Votes are final.')
  }
  
  // Add vote - permanent, no removal
  await db.votes.create({
    data: { 
      hash_id: voteHash, 
      target_type: targetType, 
      target_id: targetId 
    }
  })
  
  revalidateTag(\`\${targetType}:\${targetId}\`)
}`,
    },
    {
      name: "Anonymous Identity",
      description: "Device-ID based identity with optional alias. No email/phone required.",
      status: "mvp",
      priority: "P0",
      implementation: `// lib/device-id.ts
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { hash } from 'bcryptjs'

export async function generateDeviceId(): Promise<string> {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  // Hash for privacy - this becomes the user's identity
  return hash(result.visitorId, 10)
}

// User table structure
// device_id: hashed, unique
// alias: optional display name
// invited_by: references user who invited
// invites_remaining: always 2 initially`,
    },
    {
      name: "Invite System",
      description: "Max 500 users. Each user gets exactly 2 invites (not activity-based).",
      status: "mvp",
      priority: "P0",
      implementation: `// Server Action for invite creation
'use server'
export async function createInvite() {
  const user = await getCurrentUser()
  
  if (user.invites_remaining <= 0) {
    throw new Error('No invites remaining')
  }
  
  const totalUsers = await db.users.count()
  if (totalUsers >= 500) {
    throw new Error('Platform is at capacity (max 500 users)')
  }
  
  const invite = await db.invites.create({
    data: {
      code: generateInviteCode(),  // One-time code
      created_by: user.id,
      expires_at: addDays(new Date(), 7),
    }
  })
  
  await db.users.update({
    where: { id: user.id },
    data: { invites_remaining: user.invites_remaining - 1 }
  })
  
  return invite.code
}`,
    },
    {
      name: "AI Duplicate Detection",
      description: "Embedding-based similarity. Score >0.78 = moderator hint. Non-blocking, no auto-decisions.",
      status: "mvp",
      priority: "P1",
      implementation: `// lib/duplicate-detection.ts
import { OpenAI } from 'openai'

export async function checkDuplicates(text: string, type: 'problem' | 'solution') {
  const openai = new OpenAI()
  
  // Generate embedding
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  
  // Search for similar items (using pgvector)
  const similar = await db.$queryRaw\`
    SELECT id, title, 1 - (embedding <=> \${embedding.data[0].embedding}::vector) as score
    FROM \${type}s
    WHERE 1 - (embedding <=> \${embedding.data[0].embedding}::vector) > 0.78
    ORDER BY score DESC
    LIMIT 5
  \`
  
  // NON-BLOCKING: Store as hint for moderator review
  // NO automatic decisions - human confirmation required
  if (similar.length > 0) {
    await db.ai_insights.create({
      data: {
        type: 'duplicate',
        source_id: newItemId,
        duplicate_scores: similar,
        reviewed: false,  // Needs moderator review
      }
    })
  }
  
  return similar  // Just a hint, doesn't block submission
}`,
    },
    {
      name: "Moderation & Logging",
      description: "Check for spam, abuse, hate speech. All actions logged with justification.",
      status: "mvp",
      priority: "P1",
      implementation: `// All moderation actions are logged
'use server'
export async function moderateContent(
  contentId: string,
  contentType: 'problem' | 'solution',
  action: 'approve' | 'delete' | 'merge' | 'ban_device',
  justification: string  // Required!
) {
  const mod = await requireModerator()
  
  // Perform action...
  
  // Log with justification - visible to other moderators
  await db.moderation_logs.create({
    data: {
      moderator_id: mod.id,
      action_type: action,
      target_type: contentType,
      target_id: contentId,
      details: { justification },
      created_at: new Date()
    }
  })
}`,
    },
    {
      name: "Category Management",
      description: "Flat structure, only names. Initially user-selected, later AI-assisted.",
      status: "mvp",
      priority: "P1",
      implementation: `// Categories: flat structure, just names
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

// Moderators can add/rename/reorganize categories
// Future: AI category suggestions (V2)`,
    },
    {
      name: "AI Matching (V2)",
      description: "Automatic solution suggestions for problems based on embeddings.",
      status: "planned",
      priority: "P2",
      implementation: "// Coming in V2 - Will use embeddings to suggest relevant solutions for each problem",
    },
    {
      name: "Weighted Upvotes (V2)",
      description: "Optional feature to weight votes differently.",
      status: "planned",
      priority: "P2",
      implementation: "// Coming in V2 - Optionally activate weighted voting",
    },
    {
      name: "Senior-Friendly Interface (V3)",
      description: "Accessible UI for older users with larger fonts and simplified navigation.",
      status: "planned",
      priority: "P3",
      implementation: "// Coming in V3 - Alternative UI theme for seniors",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold">Core Features</h2>
        <p className="text-muted-foreground">
          Detailed breakdown of each feature with implementation guidance for Cursor.
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm">MVP Feature</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 text-blue-500" />
          <span className="text-sm">Planned (V2/V3)</span>
        </div>
      </div>

      <div className="space-y-4">
        {features.map((feature) => (
          <Card key={feature.name}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {feature.status === "mvp" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-blue-500" />
                )}
                <div className="flex-1">
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                <Badge variant={feature.priority === "P0" ? "default" : "secondary"}>{feature.priority}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{feature.implementation}</code>
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
