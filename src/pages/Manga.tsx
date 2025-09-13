import { useState, useEffect } from 'react';

interface AltTitle {
    en?: string;
    [key: string]: string | undefined;
}

interface MangaResult {
    id: string;
    title: string;
    altTitles: AltTitle[];
    description: string;
    status: string;
    releaseDate: string | null;
    contentRating: string;
    lastVolume: string | null;
    lastChapter: string | null;
    image?: string;
}

interface ApiResponse {
    results: MangaResult[];
}

const Manga = () => {
    const [mangaList, setMangaList] = useState<MangaResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const apiEndpoint = import.meta.env.VITE_CONSUMET_API_ENDPOINTS;
                const response = await fetch(`${apiEndpoint}/manga/mangadex/top`);
                if (!response.ok) {
                    throw new Error('Failed to fetch manga data');
                }
                const data: ApiResponse = await response.json();
                if (data.results && data.results.length > 0) {
                    setMangaList(data.results);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchManga();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-doki-purple relative">
                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-6">
                        <div className="h-12 bg-gray-600/20 rounded-lg animate-pulse"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="space-y-4">
                                    <div className="aspect-[3/4] bg-gray-600/20 rounded-lg animate-pulse"></div>
                                    <div className="h-6 bg-gray-600/20 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-600/20 rounded animate-pulse w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-doki-purple relative flex items-center justify-center">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-lg max-w-md mx-4">
                    <h3 className="text-lg font-semibold mb-2">Error Loading Manga</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-doki-purple relative">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-doki-white mb-2">
                        Manga Collection
                    </h1>
                    <p className="text-doki-white/70">
                        Discover amazing manga titles and dive into incredible stories
                    </p>
                </div>

                {mangaList.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">No Manga Found</h3>
                            <p>We couldn't find any manga at the moment. Please try again later.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mangaList.map((manga) => (
                            <div
                                key={manga.id}
                                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-700/50"
                            >
                                {/* Manga Image */}
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    {manga.image ? (
                                        <img
                                            src={manga.image}
                                            alt={manga.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://via.placeholder.com/300x400/374151/9CA3AF?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700/50 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            manga.status === 'ongoing' 
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                            {manga.status}
                                        </span>
                                    </div>

                                    {/* Content Rating */}
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800/80 text-gray-300 border border-gray-600/50">
                                            {manga.contentRating}
                                        </span>
                                    </div>
                                </div>

                                {/* Manga Info */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-doki-white line-clamp-2 group-hover:text-doki-accent transition-colors">
                                            {manga.title}
                                        </h3>
                                        
                                        {/* Alternative Titles */}
                                        {manga.altTitles.length > 0 && (
                                            <p className="text-sm text-doki-white/60 mt-1 line-clamp-1">
                                                {Object.values(manga.altTitles[0])[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-doki-white/70 line-clamp-3">
                                        {manga.description}
                                    </p>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {manga.lastChapter && (
                                            <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded">
                                                Ch. {manga.lastChapter}
                                            </span>
                                        )}
                                        {manga.lastVolume && (
                                            <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded">
                                                Vol. {manga.lastVolume}
                                            </span>
                                        )}
                                        {manga.releaseDate && (
                                            <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded">
                                                {new Date(manga.releaseDate).getFullYear()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Read Button */}
                                    <button className="w-full mt-3 px-4 py-2 bg-doki-accent hover:bg-doki-accent/80 text-white font-medium rounded-lg transition-colors duration-200">
                                        Read Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Manga;