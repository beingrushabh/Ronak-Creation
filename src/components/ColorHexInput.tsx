"use client";

import { useState } from 'react';

interface ColorHexInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  label?: string;
}

/**
 * Allows adding/removing multiple HEX colour values. Validates input on add.
 */
export default function ColorHexInput({ values, onChange, label }: ColorHexInputProps) {
  const [current, setCurrent] = useState('');

  const addColour = () => {
    const hexRegex = /^#([0-9A-Fa-f]{6})$/;
    if (hexRegex.test(current) && !values.includes(current)) {
      onChange([...values, current]);
      setCurrent('');
    }
  };

  const removeColour = (hex: string) => {
    onChange(values.filter((c) => c !== hex));
  };

  return (
    <div className="space-y-2">
      {label && <label className="font-medium text-sm block">{label}</label>}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="#RRGGBB"
          className="border rounded p-2 text-sm flex-1"
        />
        <button type="button" onClick={addColour} className="bg-primary text-white px-3 py-1 rounded text-sm">
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((hex) => (
          <div key={hex} className="flex items-center space-x-1 border rounded-full px-2 py-1 text-sm">
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: hex }} />
            <span>{hex}</span>
            <button
              type="button"
              onClick={() => removeColour(hex)}
              className="text-red-600 hover:text-red-800"
              aria-label={`Remove ${hex}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}