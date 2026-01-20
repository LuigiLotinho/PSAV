import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DataModelSection() {
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold">Database Schema</h2>
        <p className="text-muted-foreground">
          Complete data model for the Auroville Platform. Updated with many-to-many links and 1-10 rankings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SQL Schema</CardTitle>
          <CardDescription>Copy this to Cursor for database setup</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Categories (flat structure, only names)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (anonymous, device-based)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id VARCHAR(255) NOT NULL UNIQUE,  -- Hashed device fingerprint
  alias VARCHAR(50),                        -- Optional display name
  invited_by UUID REFERENCES users(id),
  invites_remaining INTEGER DEFAULT 2,      -- Fixed: 2 per user, not activity-based
  role VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('reader', 'contributor', 'moderator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invites (one-time codes)
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES users(id),
  used_by UUID REFERENCES users(id),
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Problems
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  short_text VARCHAR(300) NOT NULL,         -- Max 300 chars
  long_text VARCHAR(2500),                  -- Max 2500 chars
  category_id UUID REFERENCES categories(id),
  -- Rankings (1-10 scale) - German labels in comments
  ranking_impact INTEGER CHECK (ranking_impact BETWEEN 1 AND 10),         -- Impact
  ranking_urgency INTEGER CHECK (ranking_urgency BETWEEN 1 AND 10),       -- Dringlichkeit
  ranking_feasibility INTEGER CHECK (ranking_feasibility BETWEEN 1 AND 10), -- Umsetzbarkeit
  ranking_affected INTEGER CHECK (ranking_affected BETWEEN 1 AND 10),     -- Betroffenheitsgrad
  ranking_costs INTEGER CHECK (ranking_costs BETWEEN 1 AND 10),           -- Kosten
  -- Computed
  upvote_count INTEGER DEFAULT 0,
  -- AI features
  embedding vector(1536),
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'merged', 'archived')),
  merged_into UUID REFERENCES problems(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Solutions
CREATE TABLE solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  short_text VARCHAR(300) NOT NULL,         -- Max 300 chars
  long_text VARCHAR(2500),                  -- Max 2500 chars
  improvements VARCHAR(500),                -- Max 500 chars - improvement suggestions
  category_id UUID REFERENCES categories(id),
  -- NO rankings for solutions in MVP
  upvote_count INTEGER DEFAULT 0,
  embedding vector(1536),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'merged', 'archived')),
  merged_into UUID REFERENCES solutions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Problem-Solution Links (MANY-TO-MANY)
-- Solutions can be linked to multiple problems
CREATE TABLE problem_solution_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  solution_id UUID NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(problem_id, solution_id)
);

-- Votes (upvotes only, anonymous, FINAL - cannot be removed)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hash_id VARCHAR(255) NOT NULL UNIQUE,     -- Hash(device_id + target_id) prevents duplicates
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('problem', 'solution')),
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  -- NO user_id stored for anonymity
  -- NO delete capability - votes are permanent
);

-- AI Insights (for moderator review, non-blocking)
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insight_type VARCHAR(50) NOT NULL,        -- 'duplicate' for now
  source_type VARCHAR(20) NOT NULL,
  source_id UUID NOT NULL,
  data JSONB NOT NULL,                      -- duplicate_scores, etc.
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moderation Logs (all actions logged with justification)
CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  moderator_id UUID NOT NULL REFERENCES users(id),
  action_type VARCHAR(50) NOT NULL,         -- merge, delete, ban_device, etc.
  target_type VARCHAR(20),
  target_id UUID,
  details JSONB NOT NULL,                   -- Must include 'justification' field
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_problems_category ON problems(category_id);
CREATE INDEX idx_problems_upvotes ON problems(upvote_count DESC);
CREATE INDEX idx_problems_created ON problems(created_at DESC);
CREATE INDEX idx_solutions_category ON solutions(category_id);
CREATE INDEX idx_solutions_upvotes ON solutions(upvote_count DESC);
CREATE INDEX idx_votes_target ON votes(target_type, target_id);
CREATE INDEX idx_votes_hash ON votes(hash_id);
CREATE INDEX idx_links_problem ON problem_solution_links(problem_id);
CREATE INDEX idx_links_solution ON problem_solution_links(solution_id);
CREATE INDEX idx_ai_insights_pending ON ai_insights(insight_type, reviewed) WHERE reviewed = FALSE;

