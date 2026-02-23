// components/status-toggle.tsx
"use client";

import { useState } from "react";
import { Switch } from "../ui/switch";

type SwitchToggleProps = {
  active: boolean;
  onChange?: (val: boolean, loadingCallback: (state: boolean) => void) => void;
  disabled?: boolean;
};

export function SwitchToggle({ active, onChange, disabled }: SwitchToggleProps) {
  const [loading, setLoading] = useState(false);
  const onClick = (val: boolean) => {
    onChange?.(val, setLoading);
  };
  return (
    <Switch
      checked={active}
      disabled={loading}
      onCheckedChange={(val) => {
        onClick(val);
      }}
    />
  );
}
