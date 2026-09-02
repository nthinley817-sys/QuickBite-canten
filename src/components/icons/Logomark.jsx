export default function Logomark({ size = 38 }) {
  return (
    <img
      src="/logoshort.png"
      alt="QuickBite"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", borderRadius: 12 }}
    />
  );
}
