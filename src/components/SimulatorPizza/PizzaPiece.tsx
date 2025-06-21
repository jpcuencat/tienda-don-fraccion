import { useDrag } from "react-dnd";

interface PizzaPieceProps {
  fraction: string; // e.g., "1/4"
  id: string;
}

export const PizzaPiece: React.FC<PizzaPieceProps> = ({ fraction, id }) => {
  const [, drag] = useDrag(() => ({
    type: "pizza",
    item: { id, fraction },
  }));

  return (
    <div
      ref={drag}
      className="w-24 h-24 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center border-4 border-orange-500 shadow-md cursor-pointer"
    >
      {fraction}
    </div>
  );
};
