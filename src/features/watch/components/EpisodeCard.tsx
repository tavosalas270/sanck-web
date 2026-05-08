"use client"

import Image from "next/image";
import { Videos } from "../schemas";
import { formatUrl } from "@/lib/utils";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface EpisodeCardProps {
    video: Videos;
    onClick: (video: Videos) => void;
    className?: string;
}

export const EpisodeCard = ({ video, onClick, className }: EpisodeCardProps) => {
    return (
        <div 
            onClick={() => onClick(video)}
            className={cn(
                "group relative flex-shrink-0 w-48 md:w-56 aspect-video rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-snak-pink/50",
                className
            )}
        >
            {formatUrl(video.thumbnail_path) ? (
                <Image
                    src={formatUrl(video.thumbnail_path)!}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full bg-snak-purple-medium/20" />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="size-10 rounded-full bg-snak-pink flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="fill-white text-white size-5 ml-1" />
                </div>
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 p-3 w-full">
                <p className="text-white text-xs font-bold truncate drop-shadow-md">
                    {video.episode_number}. {video.title}
                </p>
            </div>
        </div>
    );
};
