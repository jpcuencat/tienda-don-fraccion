import { SlideDeck } from "../components/Presentation/SlideDeck";

export default function SlideDeckPage() {
  // Habilitar el nuevo sistema de base de datos para presentaciones
  return <SlideDeck enableDatabase={false} />;
}
