import { useDrop } from "react-dnd";
import { Fraction } from "fraction.js";

interface DropZoneProps {
  onDrop: (fraction: { id: string; value: Fraction }) => void;
  children: React.ReactNode;
}

export const FractionDropZone = ({ onDrop, children }: DropZoneProps) => {
  const [, dropRef] = useDrop(() => ({
    accept: "FRACTION",
    drop: (item: { id: string; value: Fraction }) => {
      onDrop(item);
    },
  }));

  return (
    <div ref={dropRef} className="min-h-[300px] p-4 border-2 border-dashed border-white/50 rounded-lg">
      {children}
    </div>
  );
};
