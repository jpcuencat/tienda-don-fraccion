import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FractionStaircase } from "../components/Staircase";

export default function StaircasePage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FractionStaircase />
    </DndProvider>
  );
}
