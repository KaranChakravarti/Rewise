'use client';

import {useState, useRef} from 'react';
import {Mic, MicOff, Loader2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';
import {speechToText} from '@/ai/flows/speech-to-text';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  isProcessing: boolean;
  className?: string;
}

export function VoiceInputButton({onTranscript, isProcessing, className}: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = handleStopRecording;
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // You might want to show a toast or alert to the user here
    }
  };

  const handleStopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Get the audio track to stop it.
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsTranscribing(true);

      const audioBlob = new Blob(audioChunksRef.current, {type: 'audio/webm'});
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        try {
          const result = await speechToText({audioDataUri: base64Audio});
          onTranscript(result.text);
        } catch (error) {
          console.error('Error transcribing audio:', error);
        } finally {
          setIsTranscribing(false);
        }
      };
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };
  
  const isLoading = isTranscribing || isProcessing;

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      onClick={toggleRecording}
      disabled={isLoading}
      className={cn('absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8', className)}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-5 w-5 text-destructive" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
}
