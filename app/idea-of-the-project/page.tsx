import Link from "next/link"

export default function IdeaOfTheProjectPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-[100vw] w-full">
      <main className="container mx-auto px-4 py-8 md:py-10 max-w-3xl">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← Back to home
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Idea of the project</h1>

        <div className="prose prose-sm md:prose-base text-foreground/90 space-y-6 leading-relaxed">
          <p>
            The Auroville Solutions and Problems Platform is a space dedicated to positive change. It invites
            individuals to openly share ideas, challenges, and observations from daily life in Auroville not
            as complaints, but as starting points for growth. Every problem carries the seed of a solution,
            and by expressing it clearly and constructively, it can become an inspiration for others.
          </p>

          <p>
            The platform encourages a culture of responsibility and creativity. Individuals can propose
            concrete solutions, improvements, or experiments. At the same time, working committees, units,
            and services can use these insights as valuable feedback and as a source of inspiration for
            future projects and decisions.
          </p>

          <p>
            The focus is always more on solutions than on problems. The intention is not to criticize, but
            to collaborate — transforming difficulties into opportunities, and ideas into action. In this
            way, the platform becomes a living tool for collective intelligence, transparency, and
            continuous evolution in Auroville.
          </p>
        </div>
      </main>
    </div>
  )
}
