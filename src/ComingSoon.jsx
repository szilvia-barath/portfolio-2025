// src/ComingSoon.jsx
import React, { useEffect, useState } from "react";

/**
 * ComingSoon — full-screen teaser page with video background and contact info.
 * To use temporarily: in your App, render <ComingSoon /> instead of <Root />.
 */
export default function ComingSoon() {
  return (
    <div className="relative w-screen min-h-screen text-neutral-100 selection:bg-amber-300/40 selection:text-neutral-900">
      <NoiseDefs />
      <GrainOverlay />
      <Scanlines />

      <HeroVideoBackground
        sources={[
          { src: "/liquid.webm", type: "video/webm" },
          { src: "/liquid.mp4", type: "video/mp4" },
        ]}
        poster="/hero-poster.jpg"
      />

      <main className="relative z-10 flex flex-col items-center justify-center max-w-6xl min-h-screen px-6 mx-auto text-center">
        <h1 className="uppercase font-black tracking-tight leading-none [filter:url(#distort)] drop-shadow-[0_6px_0_rgba(0,0,0,0.35)] text-[15vw] md:text-[10vw]">
          Coming&nbsp;Soon
        </h1>
        <p className="mt-5 max-w-2xl text-sm md:text-base text-neutral-50 [text-wrap:balance]">
          A grunge-flavored portfolio is brewing — experimental type, rough textures, and chaotic harmony.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          <a
            href="mailto:you@example.com"
            className="uppercase text-[11px] tracking-[0.3em] px-4 py-2 border border-neutral-300/70 hover:border-neutral-100 bg-neutral-950/30 hover:bg-neutral-950/50 backdrop-blur transition rounded"
          >
            you@example.com
          </a>
          <a
            href="https://github.com/yourhandle"
            target="_blank"
            rel="noreferrer"
            className="uppercase text-[11px] tracking-[0.3em] px-4 py-2 border border-neutral-300/70 hover:border-neutral-100 bg-neutral-950/20 transition rounded"
          >
            GitHub
          </a>
          <a
            href="https://x.com/yourhandle"
            target="_blank"
            rel="noreferrer"
            className="uppercase text-[11px] tracking-[0.3em] px-4 py-2 border border-neutral-300/70 hover:border-neutral-100 bg-neutral-950/20 transition rounded"
          >
            X / Twitter
          </a>
        </div>

        <div className="mt-10 text-[10px] uppercase tracking-[0.35em] text-neutral-300/90">
          Launching soon — stay tuned.
        </div>
      </main>

      {/* corner badge for vibe */}
      <div className="absolute z-10 pointer-events-none left-4 top-4 md:left-8 md:top-8">
        <div className="px-3 py-1 text-[10px] tracking-[0.3em] border border-neutral-600/80 bg-neutral-900/70 uppercase">
          Teaser
        </div>
      </div>

      {/* Envelope CTA (mailto) */}
      <a
        aria-label="Email"
        href="mailto:you@example.com"
        className="fixed z-10 p-3 transition border rounded-full top-4 right-4 border-neutral-700/70 bg-neutral-900/80 backdrop-blur hover:border-neutral-300"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 6h16v12H4z" />
          <path d="M22 6l-10 7L2 6" />
        </svg>
      </a>
    </div>
  );
}

function HeroVideoBackground({ sources = [], poster }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h = () => setReduceMotion(m.matches);
    h();
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      {reduceMotion ? (
        <img src={poster} alt="" className="object-cover w-full h-full" draggable={false} />
      ) : (
        <video className="object-cover w-full h-full" autoPlay muted loop playsInline preload="auto" poster={poster}>
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
      {/* readability & grit */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-black/15 to-black/35" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(1200px 600px at 20% -10%, rgba(255,255,255,0.18), transparent 60%)" }}
      />
      <div className="absolute inset-0 opacity-[0.06] mix-blend-soft-light pointer-events-none">
        <ProceduralNoiseBackground />
      </div>
    </div>
  );
}

function NoiseDefs() {
  return (
    <svg className="absolute w-0 h-0 -z-50" aria-hidden>
      <filter id="distort">
        <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="2" seed="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="distortSoft">
        <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
      </filter>
    </svg>
  );
}

function ProceduralNoiseBackground() {
  return (
    <svg className="w-full h-full" preserveAspectRatio="none">
      <filter id="f-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0.4" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#f-noise)" fill="#fff" />
    </svg>
  );
}

function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 opacity-[0.08] mix-blend-soft-light" aria-hidden>
      <ProceduralNoiseBackground />
    </div>
  );
}

function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:100%_3px]"
      aria-hidden
    />
  );
}
