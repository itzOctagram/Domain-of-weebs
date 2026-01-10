import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"

interface NewsItem {
    title: string
    id: string
    uploadedAt: string
    topics: string[]
    preview: {
        intro: string
        full: string
    }
    thumbnail: string
    url: string
}

const AnimeNewsSection = () => {
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchNews() {
            try {
                const endpoints = import.meta.env.VITE_CONSUMET_API_ENDPOINTS.split(",");
                const baseUrl = endpoints[0].trim();
                const response = await fetch(`${baseUrl}/news/ann/recent-feeds`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                setNews(data)
                setLoading(false)
            } catch (error: any) {
                console.error("Error fetching anime news:", error)
                setError("Failed to load news. Please try again later.")
                setLoading(false)
            }
        }

        fetchNews()
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl relative font-bold mb-6 text-doki-white">Latest Anime News</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="card bg-doki-dark-grey shadow-lg flex flex-col animate-pulse">
                            <div className="card-body flex flex-col flex-grow">
                                <div className="h-6 bg-doki-light-grey rounded w-2/3 mb-4"></div>
                                <div className="h-48 bg-doki-light-grey rounded mb-4"></div>
                                <div className="h-4 bg-doki-light-grey rounded w-full mb-2"></div>
                                <div className="h-4 bg-doki-light-grey rounded w-5/6"></div>
                                <div className="h-4 bg-doki-light-grey rounded w-1/3 mt-4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-4xl relative font-bold mb-6 font-lato text-doki-white">Latest Anime News</h2>
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                    <div key={item.id} className="card bg-doki-light-grey shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300">
                        {/* Thumbnail */}
                        {item.thumbnail && (
                            <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                                loading="lazy"
                            />
                        )}
                        <div className="card-body font-lato flex flex-col flex-grow p-4">
                            <h3 className="card-title text-xl font-lato text-doki-purple mb-2">{item.title}</h3>
                            <p className="text-sm text-doki-white line-clamp-3">{item.preview.intro}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {item.topics.slice(0, 3).map((topic, index) => (
                                    <span key={index} className="badge badge-secondary p-4 bg-doki-purple text-doki-white">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="card-footer p-4 bg-doki-dark-grey rounded-b-lg flex justify-between items-center">
                            <p className="text-md font-hpSimplifiedbold text-doki-white">
                                {item.uploadedAt}
                            </p>
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline btn-sm flex items-center gap-2 text-doki-purple border-doki-purple hover:bg-doki-purple hover:text-doki-white"
                            >
                                Read More
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AnimeNewsSection