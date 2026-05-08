"use client"

import { useState } from 'react';
import { useSeries, useCategories, useFavorites } from '../hooks/useWatch';
import { 
    SeriesSection, 
    VideosFiltered, 
    VideoPlayerModal, 
    FavoriteScreen 
} from './index';
import { Skeleton } from '@/components/ui/skeleton';
import { Videos } from '../schemas';
import { Input } from '@/components/ui/input';
import { Search, X, Filter, PlayCircle, Heart } from 'lucide-react';
import { useMemo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

export const WatchScreen = () => {
    const querySeries = useSeries();
    const queryCategories = useCategories();
    const queryFavorites = useFavorites();
    
    const [selectedVideo, setSelectedVideo] = useState<Videos | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    const handleEpisodeClick = (video: Videos) => {
        setSelectedVideo(video);
    };

    const isFiltering = searchQuery.length > 0 || (selectedCategoryId !== '' && selectedCategoryId !== 'all');

    const favoriteVideoIds = useMemo(() => {
        const ids = new Set<string>();
        queryFavorites.data?.pages.forEach(page => {
            page.forEach(fav => {
                ids.add(fav.video.toString());
            });
        });
        return ids;
    }, [queryFavorites.data]);

    if (querySeries.isLoading) {
        return (
            <div className="min-h-screen w-full bg-snak-purple-dark p-4 md:p-12 space-y-12">
                {[1, 2].map((i) => (
                    <div key={i} className="space-y-6 w-full">
                        <Skeleton className="aspect-[21/7] w-full rounded-3xl bg-white/5" />
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((j) => (
                                <Skeleton key={j} className="h-32 w-56 flex-shrink-0 rounded-xl bg-white/5" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const seriesData = querySeries.data?.pages.flatMap((page) => page) || [];
    const categories = queryCategories.data || [];

    return (
        <main className="min-h-screen w-full bg-snak-purple-dark text-white pb-20 overflow-x-hidden relative">
            <Tabs defaultValue="watch" className="w-full">
                {/* Header / Search Section Sticky */}
                <header className="sticky top-0 z-50 w-full bg-snak-purple-dark/80 backdrop-blur-md border-b border-white/5 px-4 md:px-12 py-4">
                    <div className="max-w-[1440px] mx-auto space-y-6">
                        {/* Top Row: Title and Tabs */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <h1 className="text-2xl font-heading text-white">
                                Explorar
                            </h1>
                            
                            <TabsList className="bg-snak-purple-medium/30 border border-white/10 p-1 h-11 rounded-full">
                                <TabsTrigger 
                                    value="watch" 
                                    className="rounded-full px-6 data-[state=active]:bg-snak-pink data-[state=active]:text-white transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <PlayCircle className="size-4" />
                                        <span>Watch</span>
                                    </div>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="favorites" 
                                    className="rounded-full px-6 data-[state=active]:bg-snak-pink data-[state=active]:text-white transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <Heart className="size-4" />
                                        <span>Favorites</span>
                                    </div>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Bottom Row: Filters */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                            {/* Input de Búsqueda */}
                            <div className="relative flex-1 w-full group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 group-focus-within:text-snak-pink transition-colors" />
                                <Input
                                    placeholder="Buscar por título..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-10 bg-snak-purple-medium/20 border-white/10 focus:border-snak-pink/50 focus:ring-snak-pink/20 transition-all rounded-full h-11"
                                />
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <X className="size-3 text-zinc-400" />
                                    </button>
                                )}
                            </div>

                            {/* Select de Categoría */}
                            <div className="w-full sm:w-48">
                                <Select 
                                    key={selectedCategoryId}
                                    value={selectedCategoryId} 
                                    onValueChange={setSelectedCategoryId}
                                >
                                    <SelectTrigger className="bg-snak-purple-medium/20 border-white/10 rounded-full h-11 focus:ring-snak-pink/20">
                                        <div className="flex items-center gap-2">
                                            <Filter className="size-3 text-snak-blue-sky" />
                                            <SelectValue placeholder="Categoría" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-snak-purple-dark border-white/10 text-white">
                                        <SelectItem value="all" className="focus:bg-snak-pink focus:text-white">Todas</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem 
                                                key={cat.id} 
                                                value={cat.id.toString()}
                                                className="focus:bg-snak-pink focus:text-white"
                                            >
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Botón Reset */}
                            {(searchQuery.length > 0 || selectedCategoryId !== '') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategoryId('');
                                    }}
                                    className="text-xs text-snak-pink hover:text-white transition-colors font-bold uppercase tracking-wider px-2"
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <TabsContent value="watch" className="mt-0 outline-none">
                    <div className="max-w-[1440px] mx-auto p-4 md:p-12 space-y-16">
                        {isFiltering ? (
                            <VideosFiltered 
                                series={seriesData}
                                searchQuery={searchQuery}
                                selectedCategoryId={selectedCategoryId === 'all' ? undefined : selectedCategoryId}
                                onEpisodeClick={handleEpisodeClick}
                                favoriteVideoIds={favoriteVideoIds}
                            />
                        ) : (
                            <>
                                {seriesData.length > 0 ? (
                                    seriesData.map((series) => (
                                        <SeriesSection
                                            key={series.id}
                                            series={series}
                                            onEpisodeClick={handleEpisodeClick}
                                            favoriteVideoIds={favoriteVideoIds}
                                        />
                                    ))
                                ) : (
                                    <div className="h-[60vh] w-full flex items-center justify-center text-zinc-500 font-medium text-lg">
                                        No hay series disponibles en este momento.
                                    </div>
                                )}

                                {querySeries.hasNextPage && (
                                    <div
                                        className="py-12 flex items-center justify-center"
                                        ref={(el) => {
                                            if (el && !querySeries.isFetchingNextPage) {
                                                querySeries.fetchNextPage();
                                            }
                                        }}
                                    >
                                        <div className="size-10 rounded-full border-4 border-snak-pink border-t-transparent animate-spin" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="favorites" className="mt-0 outline-none">
                    <FavoriteScreen />
                </TabsContent>
            </Tabs>

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