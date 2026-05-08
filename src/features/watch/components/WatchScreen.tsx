"use client"

import { useState } from 'react';
import { useSeries, useCategories } from '../hooks/useWatch';
import { SeriesSection, VideosFiltered, VideoPlayerModal } from './index';
import { Skeleton } from '@/components/ui/skeleton';
import { Videos } from '../schemas';
import { Input } from '@/components/ui/input';
import { Search, X, Filter } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const WatchScreen = () => {
    const querySeries = useSeries();
    const queryCategories = useCategories();
    
    const [selectedVideo, setSelectedVideo] = useState<Videos | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    const handleEpisodeClick = (video: Videos) => {
        setSelectedVideo(video);
    };

    const isFiltering = searchQuery.length > 0 || (selectedCategoryId !== '' && selectedCategoryId !== 'all');

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
            {/* Header / Search Section Sticky */}
            <header className="sticky top-0 z-50 w-full bg-snak-purple-dark/80 backdrop-blur-md border-b border-white/5 px-4 md:px-12 py-4">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <h1 className="text-2xl font-heading text-white hidden lg:block">
                        Explorar
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl">
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

                        {/* Botón Reset (Solo si hay filtros reales o selección) */}
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

            <div className="max-w-[1440px] mx-auto p-4 md:p-12 space-y-16">
                {isFiltering ? (
                    <VideosFiltered 
                        series={seriesData}
                        searchQuery={searchQuery}
                        selectedCategoryId={selectedCategoryId === 'all' ? undefined : selectedCategoryId}
                        onEpisodeClick={handleEpisodeClick}
                    />
                ) : (
                    <>
                        {seriesData.length > 0 ? (
                            seriesData.map((series) => (
                                <SeriesSection
                                    key={series.id}
                                    series={series}
                                    onEpisodeClick={handleEpisodeClick}
                                />
                            ))
                        ) : (
                            <div className="h-[60vh] w-full flex items-center justify-center text-zinc-500 font-medium text-lg">
                                No hay series disponibles en este momento.
                            </div>
                        )}

                        {/* Infinite Scroll Trigger - Only in main view */}
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