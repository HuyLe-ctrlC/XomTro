export default function selectedNavigation({ children, onClick, isSelected }) {
  const defaultClasses = "p-3 rounded-lg text-white hover:border-white ";
  const selectedClasses = "border-b-4 border-white border-2";

  return (
    <div
      className={`${defaultClasses} ${isSelected ? selectedClasses : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
