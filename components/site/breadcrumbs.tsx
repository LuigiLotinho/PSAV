import Link from "next/link"

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground font-medium" : ""}>{item.label}</span>
            )}
            {!isLast && <span className="text-muted-foreground">/</span>}
          </div>
        )
      })}
    </nav>
  )
}
