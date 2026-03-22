import { Metadata } from "next"
import { apiData, getAPIById } from "@/data/apis"
import APIDetailPage from "@/components/explorer/APIDetailPage"

export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: { apiId: string }
}): Promise<Metadata> {
  const api = getAPIById(params.apiId)

  if (!api) {
    return {
      title: "API Not Found | APIdex",
      description: "The API you're looking for doesn't exist.",
    }
  }

  return {
    title: `${api.name} API | APIdex`,
    description: api.shortDescription,
    keywords: [...api.tags, api.category, api.provider].join(", "),
    openGraph: {
      title: `${api.name} API`,
      description: api.shortDescription,
      type: "website",
    },
  }
}

export function generateStaticParams() {
  return apiData.map((api) => ({
    apiId: api.id,
  }))
}

export default function APIDetailRoute({
  params,
}: {
  params: { apiId: string }
}) {
  const api = getAPIById(params.apiId)

  if (!api) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display mb-4">404 - API Not Found</h1>
          <p className="text-text/60 mb-8">
            The API "{params.apiId}" doesn't exist in our database.
          </p>
          <a
            href="/explorer"
            className="inline-block px-6 py-2 bg-teal text-bg rounded-lg hover:bg-teal/90 transition-colors"
          >
            Back to Explorer
          </a>
        </div>
      </div>
    )
  }

  return <APIDetailPage api={api} />
}
