import { sitePath } from "./site";
import { screenshotVersions } from "./screenshot-versions";

type Props = { src: string; alt: string; className: string; eager?: boolean };

export default function IPhoneMockup({ src, alt, className, eager = false }: Props) {
  return (
    <div className={`${className} iphone-mockup`}>
      <span className="iphone-button iphone-button--volume" aria-hidden="true" />
      <span className="iphone-button iphone-button--power" aria-hidden="true" />
      <div className="iphone-display">
        <div className="iphone-status" aria-hidden="true">
          <span className="iphone-time">9:41</span>
          <span className="iphone-island"><i /></span>
          <span className="iphone-indicators">
            <svg viewBox="0 0 18 12" className="iphone-signal"><rect x="0" y="8" width="3" height="4" rx=".7" /><rect x="5" y="5.5" width="3" height="6.5" rx=".7" /><rect x="10" y="3" width="3" height="9" rx=".7" /><rect x="15" width="3" height="12" rx=".7" /></svg>
            <svg viewBox="0 0 18 14" className="iphone-wifi"><path d="M1 4.3a12 12 0 0 1 16 0M4 7.5a7.5 7.5 0 0 1 10 0M7 10.5a3 3 0 0 1 4 0" fill="none" stroke="currentColor" strokeWidth="2.2" /><circle cx="9" cy="13" r="1" /></svg>
            <span className="iphone-battery"><span /><b>100</b></span>
          </span>
        </div>
        <img src={`${sitePath(src)}?v=${screenshotVersions[src]}`} alt={alt} loading={eager ? "eager" : "lazy"} width={393} height={758} />
        <div className="iphone-home" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}
