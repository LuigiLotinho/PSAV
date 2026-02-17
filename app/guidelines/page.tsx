import Link from "next/link"

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden max-w-[100vw] w-full">
      <main className="container mx-auto px-4 py-8 md:py-10 max-w-3xl">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
        >
          ← Back to home
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Guidelines</h1>

        <div className="prose prose-sm md:prose-base text-foreground/90 space-y-6 leading-relaxed">
          <p>
            We warmly invite everyone to contribute in a constructive and solution-oriented way. This space
            is meant to help us move forward together.
          </p>

          <p>
            Please consider the following gentle suggestions when writing:
          </p>

          <div className="space-y-6 pl-0">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">Focus on solutions</h2>
              <p className="text-muted-foreground">
                Briefly describing a challenge is helpful, but please give most of your attention to possible
                improvements and practical next steps.
              </p>
            </div>

            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">Avoid personal references</h2>
              <p className="text-muted-foreground">
                Please do not mention names of individuals or very small groups when describing problems or
                ideas. We aim to improve systems and structures, not to criticize people.
              </p>
            </div>

            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">Be respectful and constructive</h2>
              <p className="text-muted-foreground">
                Even when discussing difficulties, try to use language that encourages collaboration and
                dialogue.
              </p>
            </div>

            <div>
              <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">Be as specific as possible</h2>
              <p className="text-muted-foreground">
                Very broad problems are often hard to solve. Smaller, clearly described issues are more
                actionable. Solving small challenges builds confidence and momentum to address bigger ones
                over time.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">Content That May Be Removed</h2>
            <p className="text-muted-foreground mb-4">
              To protect the spirit of this space, the admin may remove contributions that include:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Insults or personal attacks</li>
              <li>Attacks toward minorities or vulnerable members of society</li>
              <li>Disrespectful or demeaning language</li>
            </ul>
          </div>

          <p className="text-foreground/90 pt-4">
            Our shared intention is to create a respectful environment where ideas can be expressed and
            positive change becomes possible.
          </p>
        </div>
      </main>
    </div>
  )
}
