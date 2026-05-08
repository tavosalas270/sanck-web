"use client"

import { useState } from 'react';
import { useFavorites } from '../hooks/useWatch';
import { EpisodeCard } from './EpisodeCard';
import { VideoPlayerModal } from './VideoPlayerModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Videos } from '../schemas';
import { Heart } from 'lucide-react';

export const FavoriteScreen = () => {
    const queryFavorites = useFavorites();
    const [selectedVideo, setSelectedVideo] = useState<Videos | null>(null);

    const handleEpisodeClick = (video: Videos) => {
        setSelectedVideo(video);
    };

    if (queryFavorites.isLoading) {
        return (
            <div className="min-h-screen w-full bg-snak-purple-dark p-4 md:p-12 space-y-8">
                <div className="h-8 w-48 bg-white/5 rounded-full animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="aspect-video w-full rounded-xl bg-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    const favoritesData = queryFavorites.data?.pages.flatMap((page) => page) || [];

    return (
        <main className="min-h-screen w-full bg-snak-purple-dark text-white pb-20">
            <div className="max-w-[1440px] mx-auto p-4 md:p-12 space-y-12 animate-in fade-in duration-500">
                <header className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-snak-pink/20 flex items-center justify-center border border-snak-pink/30">
                        <Heart className="size-6 text-snak-pink fill-snak-pink" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading text-white">Mis Favoritos</h1>
                        <p className="text-zinc-500 text-sm">Tus videos guardados para ver después</p>
                    </div>
                </header>

                {favoritesData.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {favoritesData.map((fav) => (
                            <EpisodeCard
                                key={fav.id}
                                video={fav.video_details}
                                onClick={handleEpisodeClick}
                                className="w-full h-full flex-shrink"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="h-[50vh] w-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                        <Heart className="size-16 text-zinc-800" />
                        <div className="text-center">
                            <p className="text-xl font-medium text-zinc-400">Aún no tienes favoritos</p>
                            <p className="text-sm">Explora videos y presiona el corazón para guardarlos</p>
                        </div>
                    </div>
                )}

                {/* Infinite Scroll Trigger */}
                {queryFavorites.hasNextPage && (
                    <div
                        className="py-12 flex items-center justify-center"
                        ref={(el) => {
                            if (el && !queryFavorites.isFetchingNextPage) {
                                queryFavorites.fetchNextPage();
                            }
                        }}
                    >
                        <div className="size-10 rounded-full border-4 border-snak-pink border-t-transparent animate-spin" />
                    </div>
                )}
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <VideoPlayerModal
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
        </main>
    );
};
