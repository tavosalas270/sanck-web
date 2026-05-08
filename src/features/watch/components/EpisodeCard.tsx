"use client"

import Image from "next/image";
import { Videos } from "../schemas";
import { formatUrl } from "@/lib/utils";
import { Play, Star, Loader2, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAddFavorite, useUserData, usePayVideo } from "../hooks/useWatch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface EpisodeCardProps {
    video: Videos;
    onClick: (video: Videos) => void;
    isFavorite?: boolean;
    className?: string;
}

export const EpisodeCard = ({ video, onClick, isFavorite, className }: EpisodeCardProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isInsufficientOpen, setIsInsufficientOpen] = useState(false);
    const { mutate: addFavorite, isPending: isFavoritePending } = useAddFavorite();
    const { mutate: payVideo, isPending: isPaying } = usePayVideo();

    const { data: userData } = useUserData();

    const shouldShowPrice = !video.is_unlocked && video.cost > 0;

    const handleCardClick = () => {
        if (shouldShowPrice) {
            setIsConfirmOpen(true);
        } else {
            onClick(video);
        }
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        addFavorite(video.id.toString());
    };

    const handleConfirmPay = () => {
        // Verificar saldo
        const userTokens = userData?.tokens || 0;
        if (userTokens < video.cost) {
            setIsConfirmOpen(false);
            setTimeout(() => setIsInsufficientOpen(true), 100);
            return;
        }

        payVideo(video.id.toString(), {
            onSuccess: () => {
                setIsConfirmOpen(false);
                onClick(video);
            }
        });
    };

    return (
        <>
            <div
                onClick={handleCardClick}
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

                {/* Star Button (Favorite) */}
                <button
                    onClick={handleFavoriteClick}
                    disabled={isFavoritePending}
                    className={cn(
                        "absolute top-2 right-2 z-10 size-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10 hover:bg-snak-pink transition-all opacity-80 group-hover:opacity-100 group/star",
                        isFavorite && "border-snak-pink/50 bg-snak-pink/20 opacity-100"
                    )}
                >
                    {isFavoritePending ? (
                        <Loader2 className="size-4 text-white animate-spin" />
                    ) : (
                        <Star className={cn(
                            "size-4 text-white transition-colors",
                            isFavorite && "fill-snak-pink text-snak-pink",
                            "group-hover/star:fill-white group-hover/star:text-white"
                        )} />
                    )}
                </button>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="size-10 rounded-full bg-snak-pink flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="fill-white text-white size-5 ml-1" />
                    </div>
                </div>

                {/* Price / Status Tag */}
                {shouldShowPrice && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-full bg-snak-purple-dark/80 backdrop-blur-sm border border-snak-blue-aqua/30 flex items-center gap-1.5 shadow-lg">
                        <Coins className="size-3 text-snak-blue-aqua animate-pulse" />
                        <span className="text-[10px] font-black text-white">
                            {video.cost}
                        </span>
                    </div>
                )}

                {/* Info */}
                <div className="absolute bottom-0 left-0 p-3 w-full flex items-end justify-between">
                    <p className="text-white text-xs font-bold truncate drop-shadow-md pr-2">
                        {video.episode_number}. {video.title}
                    </p>

                    {/* Indicador de compra en la esquina inferior derecha como pidió */}
                    {shouldShowPrice && (
                        <div className="flex items-center gap-1 bg-snak-pink px-2 py-0.5 rounded-md shadow-md scale-90 origin-right">
                            <Coins className="size-3 text-white" />
                            <span className="text-[10px] font-bold text-white">{video.cost}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Purchase Dialog */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="bg-snak-purple-dark border-white/10 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-heading flex items-center gap-2">
                            <Coins className="text-snak-blue-aqua" />
                            ¿Desbloquear episodio?
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Estás por adquirir "{video.title}" por <span className="text-snak-pink font-bold">{video.cost} tokens</span>. ¿Deseas continuar?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-end mt-6">
                        <DialogClose asChild>
                            <Button variant="ghost" className="hover:bg-white/5 text-zinc-400">
                                NO
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleConfirmPay}
                            disabled={isPaying}
                            className="bg-snak-pink hover:bg-snak-pink/80 text-white font-bold px-8"
                        >
                            {isPaying ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                "SI"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Insufficient Balance Dialog */}
            <Dialog open={isInsufficientOpen} onOpenChange={setIsInsufficientOpen}>
                <DialogContent className="bg-snak-purple-dark border-snak-pink/30 text-white sm:max-w-xs p-6 rounded-3xl">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="size-16 rounded-full bg-snak-pink/10 flex items-center justify-center border border-snak-pink/20">
                            <Coins className="size-8 text-snak-pink" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-heading text-white">Saldo Insuficiente</h3>
                            <p className="text-sm text-zinc-400">
                                No tiene saldo suficiente para adquirir este video.
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsInsufficientOpen(false)}
                            className="w-full bg-snak-pink hover:bg-snak-pink/80 text-white font-bold rounded-full"
                        >
                            Entendido
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
