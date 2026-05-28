import { useCallback } from "react";
import { useDrop } from "react-dnd";
import Fraction from "fraction.js";
import type { Slice } from "./PizzaSimulator";

interface PizzaDropZoneProps {
  onAddPiece: (fraction: string) => void;
  onRemoveSlice: (sliceId: string, value: Fraction) => void;
  slices: Slice[];
  total: Fraction;
  target: Fraction;
  maxPieces: number;
  minPieces: number;
}

export const PizzaDropZone: React.FC<PizzaDropZoneProps> = ({
  onAddPiece,
  onRemoveSlice,
  slices,
  total,
  target,
  maxPieces,
  minPieces,
}) => {
  const [, drop] = useDrop(() => ({
    accept: "pizza",
    drop: (item: { id: string; fraction: string }) => {
      onAddPiece(item.fraction);
    },
  }));

  // Callback ref para compatibilidad con React 19
  const dropRef = useCallback(
    (node: HTMLDivElement | null) => { drop(node); },
    [drop]
  );

  const isCorrect = total.equals(target) && slices.length >= minPieces && slices.length <= maxPieces;
  const isOver    = total.compare(target) > 0;

  let currentAngle = 0;

  return (
    <div className="relative w-64 h-64 mt-4" ref={dropRef}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        {/* Fondo */}
        <circle cx="100" cy="100" r="100" fill="#1f2937" />

        {/* Anillo guía del objetivo */}
        <circle
          cx="100" cy="100" r="96"
          fill="none"
          stroke="#ffffff20"
          strokeWidth="8"
          strokeDasharray={`${target.valueOf() * 2 * Math.PI * 96} ${2 * Math.PI * 96}`}
          strokeDashoffset={`${2 * Math.PI * 96 * 0.25}`}
          transform="rotate(-90 100 100)"
        />

        {/* Sectores de porciones */}
        {slices.map((slice) => {
          const startAngle = currentAngle;
          const angle      = 360 * slice.value.valueOf();
          const endAngle   = startAngle + angle;
          currentAngle    += angle;

          const toRad = (deg: number) => (Math.PI * deg) / 180;
          const x1 = 100 + 100 * Math.cos(toRad(startAngle));
          const y1 = 100 + 100 * Math.sin(toRad(startAngle));
          const x2 = 100 + 100 * Math.cos(toRad(endAngle));
          const y2 = 100 + 100 * Math.sin(toRad(endAngle));

          const d = `M 100 100 L ${x1} ${y1} A 100 100 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;

          return (
            <path
              key={slice.id}
              d={d}
              fill={slice.color}
              stroke="#111"
              strokeWidth={1.5}
              className="cursor-pointer transition-opacity duration-150 hover:opacity-75"
              onClick={() => onRemoveSlice(slice.id, slice.value)}
            />
          );
        })}

        <circle cx="100" cy="100" r="100" fill="none" stroke="#ffffff25" strokeWidth="2" />
      </svg>

      {/* Panel central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`text-white text-center px-4 py-3 rounded-xl shadow-lg w-[158px] pointer-events-auto transition-colors duration-300 ${
            isCorrect             ? "bg-green-600/95 ring-2 ring-green-300" :
            isOver                ? "bg-red-600/90"  :
            slices.length > maxPieces ? "bg-red-600/90" :
            "bg-black/60"
          }`}
        >
          <p className="text-xs text-white/60 mb-0.5">Total</p>
          <p className="text-2xl font-mono font-bold">
            {total.valueOf() === 0
              ? "0"
              : `${String(total.n)}/${String(total.d)}`}
          </p>

          {isCorrect && (
            <div className="mt-1"><p className="text-lg">🎉</p><p className="text-xs font-bold">¡Correcto!</p></div>
          )}
          {total.equals(target) && slices.length < minPieces && (
            <div className="mt-1"><p className="text-lg">⚠️</p><p className="text-xs">Mín {minPieces} piezas</p></div>
          )}
          {!total.equals(target) && slices.length > maxPieces && (
            <div className="mt-1"><p className="text-lg">⚠️</p><p className="text-xs">Máx {maxPieces} piezas</p></div>
          )}
          {isOver && slices.length <= maxPieces && (
            <div className="mt-1"><p className="text-lg">❌</p><p className="text-xs">Te pasaste</p></div>
          )}
          {!isCorrect && !isOver && !total.equals(target) && slices.length > 0 && (
            <div className="mt-1"><p className="text-lg">⏳</p><p className="text-xs">Sigue sumando</p></div>
          )}
          {slices.length === 0 && (
            <p className="text-xs text-white/40 mt-1">Arrastra aquí</p>
          )}
        </div>
      </div>

      {/* Indicador de piezas usadas */}
      <div className="absolute -bottom-7 left-0 right-0 flex justify-center gap-1.5">
        {Array.from({ length: maxPieces }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full border-2 transition-all ${
              i < slices.length
                ? i < minPieces
                  ? "bg-yellow-400 border-yellow-300"
                  : "bg-green-400 border-green-300"
                : "bg-white/15 border-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
