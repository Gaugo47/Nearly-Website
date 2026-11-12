"use client";

import { useEffect, useRef, useState } from "react";

type Pop = { src: string; alt: string; className: string; width: number; height: number };
export type TourStep = {
  key: string;
  label: string;
  title: string;
  accent: string;
  text: string;
  points: string[];
  screen: string;
  screenAlt: string;
  pops: Pop[];
};

function Phone({ src, alt, lazy }: { src: string; alt: string; lazy?: boolean }) {
  return (
    <div className="tour-phone">
      <div className="tour-phone__screen">
        <div className="tour-phone__status" aria-hidden="true">
          <span>9:41</span>
          <i className="tour-phone__island" />
          <span className="tour-phone__icons"><b /><b /><b /><b /><em /></span>
        </div>
        <img src={src} alt={alt} width={393} height={758} loading={lazy ? "lazy" : undefined} decoding="async" />
        <div className="tour-phone__home" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}

function Visual({ step, active, lazy }: { step: TourStep; active: boolean; lazy?: boolean }) {
  return (
    <div className={`tour-visual tour-visual--${step.key}${active ? " is-active" : ""}`} aria-hidden={!active}>
      <Phone src={step.screen} alt={step.screenAlt} lazy={lazy} />
      {step.pops.map(pop => (
        <img key={pop.src} className={`tour-pop ${pop.className}`} src={pop.src} alt={pop.alt} width={pop.width} height={pop.height} loading={lazy ? "lazy" : undefined} decoding="async" />
      ))}
    </div>
  );
}

export default function FeatureTour({ steps }: { steps: TourStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
    }, { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach(node => node && observer.observe(node));
    return () => observer.disconnect();
  }, [steps.length]);

  if (!steps.length) return null;

  return (
    <div className="tour" data-step={(steps[active] ?? steps[0]).key}>
      <ol className="tour__steps">
        {steps.map((step, index) => (
          <li key={step.key} className={`tour-step${index === active ? " is-active" : ""}`} data-index={index} ref={node => { refs.current[index] = node; }}>
            <span className="tour-step__label"><b>{String(index + 1).padStart(2, "0")}</b>{step.label}</span>
            <h3>{step.title} <span className="store-pill">{step.accent}</span></h3>
            <p>{step.text}</p>
            <ul className="tour-step__points">{step.points.map(point => <li key={point}>{point}</li>)}</ul>
            <div className="tour-step__visual"><Visual step={step} active lazy /></div>
          </li>
        ))}
      </ol>
      <div className="tour__stage" aria-hidden="true">
        <div className="tour__glow" aria-hidden="true" />
        {steps.map((step, index) => <Visual key={step.key} step={step} active={index === active} lazy={index > 0} />)}
        <div className="tour__dots" aria-hidden="true">{steps.map((step, index) => <span key={step.key} className={index === active ? "is-active" : undefined} />)}</div>
      </div>
    </div>
  );
}
