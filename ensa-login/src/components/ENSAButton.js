export default function ENSAButton({ text, onClick }) {
  return (
    <button className="ensa-button" onClick={onClick}>
      {text}
    </button>
  );
}
