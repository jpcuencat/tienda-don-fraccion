import { useCallback } from "react";
import { useDrag } from "react-dnd";

interface PizzaPieceProps {
  fraction: string;
  id: string;
  onTap?: () => void;
}

const FracLabel = ({ fraction }: { fraction: string }) => {
  const [n, d] = fraction.split("/");
  if (!d) return <span className="text-lg font-bold">{n}</span>;
  return (
    <span className="inline-flex flex-col items-center leading-none">
      <span className="border-b-2 border-black px-1 font-bold text-sm leading-none">{n}</span>
      <span className="px-1 font-bold text-sm leading-none">{d}</span>
    </span>
  );
};

export const PizzaPiece: React.FC<PizzaPieceProps> = ({ fraction, id, onTap }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "pizza",
    item: { id, fraction },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const dragRef = useCallback(
    (node: HTMLDivElement | null) => { drag(node); },
    [drag]
  );

  return (
    <div
      ref={dragRef}
      onClick={onTap}
      className={`w-20 h-20 rounded-full bg-yellow-400 text-black flex items-center justify-center
        border-4 border-orange-500 shadow-md select-none transition-all duration-150
        cursor-grab active:cursor-grabbing hover:scale-110 hover:shadow-lg
        ${isDragging ? "opacity-40 scale-95" : "opacity-100"}`}
    >
      <FracLabel fraction={fraction} />
    </div>
  );
};
