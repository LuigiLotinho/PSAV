import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link2, ArrowUp, ChevronRight, Home, Grid, Eye } from "lucide-react"

export const WireframesSection = () => {
  return (
    <div className="space-y-8">
      {/* Flow Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Reader Navigation Flow</CardTitle>
          <CardDescription>The complete user journey from landing page to detail view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 p-6 bg-muted/30 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium">Landing Page</span>
              <span className="text-xs text-muted-foreground">Categories</span>
            </div>
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                <Grid className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium">Category Page</span>
              <span className="text-xs text-muted-foreground">Problems/Solutions List</span>
            </div>
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm font-medium">Detail Page</span>
              <span className="text-xs text-muted-foreground">Full View + Voting</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1. Reader Landing Page */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>1. Reader Landing Page</CardTitle>
              <CardDescription>Welcome screen with 3D carousels for Solution and Problem categories</CardDescription>
            </div>
            <Badge>Homepage</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-6 bg-muted/30">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full" />
                <span className="font-bold">Auroville PSD</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Browse</span>
                <span className="text-sm text-muted-foreground">About</span>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
                  Become Contributor
                </button>
              </div>
            </div>

            {/* Intro Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">Welcome to Auroville Problem-Solution Database</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore community challenges and innovative solutions. Browse by category to discover what matters most
                to our community and how we're working together to solve problems.
              </p>
            </div>

            {/* Solutions Carousel Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Solution Categories</h2>
                <span className="text-sm text-muted-foreground">Drag to explore →</span>
              </div>
              <div className="flex gap-4 overflow-hidden">
                {["Environment", "Infrastructure", "Community", "Education", "Health"].map((cat, i) => (
                  <div
                    key={cat}
                    className="min-w-[200px] h-[150px] rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    style={{ transform: `perspective(1000px) rotateY(${(i - 2) * 5}deg)` }}
                  >
                    <div className="w-12 h-12 bg-primary/30 rounded-lg mb-2" />
                    <span className="font-medium">{cat}</span>
                    <span className="text-xs text-muted-foreground">12 solutions</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Problems Carousel Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Problem Categories</h2>
                <span className="text-sm text-muted-foreground">Drag to explore →</span>
              </div>
              <div className="flex gap-4 overflow-hidden">
                {["Water", "Energy", "Transport", "Waste", "Housing"].map((cat, i) => (
                  <div
                    key={cat}
                    className="min-w-[200px] h-[150px] rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    style={{ transform: `perspective(1000px) rotateY(${(i - 2) * 5}deg)` }}
                  >
                    <div className="w-12 h-12 bg-orange-500/30 rounded-lg mb-2" />
                    <span className="font-medium">{cat}</span>
                    <span className="text-xs text-muted-foreground">8 problems</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-muted p-4 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground mb-2"># Cursor prompt:</p>
            <code>
              Create a Reader landing page with: header (logo, nav, "Become Contributor" CTA), intro section with
              welcome text, and two horizontal 3D carousel sections - one for Solution categories and one for Problem
              categories. Use framer-motion for drag gestures and 3D perspective transforms. Each category card shows
              icon, name, and item count. Clicking a category navigates to /category/[type]/[slug].
            </code>
          </div>
        </CardContent>
      </Card>

      {/* 2. Category Page */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>2. Category Page (Problems or Solutions List)</CardTitle>
              <CardDescription>Shows all items within a selected category with voting and preview</CardDescription>
            </div>
            <Badge variant="secondary">Category View</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-6 bg-muted/30">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <span className="hover:text-foreground cursor-pointer">Home</span>
              <ChevronRight className="h-4 w-4" />
              <span className="hover:text-foreground cursor-pointer">Problems</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Water</span>
            </div>

            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-500/50 rounded-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Water Problems</h1>
                <p className="text-muted-foreground">8 problems in this category</p>
              </div>
            </div>

            {/* Sort/Filter Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Sort by:</span>
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">Most Voted</button>
                <button className="px-3 py-1 border rounded text-sm">Newest</button>
                <button className="px-3 py-1 border rounded text-sm">Most Urgent</button>
              </div>
              <span className="text-sm text-muted-foreground">Showing 8 items</span>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {[
                {
                  title: "Water shortage in residential zone",
                  votes: 42,
                  urgency: 8,
                  desc: "The water supply has been inconsistent for the past 3 months...",
                },
                {
                  title: "Contaminated well in Zone B",
                  votes: 38,
                  urgency: 9,
                  desc: "Recent tests show concerning levels of bacteria...",
                },
                {
                  title: "Irrigation system failures",
                  votes: 24,
                  urgency: 6,
                  desc: "The community gardens are experiencing regular...",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-4 bg-background hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <button className="p-2 hover:bg-muted rounded-lg">
                        <ArrowUp className="h-5 w-5 text-primary" />
                      </button>
                      <span className="text-xl font-bold">{item.votes}</span>
                      <span className="text-xs text-muted-foreground">votes</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          Urgency: {item.urgency}/10
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.desc}</p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-4" />
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-6">
              <button className="px-6 py-2 border rounded-lg text-sm hover:bg-muted">Load More</button>
            </div>
          </div>

          <div className="mt-4 bg-muted p-4 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground mb-2"># Cursor prompt:</p>
            <code>
              Create a category page at /category/[type]/[slug] that shows: breadcrumb navigation, category header with
              icon and count, sort/filter options (Most Voted, Newest, Most Urgent), and a list of items. Each item card
              shows: upvote button with count, urgency badge, title, short description (truncated). Clicking an item
              navigates to /[type]/[id] for full details. Implement infinite scroll or "Load More" pagination.
            </code>
          </div>
        </CardContent>
      </Card>

      {/* 3. Detail Page */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>3. Detail Page (Problem or Solution)</CardTitle>
              <CardDescription>Full view of a single item with all details, rankings, and linked items</CardDescription>
            </div>
            <Badge>Detail View</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-6 bg-muted/30">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <span className="hover:text-foreground cursor-pointer">Home</span>
              <ChevronRight className="h-4 w-4" />
              <span className="hover:text-foreground cursor-pointer">Problems</span>
              <ChevronRight className="h-4 w-4" />
              <span className="hover:text-foreground cursor-pointer">Water</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Water shortage...</span>
            </div>

            <div className="max-w-3xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>Water</Badge>
                    <span className="text-sm text-muted-foreground">Posted 3 days ago</span>
                  </div>
                  <h1 className="text-2xl font-bold">Water shortage in residential zone</h1>
                </div>
                <div className="flex flex-col items-center gap-1 ml-6 p-4 bg-muted/50 rounded-xl">
                  <button className="p-2 hover:bg-background rounded-lg">
                    <ArrowUp className="h-6 w-6 text-primary" />
                  </button>
                  <span className="text-2xl font-bold">42</span>
                  <span className="text-xs text-muted-foreground">votes</span>
                </div>
              </div>

              {/* Short Description - Highlighted */}
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mb-6">
                <p className="text-lg">
                  The water supply has been inconsistent for the past 3 months, affecting daily life and causing
                  significant challenges for residents in Zone A and B.
                </p>
              </div>

              {/* Long Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Detailed Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>
                    Full detailed description of the problem goes here. This section can contain up to 2500 characters
                    and provides all the context needed to understand the issue fully. The water infrastructure in zones
                    A and B was installed in 1985 and has not received major maintenance in the past decade...
                  </p>
                </div>
              </div>

              {/* Rankings */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Rankings (1-10)</h2>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { label: "Impact", value: 8, color: "bg-red-500" },
                    { label: "Urgency", value: 7, color: "bg-orange-500" },
                    { label: "Feasibility", value: 5, color: "bg-yellow-500" },
                    { label: "Affected", value: 9, color: "bg-blue-500" },
                    { label: "Costs", value: 6, color: "bg-purple-500" },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-4 bg-muted/50 rounded-xl">
                      <div
                        className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                      >
                        <span className="text-xl font-bold text-white">{item.value}</span>
                      </div>
                      <div className="text-sm font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Solutions */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Linked Solutions ({2})
                </h2>
                <div className="space-y-3">
                  <div className="border rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <ArrowUp className="h-4 w-4 text-primary" />
                          <span className="text-sm font-bold">24</span>
                        </div>
                        <div>
                          <p className="font-medium">Rainwater harvesting system</p>
                          <p className="text-sm text-muted-foreground">A community-led initiative to collect...</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="border rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <ArrowUp className="h-4 w-4 text-primary" />
                          <span className="text-sm font-bold">18</span>
                        </div>
                        <div>
                          <p className="font-medium">Community water tank proposal</p>
                          <p className="text-sm text-muted-foreground">Installing shared water storage...</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-muted p-4 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground mb-2"># Cursor prompt:</p>
            <code>
              Create a detail page at /problem/[id] and /solution/[id] showing: breadcrumb, category badge, timestamp,
              title, upvote section (permanent votes using device hash), short description (highlighted with left
              border), long description, 5 rankings displayed as colored circles with values, and linked items section
              (solutions for problems, problems for solutions using many-to-many relationship). Clicking linked items
              navigates to their detail pages.
            </code>
          </div>
        </CardContent>
      </Card>

      {/* 4. Problem Creation Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>4. Problem Creation Form</CardTitle>
              <CardDescription>Form for contributors to submit new problems with helper questions</CardDescription>
            </div>
            <Badge variant="secondary">Contributor Only</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-6 bg-muted/30">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-6">Submit a Problem</h2>

              <div className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <div className="border rounded-lg p-3 bg-background">
                    <span className="text-muted-foreground">Select a category...</span>
                  </div>
                </div>

                {/* Short Description with Helper */}
                <div>
                  <label className="block text-sm font-medium mb-2">Short Description (max 300 chars) *</label>
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg mb-2 text-sm">
                    <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Helper questions:</p>
                    <ul className="text-blue-600 dark:text-blue-400 text-xs space-y-1">
                      <li>• What is the core issue?</li>
                      <li>• Who is affected?</li>
                      <li>• Why does it matter?</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3 bg-background h-24">
                    <span className="text-muted-foreground">Brief teaser in 3 sentences...</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">0/300 characters</p>
                </div>

                {/* Long Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Detailed Description (max 2500 chars)</label>
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg mb-2 text-sm">
                    <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Consider including:</p>
                    <ul className="text-blue-600 dark:text-blue-400 text-xs space-y-1">
                      <li>• When did this start?</li>
                      <li>• What have you tried?</li>
                      <li>• What resources are needed?</li>
                      <li>• What's the ideal outcome?</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3 bg-background h-40">
                    <span className="text-muted-foreground">Full explanation...</span>
                  </div>
                </div>

                {/* Rankings */}
                <div>
                  <label className="block text-sm font-medium mb-4">Rankings (1-10)</label>
                  <div className="grid grid-cols-5 gap-4">
                    {["Impact", "Urgency", "Feasibility", "Affected", "Costs"].map((label) => (
                      <div key={label} className="text-center">
                        <div className="border rounded-lg p-3 bg-background mb-1">
                          <span className="text-muted-foreground">5</span>
                        </div>
                        <span className="text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium">
                  Submit Problem
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-muted p-4 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground mb-2"># Cursor prompt:</p>
            <code>
              Create a problem submission form with: category dropdown, short_text (max 300 chars) with helper questions
              shown above, long_text (max 2500 chars) with helper questions, and 5 ranking sliders (1-10) for Impact,
              Urgency, Feasibility, Affected, Costs. Helper questions appear in a blue info box and disappear when field
              has content. Character counter updates in real-time.
            </code>
          </div>
        </CardContent>
      </Card>

      {/* 5. Solution Creation Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>5. Solution Creation Form</CardTitle>
              <CardDescription>Form for submitting solutions linked to one or more problems</CardDescription>
            </div>
            <Badge variant="secondary">Contributor Only</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-4 bg-muted/30">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-6">Submit a Solution</h3>

              <div className="space-y-6">
                {/* Short Description with Helper */}
                <div>
                  <label className="block text-sm font-medium mb-2">Short Description (max 300 chars) *</label>
                  <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg mb-2 text-sm">
                    <p className="font-medium text-green-700 dark:text-green-300 mb-1">Helper questions:</p>
                    <ul className="text-green-600 dark:text-green-400 text-xs space-y-1">
                      <li>• What is your proposed solution?</li>
                      <li>• How does it address the problem(s)?</li>
                      <li>• What makes this approach effective?</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3 bg-background h-24">
                    <span className="text-muted-foreground">Brief teaser in 3 sentences...</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">0/300 characters</p>
                </div>

                {/* Long Description with Helper */}
                <div>
                  <label className="block text-sm font-medium mb-2">Detailed Description (max 2500 chars)</label>
                  <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg mb-2 text-sm">
                    <p className="font-medium text-green-700 dark:text-green-300 mb-1">Consider including:</p>
                    <ul className="text-green-600 dark:text-green-400 text-xs space-y-1">
                      <li>• What are the implementation steps?</li>
                      <li>• What resources/skills are needed?</li>
                      <li>• What is the estimated timeline?</li>
                      <li>• Are there similar solutions that worked elsewhere?</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3 bg-background h-40">
                    <span className="text-muted-foreground">Full explanation of the solution...</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">0/2500 characters</p>
                </div>

                {/* Improvements Field with Helper */}
                <div>
                  <label className="block text-sm font-medium mb-2">Improvements & Comments (max 500 chars)</label>
                  <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg mb-2 text-sm">
                    <p className="font-medium text-green-700 dark:text-green-300 mb-1">Consider:</p>
                    <ul className="text-green-600 dark:text-green-400 text-xs space-y-1">
                      <li>• What limitations does this solution have?</li>
                      <li>• How could it be scaled or improved?</li>
                      <li>• What risks should be considered?</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3 bg-background h-20">
                    <span className="text-muted-foreground">How could this solution be improved?</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">0/500 characters</p>
                </div>

                {/* Note about rankings */}
                <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
                  Note: Solution rankings will be available in a later version (currently disabled for MVP)
                </div>

                {/* Link to Multiple Problems */}
                <div>
                  <label className="block text-sm font-medium mb-2">Link to Problems (many-to-many)</label>
                  <p className="text-xs text-muted-foreground mb-2">Solutions can be linked to multiple problems.</p>
                  <div className="border rounded-lg p-3 bg-background">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Link2 className="h-4 w-4" />
                      <span>Search and select problems to link...</span>
                    </div>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="border rounded-lg p-3 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Water shortage in Zone A</p>
                          <p className="text-xs text-muted-foreground">Infrastructure - 24 upvotes</p>
                        </div>
                        <Badge variant="secondary">Linked</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium">
                  Submit Solution
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-muted p-4 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground mb-2"># Cursor prompt:</p>
            <code>
              Create a solution submission form with: short_text (max 300 chars) with helper questions (What is your
              proposed solution? How does it address the problem(s)? What makes this approach effective?), long_text
              (max 2500 chars) with helper questions (implementation steps, resources/skills needed, estimated timeline,
              similar solutions elsewhere), improvements field (max 500 chars) with helper questions (limitations,
              scaling improvements, risks), and a multi-select searchable dropdown to link to multiple existing
              problems. Helper questions appear in a green info box and disappear when field has content. Character
              counter updates in real-time. No rankings for solutions in MVP. Use a many-to-many relationship table.
            </code>
          </div>
        </CardContent>
      </Card>

      {/* 6. Moderation Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>6. Moderation Dashboard</CardTitle>
              <CardDescription>Review spam, duplicates, and manage content. All actions logged.</CardDescription>
            </div>
            <Badge variant="destructive">Moderator Only</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-4 bg-muted/30">
            <div className="flex gap-4">
              {/* Sidebar */}
              <div className="w-48 border-r pr-4">
                <h4 className="font-medium mb-3">Moderation</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 p-2 bg-primary/10 rounded">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Duplicate Alerts
                    <Badge className="ml-auto text-xs">5</Badge>
                  </li>
                  <li className="flex items-center gap-2 p-2 hover:bg-muted rounded">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    Flagged Content
                    <Badge variant="outline" className="ml-auto text-xs">
                      2
                    </Badge>
                  </li>
                  <li className="flex items-center gap-2 p-2 hover:bg-muted rounded">Pending Review</li>
                  <li className="flex items-center gap-2 p-2 hover:bg-muted rounded">Merged Items</li>
                  <li className="flex items-center gap-2 p-2 hover:bg-muted rounded">Moderation Log</li>
                  <li className="flex items-center gap-2 p-2 hover:bg-muted rounded">Categories</li>
                  <li className="flex items-center gap-2 p-2 hover:bg-muted rounded">Invite Management</li>
                </ul>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <h4 className="font-medium mb-4">Potential Duplicates (AI-Detected, Score &gt;0.78)</h4>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-background">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-orange-500">Score: 0.85</Badge>
                      <span className="text-sm text-muted-foreground">Detected 2h ago</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded p-3 bg-muted/30">
                        <p className="font-medium text-sm">Problem A: Water supply issues</p>
                        <p className="text-xs text-muted-foreground mt-1">The water supply has been...</p>
                      </div>
                      <div className="border rounded p-3 bg-muted/30">
                        <p className="font-medium text-sm">Problem B: Water shortage</p>
                        <p className="text-xs text-muted-foreground mt-1">We are experiencing water...</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded">
                        Merge Items
                      </button>
                      <button className="px-3 py-1.5 border text-sm rounded">Dismiss</button>
                    </div>
                    <div className="mt-3 border-t pt-3">
                      <label className="block text-xs font-medium mb-1">Justification (required)</label>
                      <div className="border rounded p-2 bg-background h-16">
                        <span className="text-xs text-muted-foreground">Enter reason for this action...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-muted p-4 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground mb-2"># Cursor prompt:</p>
            <code>
              Create a moderation dashboard with sidebar: Duplicate Alerts, Flagged Content, Pending Review, Merged
              Items, Moderation Log, Categories, Invite Management. Main area shows duplicate pairs with similarity
              score, merge/dismiss actions, and REQUIRED justification field. All actions logged with moderator ID,
              timestamp, and justification.
            </code>
          </div>
        </CardContent>
      </Card>

      {/* 7. Invite Flow */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>7. Invite Flow (Contributor Registration)</CardTitle>
              <CardDescription>Invite-only access for contributors</CardDescription>
            </div>
            <Badge>Authentication</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-4 bg-muted/30">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-6 text-center">Become a Contributor</h3>

              <div className="space-y-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="w-16 h-0.5 bg-muted" />
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">2</div>
                  <div className="w-16 h-0.5 bg-muted" />
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">3</div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Invite Code *</label>
                  <div className="border rounded-lg p-3 bg-background">
                    <span className="text-muted-foreground">Enter your invite code...</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <div className="border rounded-lg p-3 bg-background">
                    <span className="text-muted-foreground">your.email@example.com</span>
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium">
                  Verify Invite Code
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-muted p-4 rounded-lg font-mono text-sm">
            <p className="text-muted-foreground mb-2"># Cursor prompt:</p>
            <code>
              Create an invite-based registration flow with 3 steps: 1) Enter invite code 2) Verify email 3) Set display
              name. Validate invite code against database before proceeding. Track invited_by field.
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
