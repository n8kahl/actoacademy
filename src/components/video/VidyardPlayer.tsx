'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import clsx from 'clsx';

interface VidyardPlayerProps {
  videoId: string;
  title?: string;
  onProgress?: (percent: number) => void;
  onComplete?: () => void;
  className?: string;
}

export default function VidyardPlayer({
  videoId,
  title,
  onProgress,
  onComplete,
  className,
}: VidyardPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Load Vidyard embed script
    const script = document.createElement('script');
    script.src = 'https://play.vidyard.com/embed/v4.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://play.vidyard.com/embed/v4.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && window.VidyardV4) {
      // Initialize player with event handlers
      window.VidyardV4.api.getPlayersByUUID(videoId).forEach((player: any) => {
        player.on('timeupdate', (event: any) => {
          const percent = Math.round((event.currentTime / event.duration) * 100);
          setProgress(percent);
          onProgress?.(percent);
        });

        player.on('play', () => setIsPlaying(true));
        player.on('pause', () => setIsPlaying(false));
        player.on('ended', () => {
          setIsPlaying(false);
          onComplete?.();
        });
      });
    }
  }, [isLoaded, videoId, onProgress, onComplete]);

  return (
    <div className={clsx('relative rounded-2xl overflow-hidden bg-acto-black', className)}>
      {/* Video Container */}
      <div ref={containerRef} className="aspect-video">
        <img
          style={{ width: '100%', margin: 'auto', display: 'block' }}
          className="vidyard-player-embed"
          src={`https://play.vidyard.com/${videoId}.jpg`}
          data-uuid={videoId}
          data-v="4"
          data-type="inline"
          alt={title || 'Video'}
        />
      </div>

      {/* Custom Controls Overlay (optional - Vidyard has its own) */}
      {title && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <h3 className="text-white font-semibold text-sm">{title}</h3>
        </div>
      )}

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-acto-teal transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Placeholder component for when no video ID is provided
export function VideoPlaceholder({ title }: { title?: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-acto-dark-blue to-acto-teal aspect-video flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
          <Play className="w-8 h-8 text-white fill-white" />
        </div>
        <p className="font-semibold">{title || 'Video Coming Soon'}</p>
        <p className="text-sm text-white/70 mt-1">This content is being prepared</p>
      </div>
    </div>
  );
}

// Type declaration for Vidyard
declare global {
  interface Window {
    VidyardV4?: {
      api: {
        getPlayersByUUID: (uuid: string) => any[];
        renderPlayer: (options: any) => void;
      };
    };
  }
}
