import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ComplexityInputsProps {
  timeComplexity: string;
  spaceComplexity: string;
  onTimeComplexityChange: (value: string) => void;
  onSpaceComplexityChange: (value: string) => void;
}

export function ComplexityInputs({
  timeComplexity,
  spaceComplexity,
  onTimeComplexityChange,
  onSpaceComplexityChange,
}: ComplexityInputsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="timeComplexity">Time Complexity</Label>
        <Input
          id="timeComplexity"
          value={timeComplexity}
          onChange={(e) => onTimeComplexityChange(e.target.value)}
          placeholder="e.g., O(n)"
        />
      </div>
      <div>
        <Label htmlFor="spaceComplexity">Space Complexity</Label>
        <Input
          id="spaceComplexity"
          value={spaceComplexity}
          onChange={(e) => onSpaceComplexityChange(e.target.value)}
          placeholder="e.g., O(1)"
        />
      </div>
    </div>
  );
}