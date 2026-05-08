"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Videos } from "../schemas";
import { formatUrl } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface VideoPlayerModalProps {
    video: Videos;
    onClose: () => void;
}

export const VideoPlayerModal = ({ video, onClose }: VideoPlayerModalProps) => {

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
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-snak-pink/20 text-snak-pink text-xs font-bold rounded uppercase tracking-wider">
                                Capítulo {video.episode_number}
                            </span>
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
