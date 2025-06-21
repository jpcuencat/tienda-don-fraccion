import { useDrag } from "react-dnd";
import { Fraction } from "fraction.js";

interface Props {
  id: string;
  value: Fraction;
}

export const DraggableFraction = ({ id, value }: Props) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "FRACTION",
    item: { id, value },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className={`px-4 py-2 bg-white/10 rounded text-white shadow text-lg text-center w-24 ${
        isDragging ? "opacity-30" : "opacity-100"
      }`}
    >
      {value.toFraction(true)}
    </div>
  );
};
