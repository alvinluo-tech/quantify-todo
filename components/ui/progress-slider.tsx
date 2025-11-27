'use client';

import { Slider } from './slider';

interface ProgressSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function ProgressSlider({ value, onChange, disabled = false }: ProgressSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
        <span className="text-sm font-semibold">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={100}
        step={5}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}
