import { Link } from "react-router-dom";

export default function SelectedItem({
  children,
  onClick,
  isSelected
}) {
  const defaultClasses = `border-2 hover:border-green-600 p-3 rounded-lg`;
  const selectedClasses = `border-green-600 border-b-4`;

  return (
    <div
      className={`${defaultClasses} ${isSelected ? selectedClasses : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
