"use client"

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Videos } from "../schemas";
import { cn, formatUrl } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Heart, Loader2, Maximize, Minimize, X } from "lucide-react";
import { useComments, useLikeVideo, usePostComment, useUserData } from "../hooks/useWatch";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VideoPlayerModalProps {
    video: Videos;
    onClose: () => void;
}

export const VideoPlayerModal = ({ video, onClose }: VideoPlayerModalProps) => {
    const { mutate: likeVideo, isPending: isLikePending } = useLikeVideo();
    const { data: comments, isLoading: isLoadingComments } = useComments(video?.id?.toString());
    const { data: userData } = useUserData();
    const { mutate: postComment, isPending: isCommentPending } = usePostComment();

    const [commentText, setCommentText] = useState("");
    const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});
    const [isCustomFullscreen, setIsCustomFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSendComment = (parentId?: number) => {
        const content = parentId ? replyTexts[parentId] : commentText;
        if (!content || !content.trim()) return;

        const userId = userData?.id || "1";
        const username = userData?.username || "usuario";

        postComment({
            video: video.id.toString(),
            user: userId,
            user_username: username,
            content: content.trim(),
            parent: parentId
        }, {
            onSuccess: () => {
                if (parentId) {
                    setReplyTexts(prev => ({ ...prev, [parentId]: "" }));
                } else {
                    setCommentText("");
                }
            }
        });
    };

    const [hasLiked, setHasLiked] = useState(video.user_has_liked);
    const [likesCount, setLikesCount] = useState(video.likes_count);

    useEffect(() => {
        setHasLiked(video.user_has_liked);
        setLikesCount(video.likes_count);
    }, [video]);

    // Auto-ocultar controles del fullscreen custom tras 3s de inactividad
    const resetControlsTimer = () => {
        setShowControls(true);
        if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
        controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    useEffect(() => {
        if (isCustomFullscreen) {
            resetControlsTimer();
        } else {
            setShowControls(true);
            if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
        }
        return () => {
            if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCustomFullscreen]);

    // Salir del fullscreen custom con botón Back del teléfono
    useEffect(() => {
        if (!isCustomFullscreen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsCustomFullscreen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCustomFullscreen]);

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

    // Overlay de fullscreen custom — montado en <body> via portal para evitar z-index del Dialog
    const customFullscreenOverlay = isCustomFullscreen ? createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
            onClick={resetControlsTimer}
            onTouchStart={resetControlsTimer}
        >
            <video
                ref={videoRef}
                src={formatUrl(video.video_path)!}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                controlsList="nodownload nofullscreen"
            >
                Tu navegador no soporta el elemento de video.
            </video>

            {/* Botón salir del fullscreen */}
            <button
                onClick={() => setIsCustomFullscreen(false)}
                className={cn(
                    "absolute top-4 right-4 size-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
                    showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                <Minimize className="size-5 text-white" />
            </button>
        </div>,
        document.body
    ) : null;

    return (
        <>
            {customFullscreenOverlay}

            <Dialog open={!!video} onOpenChange={onClose}>
                <DialogContent className="max-w-5xl p-0 bg-black/90 border-snak-purple-medium backdrop-blur-xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-snak-pink">
                    <VisuallyHidden>
                        <DialogHeader>
                            <DialogTitle>{video.title}</DialogTitle>
                        </DialogHeader>
                    </VisuallyHidden>

                    {/* Contenedor del video con botón fullscreen custom */}
                    <div className="relative aspect-video w-full flex items-center justify-center bg-black group">
                        {formatUrl(video.video_path) && !isCustomFullscreen && (
                            <video
                                ref={videoRef}
                                src={formatUrl(video.video_path)!}
                                controls
                                autoPlay
                                playsInline
                                className="w-full h-full object-contain"
                                controlsList="nodownload nofullscreen"
                            >
                                Tu navegador no soporta el elemento de video.
                            </video>
                        )}

                        {/* Botón fullscreen custom — reemplaza el nativo */}
                        {!isCustomFullscreen && (
                            <button
                                onClick={() => setIsCustomFullscreen(true)}
                                className="absolute bottom-12 right-3 size-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                title="Pantalla completa"
                            >
                                <Maximize className="size-4 text-white" />
                            </button>
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

                        {/* Sección de Comentarios estilo FB/Insta/TikTok */}
                        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-4">
                            <h3 className="text-white font-heading text-sm md:text-base flex items-center gap-2">
                                Comentarios <span className="text-xs px-2 py-0.5 rounded-full bg-snak-purple-medium text-snak-blue-aqua font-sans font-bold">{comments?.length || 0}</span>
                            </h3>

                            {/* Input sugerido */}
                            <div className="flex gap-3 items-center">
                                <Avatar className="size-8 border border-white/10 shrink-0">
                                    <AvatarFallback className="bg-snak-purple-medium text-white text-xs font-bold">
                                        {userData?.username?.slice(0, 2)?.toUpperCase() || "TÚ"}
                                    </AvatarFallback>
                                </Avatar>
                                <Input
                                    placeholder="Escriba su comentario..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSendComment();
                                        }
                                    }}
                                    disabled={isCommentPending}
                                    className="bg-black/40 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-snak-pink focus-visible:border-snak-pink rounded-full px-4 h-9 text-sm"
                                />
                            </div>

                            {/* Listado de comentarios */}
                            <div className="flex flex-col gap-3 mt-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-snak-purple-medium scrollbar-track-transparent">
                                {isLoadingComments ? (
                                    <div className="flex justify-center items-center py-6">
                                        <Loader2 className="size-5 text-snak-pink animate-spin" />
                                    </div>
                                ) : comments && comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex flex-col gap-2.5 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.03] transition-colors border border-white/[0.02]">
                                            {/* Comentario principal */}
                                            <div className="flex gap-3 items-start">
                                                <Avatar className="size-8 border border-white/10 shrink-0 mt-0.5">
                                                    {comment.user_avatar ? (
                                                        <AvatarImage src={formatUrl(comment.user_avatar) || undefined} alt={comment.user_username} />
                                                    ) : null}
                                                    <AvatarFallback className="bg-snak-purple-medium text-snak-blue-aqua text-xs font-bold uppercase">
                                                        {comment.user_username?.slice(0, 2) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-white hover:underline cursor-pointer truncate">
                                                            @{comment.user_username}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500">
                                                            {new Date(comment.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-zinc-300 mt-1 break-words leading-relaxed">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Listado de replies si los tiene */}
                                            {comment.replies && comment.replies.length > 0 && (
                                                <div className="ml-11 mt-0.5 flex flex-col gap-2.5 border-l border-white/10 pl-3">
                                                    {comment.replies.map((reply) => (
                                                        <div key={reply.id} className="flex gap-2.5 items-start">
                                                            <Avatar className="size-6 border border-white/10 shrink-0 mt-0.5">
                                                                {reply.user_avatar ? (
                                                                    <AvatarImage src={formatUrl(reply.user_avatar) || undefined} alt={reply.user_username} />
                                                                ) : null}
                                                                <AvatarFallback className="bg-snak-purple-dark text-snak-pink text-[10px] font-bold uppercase">
                                                                    {reply.user_username?.slice(0, 2) || "U"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col min-w-0 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[11px] font-bold text-zinc-300 hover:underline cursor-pointer truncate">
                                                                        @{reply.user_username}
                                                                    </span>
                                                                    <span className="text-[9px] text-zinc-500">
                                                                        {new Date(reply.created_at).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[11px] text-zinc-400 mt-0.5 break-words leading-relaxed">
                                                                    {reply.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Input para responder a este comentario */}
                                            <div className="ml-11 mt-1 flex gap-2 items-center">
                                                <Input
                                                    placeholder={`Responder a @${comment.user_username}...`}
                                                    value={replyTexts[comment.id] || ""}
                                                    onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleSendComment(comment.id);
                                                        }
                                                    }}
                                                    disabled={isCommentPending}
                                                    className="bg-black/20 border-white/5 text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-snak-blue-aqua focus-visible:border-snak-blue-aqua rounded-full px-3 h-7 text-[11px]"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-xs text-zinc-500 py-4 italic">
                                        Sé el primero en comentar.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
