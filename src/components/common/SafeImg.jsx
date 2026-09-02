import { useState } from "react";
import { FALLBACK } from "../../data/images.js";

// Displays a graceful placeholder instead of a broken image icon if the
// hotlinked source fails to load.
export default function SafeImg({ src, alt, ...rest }) {
  const [s, setS] = useState(src);
  return <img src={s} alt={alt || ""} loading="lazy" onError={() => setS(FALLBACK)} {...rest} />;
}
