"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Play, Music2, MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

interface VideoItemProps {
  videoUrl: string
  thumbnailUrl: string
  username: string
  description: string
  avatarUrl?: string
  likes: string
  comments: string
  tokens?: string
}

export const VideoItem = ({
  videoUrl,
  thumbnailUrl,
  username,
  description,
  avatarUrl,
}: VideoItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogTrigger asChild>
        <div className="relative h-screen w-full bg-snak-purple-dark snap-start overflow-hidden flex flex-col justify-center items-center cursor-pointer group">
          {/* Thumbnail Background */}
          <div className="absolute inset-0 z-0">
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt={username}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                unoptimized // A veces útil para URLs externas de servidores de desarrollo
              />
            )}
            {/* Overlay darkener */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          </div>

          {/* Play Button Overlay */}
          <div className="z-10 size-20 rounded-full bg-snak-pink/80 backdrop-blur-md flex items-center justify-center border-4 border-white/20 shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="size-10 text-white fill-white ml-1" />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 pb-12 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none">
            {/* Bottom Info Section */}
            <div className="max-w-[85%] space-y-4 pointer-events-auto">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 border-2 border-snak-pink shadow-lg">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-snak-purple-medium text-white">{username[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-white font-bold text-lg drop-shadow-lg tracking-tight">@{username}</h3>
                </div>
                <p className="text-white/90 text-sm line-clamp-2 leading-relaxed font-medium drop-shadow-md mt-2">
                  {description}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full py-1.5 px-3 w-fit border border-white/20">
                <Music2 className="size-4 text-snak-blue-aqua animate-spin-slow" />
                <div className="w-40 overflow-hidden relative">
                  <span className="text-white text-[10px] font-semibold inline-block animate-marquee whitespace-nowrap">
                    Original Sound - {username} • SNAK! Audio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Header */}
          <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center bg-linear-to-b from-black/60 to-transparent pointer-events-auto">
            <div className="flex gap-6 items-center">
              <span className="text-white/60 font-black text-lg tracking-wider uppercase cursor-pointer hover:text-white transition-colors">Following</span>
              <div className="relative">
                <span className="text-white font-black text-lg tracking-wider uppercase cursor-pointer">For You</span>
                <div className="absolute -bottom-1 left-0 w-1/2 h-1 bg-snak-pink rounded-full" />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
              <MoreVertical className="size-6" />
            </Button>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl p-0 bg-black border-none overflow-hidden rounded-2xl shadow-2xl">
        <VisuallyHidden.Root>
          <DialogTitle>Reproduciendo {description}</DialogTitle>
        </VisuallyHidden.Root>
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {isOpen && (
            <video
              src={videoUrl}
              autoPlay
              muted
              controls
              playsInline
              className="w-full h-full object-contain"
              onLoadedData={(e) => {
                // Forzar reproducción al cargar los datos
                (e.target as HTMLVideoElement).play().catch(console.error);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
