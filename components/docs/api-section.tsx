import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ApiSection() {
  const endpoints = [
    {
      method: "POST",
      path: "/auth/invite",
      description: "Consume an invite code and create user with device-ID",
      request: `{
  "code": "AV-X7K9-MNPL",
  "device_id": "hashed_device_fingerprint",
  "alias": "optional_display_name"
}`,
      response: `{
  "user": { 
    "id": "uuid", 
    "alias": "name", 
    "invites_remaining": 2,
    "role": "contributor"
  },
  "session_token": "jwt_token"
}`,
    },
    {
      method: "POST",
      path: "/problems",
      description: "Create a new problem (Contributor only)",
      request: `{
  "short_text": "Max 300 chars brief description",
  "long_text": "Max 2500 chars detailed explanation...",
  "category_id": "uuid",
  "rankings": {
    "impact": 7,        // 1-10 scale
    "urgency": 8,       // 1-10 scale
    "feasibility": 5,   // 1-10 scale
    "affected": 6,      // 1-10 scale
    "costs": 4          // 1-10 scale
  }
}`,
      response: `{
  "id": "uuid",
  "short_text": "...",
  "created_at": "2024-01-15T...",
  "duplicate_hints": []  // AI suggestions, non-blocking
}`,
    },
    {
      method: "GET",
      path: "/problems",
      description: "List problems (public, sorted by upvotes)",
      request: `Query params:
  ?category=uuid
  &limit=20
  &offset=0
  &sort=upvotes  // Always by upvotes`,
      response: `{
  "data": [
    {
      "id": "uuid",
      "short_text": "...",
      "category": { "id": "uuid", "name": "Infrastructure" },
      "upvote_count": 42,
      "solution_count": 3
    }
  ],
  "total": 156,
  "hasMore": true
}`,
    },
    {
      method: "GET",
      path: "/problems/:id",
      description: "Get problem details with linked solutions",
      request: "Path param: id (uuid)",
      response: `{
  "id": "uuid",
  "short_text": "...",
  "long_text": "...",
  "rankings": { 
    "impact": 7, 
    "urgency": 8, 
    "feasibility": 5, 
    "affected": 6, 
    "costs": 4 
  },
  "category": { ... },
  "upvote_count": 42,
  "user_has_voted": false,
  "solutions": [
    { "id": "uuid", "short_text": "...", "upvote_count": 15 }
  ],
  "created_at": "..."
}`,
    },
    {
      method: "POST",
      path: "/solutions",
      description: "Create a new solution (Contributor only)",
      request: `{
  "short_text": "Max 300 chars brief description",
  "long_text": "Max 2500 chars detailed explanation...",
  "improvements": "Max 500 chars suggestions...",
  "linked_problem_ids": ["uuid1", "uuid2"]  // Many-to-many
}`,
      response: `{
  "id": "uuid",
  "short_text": "...",
  "created_at": "..."
}`,
    },
    {
      method: "GET",
      path: "/solutions",
      description: "List solutions (public, sorted by upvotes, shown ABOVE problems)",
      request: `Query params:
  ?category=uuid
  &limit=20
  &offset=0`,
      response: `{
  "data": [
    {
      "id": "uuid",
      "short_text": "...",
      "upvote_count": 35,
      "linked_problem_count": 2
    }
  ],
  "total": 89
}`,
    },
    {
      method: "POST",
      path: "/votes",
      description: "Upvote (permanent, cannot be removed)",
      request: `{
  "target_type": "problem" | "solution",
  "target_id": "uuid"
}`,
      response: `{
  "success": true,
  "new_count": 43
}
// Error if already voted:
{
  "error": "You have already voted. Votes are final."
}`,
    },
    {
      method: "POST",
      path: "/links",
      description: "Link solution to problem (manual, many-to-many)",
      request: `{
  "solution_id": "uuid",
  "problem_id": "uuid"
}`,
      response: `{
  "link_id": "uuid",
  "created": true
}`,
    },
    {
      method: "POST",
      path: "/moderation/merge",
      description: "Merge duplicate items (Moderator only, logged)",
      request: `{
  "source_id": "uuid",
  "target_id": "uuid",
  "type": "problem" | "solution",
  "justification": "These describe the same water issue"
}`,
      response: `{
  "merged": true,
  "kept_id": "uuid",
  "log_id": "uuid"
}`,
    },
    {
      method: "DELETE",
      path: "/problems/:id",
      description: "Delete problem (Moderator only, logged)",
      request: `{
  "justification": "Spam content"
}`,
      response: `{
  "deleted": true,
  "log_id": "uuid"
}`,
    },
    {
      method: "GET",
      path: "/categories",
      description: "List all categories (flat structure, only names)",
      request: "No params",
      response: `{
  "categories": [
    { "id": "uuid", "name": "Environment" },
    { "id": "uuid", "name": "Infrastructure" },
    { "id": "uuid", "name": "Education" }
  ]
}`,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold">API Endpoints</h2>
        <p className="text-muted-foreground">REST API specification for the Auroville Platform MVP.</p>
      </div>

      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <Card key={`${endpoint.method}-${endpoint.path}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    endpoint.method === "GET" ? "secondary" : endpoint.method === "DELETE" ? "destructive" : "default"
                  }
                  className={endpoint.method === "POST" ? "bg-green-600" : ""}
                >
                  {endpoint.method}
                </Badge>
                <code className="text-lg font-mono">{endpoint.path}</code>
              </div>
              <CardDescription>{endpoint.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Request</p>
                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                    <code>{endpoint.request}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Response</p>
                  <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
                    <code>{endpoint.response}</code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cursor Implementation Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            <code>
              Create Next.js API routes using the App Router (route.ts files) for the Auroville Platform. Use Server
              Actions where appropriate. Implement: input validation with Zod (300/2500/500 char limits, 1-10 rankings),
              device-based auth middleware, permanent votes (no toggle), many-to-many problem-solution links, and
              moderation logging with required justification. All endpoints should return consistent JSON with proper
              HTTP status codes.
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
