import { useDrop } from "react-dnd";
import Fraction from "fraction.js";

interface Slice {
  id: string;
  value: Fraction;
  color: string;
}

interface PizzaDropZoneProps {
  onDropFraction: (fraction: string) => void;
  slices: Slice[];
  setSlices: React.Dispatch<React.SetStateAction<Slice[]>>;
  total: Fraction;
  setTotal: React.Dispatch<React.SetStateAction<Fraction>>;
  colorIndex: number;
  setColorIndex: React.Dispatch<React.SetStateAction<number>>;
  target: Fraction;
  maxPieces: number;
}

const COLORS = ["#facc15", "#f97316", "#4ade80", "#60a5fa", "#f472b6", "#c084fc"];

export const PizzaDropZone: React.FC<PizzaDropZoneProps> = ({
  onDropFraction,
  slices,
  setSlices,
  total,
  setTotal,
  colorIndex,
  setColorIndex,
  target,
  maxPieces,
}) => {
  const [, drop] = useDrop(() => ({
    accept: "pizza",
    drop: (item: { id: string; fraction: string }) => {
      const f = new Fraction(item.fraction);
      const newSlice: Slice = {
        id: item.id + "_" + Date.now(),
        value: f,
        color: COLORS[colorIndex % COLORS.length],
      };
      setSlices((prev) => [...prev, newSlice]);
      setTotal((prev) => prev.add(f));
      setColorIndex((prev) => prev + 1);
      onDropFraction(item.fraction);
    },
  }));

  const getAngle = (f: Fraction) => 360 * f.valueOf();
  let currentAngle = 0;

  return (
    <div className="relative w-64 h-64" ref={drop}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="100" fill="#1f2937" />
        {[...slices].map((slice) => {
          const startAngle = currentAngle;
          const angle = getAngle(slice.value);
          const endAngle = startAngle + angle;
          currentAngle += angle;

          const largeArc = angle > 180 ? 1 : 0;
          const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
          const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

          const d = `
            M 100 100
            L ${x1} ${y1}
            A 100 100 0 ${largeArc} 1 ${x2} ${y2}
            Z
          `;

          const handleClickSlice = () => {
            setSlices((prev) => prev.filter((s) => s.id !== slice.id));
            setTotal((prev) => prev.sub(slice.value));
          };

          return (
            <path
              key={slice.id}
              d={d}
              fill={slice.color}
              stroke="#111"
              strokeWidth={1}
              className="cursor-pointer transition duration-200 hover:opacity-80"
              onClick={handleClickSlice}
            />
          );
        })}
      </svg>

      {/* Feedback central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`text-white text-center px-5 py-4 rounded-xl shadow-lg w-[180px] pointer-events-auto ${
            total.equals(target) && slices.length <= maxPieces
              ? "bg-green-600/90"
              : slices.length > maxPieces
              ? "bg-red-600/90"
              : "bg-yellow-500/90"
          }`}
        >
          <p className="text-lg font-bold mb-1">Total:</p>
          <p className="text-2xl font-mono">{total.n}/{total.d}</p>

          {total.equals(target) && slices.length <= maxPieces && (
            <div className="mt-2">
              <p className="text-xl">🎉</p>
              <p className="text-sm font-semibold">¡Correcto!</p>
              <p className="text-xs">Reto completado</p>
            </div>
          )}

          {!total.equals(target) && slices.length > maxPieces && (
            <div className="mt-2">
              <p className="text-xl">⚠️</p>
              <p className="text-sm font-semibold">Demasiadas porciones</p>
              <p className="text-xs">Máximo permitido: {maxPieces}</p>
            </div>
          )}

          {total.compare(target) === -1 && slices.length <= maxPieces && (
            <div className="mt-2">
              <p className="text-xl">⏳</p>
              <p className="text-sm font-semibold leading-tight">Agrega más porciones</p>
            </div>
          )}

          {total.compare(target) === 1 && (
            <div className="mt-2">
              <p className="text-xl">❌</p>
              <p className="text-sm font-semibold">Te pasaste</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
