'use client';

import {useState, useCallback, useRef, useEffect} from 'react';
import {textToSpeech} from '@/ai/flows/text-to-speech';

export function useAudioPlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback(async (text: string) => {
    if (isPlaying) {
      // Optional: stop current playback before starting new one
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    }
    
    setIsPlaying(true);
    setPlayingText(text);
    setError(null);

    try {
      const result = await textToSpeech({text});
      if (result.audioDataUri) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = result.audioDataUri;
        audioRef.current.play();

        audioRef.current.onended = () => {
          setIsPlaying(false);
          setPlayingText(null);
        };
        audioRef.current.onerror = () => {
            setError('Error playing audio.');
            setIsPlaying(false);
            setPlayingText(null);
        }
      } else {
        throw new Error('No audio data received.');
      }
    } catch (e) {
      console.error('TTS Error:', e);
      setError('Failed to generate audio.');
      setIsPlaying(false);
      setPlayingText(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {playAudio, isPlaying, playingText, error};
}
