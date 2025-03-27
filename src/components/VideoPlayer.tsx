
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title?: string;
  onProgress?: (progress: number) => void;
  posterUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  title,
  onProgress,
  posterUrl
}) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle auto-hide of controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      
      if (playing) {
        controlsTimerRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [playing]);

  // Handle playback
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // Handle volume
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (videoRef.current) {
      const volumeValue = newVolume[0];
      videoRef.current.volume = volumeValue;
      setVolume(volumeValue);
      setMuted(volumeValue === 0);
    }
  };

  // Handle time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (onProgress) {
        onProgress(videoRef.current.currentTime / duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (newTime: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Fast forward and rewind
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  return (
    <div 
      className="video-container group relative overflow-hidden rounded-xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        className="video-player w-full h-full object-contain bg-black"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setPlaying(false)}
      />
      
      {/* Play button overlay (visible when paused) */}
      {!playing && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="p-6 rounded-full bg-white bg-opacity-20 backdrop-blur-sm">
            <Play size={32} className="text-white fill-white" />
          </div>
        </div>
      )}
      
      {/* Video controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {title && (
          <div className="mb-2 text-white font-medium text-sm truncate">{title}</div>
        )}
        
        <div className="relative mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 1}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-8 w-8"
              onClick={togglePlay}
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-8 w-8"
              onClick={skipBackward}
            >
              <SkipBack size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-8 w-8"
              onClick={skipForward}
            >
              <SkipForward size={18} />
            </Button>
            
            <span className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 w-24 mr-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-8 w-8"
                onClick={toggleMute}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              <Slider
                value={[muted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-8 w-8"
              onClick={handleFullscreen}
            >
              <Maximize size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
