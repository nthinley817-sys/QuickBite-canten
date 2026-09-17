import { useEffect, useRef } from "react";

// Re-creates the Colorlib "ftco-animate" scroll transition: elements start
// hidden and fade-slide into place the moment they scroll into view, each
// one staggered slightly after the last. Attach the returned ref to a
// container, then mark any child that should animate with data-reveal
// (optionally data-reveal="fadeInLeft" | "fadeInRight" | "fadeIn").
export default function useReveal(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll("[data-reveal]"));
    if (els.length === 0) return;

    let i = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = (i++ % 12) * 60; // same stagger feel as the template's 50ms waypoint batches
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
