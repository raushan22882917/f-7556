import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const RecordingControls = ({
  isRecording,
  onStartRecording,
  onStopRecording,
}: RecordingControlsProps) => {
  return (
    <div className="flex justify-center space-x-4 my-4">
      {!isRecording ? (
        <Button
          onClick={onStartRecording}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Mic className="w-4 h-4 mr-2" />
          Start Recording
        </Button>
      ) : (
        <Button
          onClick={onStopRecording}
          variant="destructive"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop Recording
        </Button>
      )}
    </div>
  );
};