-- Vector similarity search indexes
CREATE INDEX idx_problems_embedding ON problems USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_solutions_embedding ON solutions USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Trigger for upvote counting (INSERT only, no DELETE since votes are permanent)
CREATE OR REPLACE FUNCTION update_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.target_type = 'problem' THEN
    UPDATE problems SET upvote_count = upvote_count + 1 WHERE id = NEW.target_id;
  ELSE
    UPDATE solutions SET upvote_count = upvote_count + 1 WHERE id = NEW.target_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_upvote_count
AFTER INSERT ON votes
FOR EACH ROW EXECUTE FUNCTION update_upvote_count();

-- Seed categories
INSERT INTO categories (name) VALUES
  ('Environment'),
  ('Infrastructure'),
  ('Education'),
  ('Health'),
  ('Community'),
  ('Governance'),
  ('Economy');`}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entity Relationship Diagram</CardTitle>
          <CardDescription>Visual overview - note the many-to-many link table</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-6 rounded-lg">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Users */}
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Badge>Users</Badge>
                </div>
                <ul className="text-sm space-y-1 font-mono">
                  <li className="text-primary">id (PK)</li>
                  <li>device_id (hashed, unique)</li>
                  <li>alias (optional)</li>
                  <li className="text-blue-500">invited_by (FK → users)</li>
                  <li>invites_remaining (default: 2)</li>
                  <li>role (reader/contributor/mod/admin)</li>
                </ul>
              </div>

              {/* Problems */}
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">Problems</Badge>
                </div>
                <ul className="text-sm space-y-1 font-mono">
                  <li className="text-primary">id (PK)</li>
                  <li className="text-blue-500">user_id (FK → users)</li>
                  <li>short_text (max 300)</li>
                  <li>long_text (max 2500)</li>
                  <li className="text-blue-500">category_id (FK)</li>
                  <li>ranking_* (5 fields, 1-10)</li>
                  <li>upvote_count</li>
                  <li>embedding (vector)</li>
                </ul>
              </div>

              {/* Solutions */}
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">Solutions</Badge>
                </div>
                <ul className="text-sm space-y-1 font-mono">
                  <li className="text-primary">id (PK)</li>
                  <li className="text-blue-500">user_id (FK → users)</li>
                  <li>short_text (max 300)</li>
                  <li>long_text (max 2500)</li>
                  <li>improvements (max 500)</li>
                  <li>upvote_count</li>
                  <li className="text-muted-foreground">// No rankings in MVP</li>
                </ul>
              </div>

              {/* Problem-Solution Links - NEW */}
              <div className="border rounded-lg p-4 bg-background border-primary">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-600">Links (M:N)</Badge>
                </div>
                <ul className="text-sm space-y-1 font-mono">
                  <li className="text-primary">id (PK)</li>
                  <li className="text-blue-500">problem_id (FK → problems)</li>
                  <li className="text-blue-500">solution_id (FK → solutions)</li>
                  <li className="text-muted-foreground">// Many-to-many relationship</li>
                </ul>
              </div>

              {/* Votes */}
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">Votes</Badge>
                </div>
                <ul className="text-sm space-y-1 font-mono">
                  <li className="text-primary">id (PK)</li>
                  <li>hash_id (unique constraint)</li>
                  <li>target_type</li>
                  <li>target_id</li>
                  <li className="text-muted-foreground">// No user_id - anonymous</li>
                  <li className="text-muted-foreground">// No delete - permanent</li>
                </ul>
              </div>

              {/* Moderation Logs */}
              <div className="border rounded-lg p-4 bg-background">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">Moderation Logs</Badge>
                </div>
                <ul className="text-sm space-y-1 font-mono">
                  <li className="text-primary">id (PK)</li>
                  <li className="text-blue-500">moderator_id (FK)</li>
                  <li>action_type</li>
                  <li>target_type, target_id</li>
                  <li>details (JSONB w/ justification)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
