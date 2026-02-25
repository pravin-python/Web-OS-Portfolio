import React, { useEffect, useState, useRef } from "react";

/**
 * In-memory cache so each SVG is fetched only once.
 */
const svgCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

function fetchSvg(path: string): Promise<string> {
  if (svgCache.has(path)) {
    return Promise.resolve(svgCache.get(path)!);
  }
  if (inflight.has(path)) {
    return inflight.get(path)!;
  }
  const promise = fetch(path)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load SVG: ${path}`);
      return r.text();
    })
    .then((text) => {
      svgCache.set(path, text);
      inflight.delete(path);
      return text;
    })
    .catch((err) => {
      inflight.delete(path);
      console.warn(err);
      return "";
    });
  inflight.set(path, promise);
  return promise;
}

interface IconProps {
  /** Path relative to /svg/, e.g. "apps/terminal" or "social/linkedin" */
  name: string;
  /** Icon size in px (square). Default 24. */
  size?: number;
  /** Extra CSS classes */
  className?: string;
}

/**
 * Renders an inline SVG icon fetched from /svg/{name}.svg.
 *
 * Because the SVGs use `stroke="currentColor"`, the icon color
 * automatically inherits from the parent CSS `color` and adapts
 * to dark / light themes without any extra work.
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = "",
}) => {
  const [svg, setSvg] = useState(() => svgCache.get(`/svg/${name}.svg`) ?? "");
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;
    const path = `/svg/${name}.svg`;

    // If already cached, set immediately
    if (svgCache.has(path)) {
      setSvg(svgCache.get(path)!);
      return;
    }

    fetchSvg(path).then((text) => {
      if (!cancelled) setSvg(text);
    });

    return () => {
      cancelled = true;
    };
  }, [name]);

  return (
    <span
      ref={containerRef}
      role="img"
      aria-hidden="true"
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
