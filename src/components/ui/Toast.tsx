import { useState } from "react";
import { Button } from "./Button";

interface ToastProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
}

export function Toast({ message, action, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-fg text-bg border-3 border-fg p-4 shadow-brutal-lg z-50 md:bottom-6 md:left-auto md:right-6 md:max-w-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="font-bold">{message}</p>
        <div className="flex gap-2">
          {action && (
            <Button
              size="sm"
              variant="secondary"
              onClick={action.onClick}
              className="text-xs"
            >
              {action.label}
            </Button>
          )}
          <button
            onClick={handleClose}
            className="text-lg font-bold hover:opacity-70"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
