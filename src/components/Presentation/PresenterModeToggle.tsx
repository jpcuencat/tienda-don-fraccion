interface PresenterModeToggleProps {
  isPresenter: boolean;
  onToggle: () => void;
}

export const PresenterModeToggle: React.FC<PresenterModeToggleProps> = ({ isPresenter, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="absolute top-6 right-6 bg-white/20 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/30"
    >
      Modo: {isPresenter ? "Docente 👨‍🏫" : "Estudiante 🎓"}
    </button>
  );
};
