require("dotenv/config")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const categoryNames = [
  "Infrastructure",
  "Justice",
  "Health",
  "Media",
  "Relations",
  "Science",
  "Spirituality",
  "Arts",
  "Economics (Units)",
  "Economics (Individual)",
  "Economics (Overall)",
  "Educations",
  "Environment",
  "Governance",
  "Housing",
  "Other",
]

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

// 16 different images from public/category-images/
const slugToImage: Record<string, string> = {
  infrastructure: "/category-images/pexels-yide-sun-84747826-19446467.jpg",
  justice: "/category-images/pexels-antonia-spantzel-774939153-18923572.jpg",
  health: "/category-images/pexels-feyza-altun-120534393-13006757.jpg",
  media: "/category-images/pexels-bing-kol-470434409-35232818.jpg",
  relations: "/category-images/pexels-julia-volk-5769308.jpg",
  science: "/category-images/pexels-danieljschwarz-34770958.jpg",
  spirituality: "/category-images/pexels-tamara-elnova-218645958-12236732.jpg",
  arts: "/category-images/pexels-jean-pixels-427051121-35405252.jpg",
  "economics-units": "/category-images/economy.jpg",
  "economics-individual": "/category-images/pexels-caio-mantovani-97605853-17905810.jpg",
  "economics-overall": "/category-images/pexels-omar-eltahan-2157926445-35047961.jpg",
  educations: "/category-images/pexels-brett-sayles-30725518.jpg",
  environment: "/category-images/pexels-ilham-zovanka-2158121497-35383157.jpg",
  governance: "/category-images/pexels-chatchai-kurmbabpar-2154039831-33085423.jpg",
  housing: "/category-images/pexels-beardedtexantravels-5034542.jpg",
  other: "/category-images/pexels-imagevain-6622887.jpg",
}

// Matching website URL per category (can be edited later)
const slugToWebsiteUrl: Record<string, string> = {
  infrastructure: "https://en.wikipedia.org/wiki/Infrastructure",
  justice: "https://en.wikipedia.org/wiki/Justice",
  health: "https://www.who.int",
  media: "https://en.wikipedia.org/wiki/Media_(communication)",
  relations: "https://en.wikipedia.org/wiki/Interpersonal_relationship",
  science: "https://en.wikipedia.org/wiki/Science",
  spirituality: "https://en.wikipedia.org/wiki/Spirituality",
  arts: "https://en.wikipedia.org/wiki/Arts",
  "economics-units": "https://en.wikipedia.org/wiki/Microeconomics",
  "economics-individual": "https://en.wikipedia.org/wiki/Behavioral_economics",
  "economics-overall": "https://en.wikipedia.org/wiki/Macroeconomics",
  educations: "https://en.wikipedia.org/wiki/Education",
  environment: "https://en.wikipedia.org/wiki/Environment_(biophysical)",
  governance: "https://en.wikipedia.org/wiki/Governance",
  housing: "https://en.wikipedia.org/wiki/Housing",
  other: "https://en.wikipedia.org/wiki/Main_Page",
}

async function main() {
  for (const name of categoryNames) {
    const slug = slugify(name)
    await prisma.category.upsert({
      where: { slug },
      create: {
        name,
        slug,
        image: slugToImage[slug] ?? null,
        websiteUrl: slugToWebsiteUrl[slug] ?? null,
      },
      update: {
        name,
        image: slugToImage[slug] ?? null,
        websiteUrl: slugToWebsiteUrl[slug] ?? null,
      },
    })
  }

  console.log(`Seeded ${categoryNames.length} categories (each with its own image, no problems or solutions).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
