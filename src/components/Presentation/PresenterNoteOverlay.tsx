interface NoteProps {
  note: string;
  visible: boolean;
}

export const PresenterNoteOverlay: React.FC<NoteProps> = ({ note, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute bottom-20 right-6 w-80 bg-black/70 text-white p-4 rounded-lg shadow-lg text-sm">
      <strong>📝 Nota del docente:</strong>
      <p className="mt-2">{note}</p>
    </div>
  );
};
