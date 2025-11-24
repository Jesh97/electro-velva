export default function ENSAButton({ text, onClick, className = "", disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        "w-full py-3 rounded-xl bg-blue-900 text-white font-semibold text-lg shadow-md " +
        "hover:bg-blue-700 active:scale-95 transition-all duration-200 " +
        (disabled ? "opacity-50 cursor-not-allowed" : "") +
        " " + className
      }
    >
      {text}
    </button>
  );
}
