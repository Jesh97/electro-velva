export default function ENSAButton({ text, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full py-3 rounded-xl bg-blue-900 text-white font-semibold text-lg shadow-md " +
        "hover:bg-blue-700 active:scale-95 transition-all duration-200 " +
        className
      }
    >
      {text}
    </button>
  );
}
