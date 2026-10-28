import type { CSSProperties } from "react";
import { sitePath } from "./site";
import { screenshotVersions } from "./screenshot-versions";

type Props = { src: string; alt: string; className?: string; eager?: boolean };

// The captures stop under the status bar and above the home indicator (393 × 758 of a 393 × 852 screen).
// Both bands are painted with the capture's own first and last rows, so every screen reads edge to edge.
export default function IPhoneMockup({ src, alt, className, eager = false }: Props) {
  const url = `${sitePath(src)}?v=${screenshotVersions[src]}`;
  return (
    <div className={`iphone${className ? ` ${className}` : ""}`} style={{ "--shot": `url("${url}")` } as CSSProperties}>
      <span className="iphone__button iphone__button--action" aria-hidden="true" />
      <span className="iphone__button iphone__button--volume" aria-hidden="true" />
      <span className="iphone__button iphone__button--power" aria-hidden="true" />
      <div className="iphone__body">
        <div className="iphone__screen">
          <img src={url} alt={alt} loading={eager ? "eager" : "lazy"} width={393} height={758} />
          <div className="iphone__status" aria-hidden="true">
            <span>9:41</span>
            <i className="iphone__island" />
            <span className="iphone__indicators">
              <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".7" /><rect x="5" y="5.5" width="3" height="6.5" rx=".7" /><rect x="10" y="3" width="3" height="9" rx=".7" /><rect x="15" width="3" height="12" rx=".7" /></svg>
              <svg viewBox="0 0 18 13"><path d="M1 4.3a12 12 0 0 1 16 0M4 7.5a7.5 7.5 0 0 1 10 0M7 10.5a3 3 0 0 1 4 0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
              <b />
            </span>
          </div>
          <i className="iphone__home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
