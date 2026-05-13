"use client"

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Videos } from "../schemas";
import { cn, formatUrl } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Heart, Loader2 } from "lucide-react";
import { useLikeVideo } from "../hooks/useWatch";

interface VideoPlayerModalProps {
    video: Videos;
    onClose: () => void;
}

export const VideoPlayerModal = ({ video, onClose }: VideoPlayerModalProps) => {
    const { mutate: likeVideo, isPending: isLikePending } = useLikeVideo();
    const [hasLiked, setHasLiked] = useState(video.user_has_liked);
    const [likesCount, setLikesCount] = useState(video.likes_count);

    useEffect(() => {
        setHasLiked(video.user_has_liked);
        setLikesCount(video.likes_count);
    }, [video]);

    const handleLikeClick = () => {
        likeVideo(video.id.toString(), {
            onSuccess: (response) => {
                const isLiked = response.status === 'liked';
                const likeDiff = isLiked ? 1 : -1;
                setHasLiked(isLiked);
                setLikesCount(prev => Math.max(0, (prev || 0) + likeDiff));
            }
        });
    };

    return (
        <Dialog open={!!video} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-black/90 border-snak-purple-medium backdrop-blur-xl overflow-hidden">
                <VisuallyHidden>
                    <DialogHeader>
                        <DialogTitle>{video.title}</DialogTitle>
                    </DialogHeader>
                </VisuallyHidden>

                <div className="relative aspect-video w-full flex items-center justify-center bg-black">
                    {formatUrl(video.video_path) && (
                        <video
                            src={formatUrl(video.video_path)!}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                            controlsList="nodownload"
                        >
                            Tu navegador no soporta el elemento de video.
                        </video>
                    )}
                </div>

                <div className="p-6 bg-snak-purple-dark/40">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-white font-heading text-xl md:text-2xl">
                            {video.title}
                        </h2>
                        <div className="flex flex-col items-end gap-2.5">
                            <span className="px-2 py-1 bg-snak-pink/20 text-snak-pink text-xs font-bold rounded uppercase tracking-wider">
                                Capítulo {video.episode_number}
                            </span>

                            {/* Botón de like con el mismo estilo premium */}
                            <button
                                onClick={handleLikeClick}
                                disabled={isLikePending}
                                className={cn(
                                    "px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center gap-1.5 shadow-lg hover:bg-white/10 transition-all opacity-90 hover:opacity-100",
                                    hasLiked && "border-snak-pink/50 bg-snak-pink/20"
                                )}
                            >
                                {isLikePending ? (
                                    <Loader2 className="size-3.5 text-white animate-spin" />
                                ) : (
                                    <Heart className={cn(
                                        "size-3.5 transition-colors",
                                        hasLiked ? "fill-snak-pink text-snak-pink" : "text-white"
                                    )} />
                                )}
                                <span className="text-[10px] font-bold text-white">
                                    {likesCount ?? 0}
                                </span>
                            </button>
                        </div>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-snak-pink">
                        {video.description || "Sin descripción disponible para este capítulo."}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/10">
                        <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                            Temporada {video.season_number}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
