import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface NorvaHeroProps {
  onExploreClick?: () => void;
  onRequestClick?: () => void;
}

export const NorvaHero: React.FC<NorvaHeroProps> = ({
  onExploreClick,
  onRequestClick,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const scrollCueLineRef = useRef<HTMLSpanElement>(null);

  const [loaderVisible, setLoaderVisible] = useState<boolean>(true);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    const heroCopy = heroCopyRef.current;
    const scrollCue = scrollCueRef.current;
    const scrollCueLine = scrollCueLineRef.current;

    if (!track || !video) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Loader dismissal logic
    let loaderDismissed = false;
    const dismiss = () => {
      if (loaderDismissed) return;
      loaderDismissed = true;
      setLoaderVisible(false);
    };

    const maxTimer = setTimeout(dismiss, 2800);
    const onReady = () => {
      setTimeout(() => {
        clearTimeout(maxTimer);
        dismiss();
      }, 200);
    };

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener('loadeddata', onReady, { once: true });
      video.addEventListener('canplay', onReady, { once: true });
    }

    // Ensure smooth native ambient loop without video seeking stutter
    video.play().catch(() => {});

    let targetP = 0;
    let smoothP = 0;
    let animId: number;

    const easeInOutQuad = (t: number) => {
      const clamped = Math.max(0, Math.min(1, t));
      return clamped < 0.5 ? 2 * clamped * clamped : 1 - Math.pow(-2 * clamped + 2, 2) / 2;
    };

    const getProgress = () => {
      const rect = track.getBoundingClientRect();
      const maxScroll = track.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return 0;
      const scrolled = -rect.top;
      return Math.max(0, Math.min(1, scrolled / maxScroll));
    };

    const updateVisuals = (p: number) => {
      // 1. Rock-solid headline transform in stable pixels with zero 3D shake
      if (heroCopy) {
        const h = easeInOutQuad(p / 0.45);
        const ty = (-56 * h).toFixed(1);
        const s = (1 - 0.05 * h).toFixed(3);
        heroCopy.style.transform = `translate3d(0, ${ty}px, 0) scale(${s})`;

        let headOpacity = 1;
        if (p <= 0.08) {
          headOpacity = 1;
        } else if (p >= 0.40) {
          headOpacity = 0;
        } else {
          headOpacity = 1 - (p - 0.08) / (0.40 - 0.08);
        }
        heroCopy.style.opacity = headOpacity.toFixed(3);
      }

      // 2. Smooth video parallax without decoder jitter
      if (video) {
        video.style.transform = `translate3d(0, ${(p * -10).toFixed(1)}%, 0)`;
      }

      // 3. Scroll cue indicator
      if (scrollCueLine) {
        const lineScale = Math.max(0, 1 - p / 0.16).toFixed(3);
        scrollCueLine.style.transform = `scaleX(${lineScale})`;
      }
      if (scrollCue) {
        const cueOp = Math.max(0, 1 - p / 0.16).toFixed(3);
        scrollCue.style.opacity = cueOp;
      }
    };

    // Butter-smooth 120fps dampened animation loop
    const tick = () => {
      targetP = getProgress();
      if (isReducedMotion) {
        smoothP = targetP;
      } else {
        smoothP += (targetP - smoothP) * 0.10;
      }

      updateVisuals(smoothP);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(maxTimer);
    };
  }, []);

  return (
    <div className="relative w-full bg-slate-50 text-slate-900 font-['Inter_Tight',sans-serif]">
      {/* Daylight Fullscreen Loader */}
      {loaderVisible && (
        <div
          ref={loaderRef}
          className="fixed inset-0 bg-slate-50/98 backdrop-blur-md z-50 flex items-center justify-center transition-opacity duration-500 pointer-events-auto"
        >
          <div className="w-[calc(260*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(260*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] relative">
            <svg viewBox="0 0 240 240" className="w-full h-full fill-none">
              <ellipse
                cx="120"
                cy="120"
                rx="100"
                ry="52"
                stroke="rgba(15, 23, 42, 0.16)"
                strokeWidth="1.4"
                strokeDasharray="4 6"
              />
              <circle
                cx="120"
                cy="120"
                r="76"
                stroke="rgba(14, 165, 233, 0.45)"
                strokeWidth="1.4"
                strokeDasharray="3 5"
              />
              <g
                className="animate-[spin_1.6s_cubic-bezier(0.4,0,0.2,1)_infinite]"
                style={{ transformOrigin: '120px 120px' }}
              >
                <rect x="145" y="117" width="6" height="6" rx="1.5" fill="#0284c7" />
                <rect x="131" y="141" width="6" height="6" rx="1.5" fill="#0284c7" />
                <rect x="103" y="141" width="6" height="6" rx="1.5" fill="#0284c7" />
                <rect x="89" y="117" width="6" height="6" rx="1.5" fill="#0284c7" />
                <rect x="103" y="93" width="6" height="6" rx="1.5" fill="#0284c7" />
                <rect x="131" y="93" width="6" height="6" rx="1.5" fill="#0284c7" />
                <path
                  d="M 113 116 L 120 124 L 127 116"
                  stroke="#10b981"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* Rock-Solid Parallax Scroll Track (Zero Stutter, 100% Stable) */}
      <div ref={trackRef} className="relative w-full h-[150vh] max-md:h-[110vh] bg-slate-50">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          {/* Hardware-Accelerated Looping Video Layer */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-1 will-change-transform transform-gpu"
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/33150b94-09f7-47da-a7c9-3ae76c2dd7eb.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source
              media="(max-width: 900px)"
              src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/9a30e5e9-9f03-4755-9bc1-7bcf1510aab3.mp4"
              type="video/mp4"
            />
            <source
              src="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/65fdef53-5686-4659-8761-52d61bf1a4f7.mp4"
              type="video/mp4"
            />
          </video>

          {/* Luminous Daylight Shader Overlays */}
          <div
            className="absolute inset-0 z-2 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(248, 250, 252, 0.94) 0%, rgba(248, 250, 252, 0.72) 28%, rgba(248, 250, 252, 0) 52%), linear-gradient(0deg, rgba(248, 250, 252, 0.96) 0%, rgba(248, 250, 252, 0.75) 24%, rgba(248, 250, 252, 0) 48%)',
            }}
          />

          {/* Hero Headline Stage with Stable Typography */}
          <div
            className="fixed top-[calc(92*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:top-[128px] left-0 w-full flex justify-center z-20 pointer-events-none"
          >
            <div
              ref={heroCopyRef}
              className="flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl will-change-transform transform-gpu"
            >
              <h1 className="text-[calc(80*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[clamp(32px,8vw,44px)] font-black leading-[1.02] tracking-[-0.04em] text-slate-900 mb-3 sm:mb-[calc(22*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] drop-shadow-xs">
                See What Your City Needs.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
                  Help Make It Happen.
                </span>
              </h1>
              <p className="text-[calc(18*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[14px] font-medium leading-[1.45] text-slate-700 max-w-[calc(740*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:max-w-[32ch]">
                AI-driven speed. Verified ground coordination.<br className="hidden sm:inline" />
                We mobilize verified community resources and vetted NGOs to resolve unmet local needs in real-time.
              </p>

              {/* Quick Action CTAs */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pointer-events-auto">
                <Link
                  to="/discovery"
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-teal-600/25 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>Explore Needs</span>
                  <span className="text-teal-200">→</span>
                </Link>
                <Link
                  to="/report"
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 font-bold text-xs sm:text-sm shadow-xs border border-slate-200 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>Report Need</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Daylight Scroll Cue */}
          <div
            ref={scrollCueRef}
            className="fixed bottom-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] left-1/2 -translate-x-1/2 z-25 flex flex-col items-center pointer-events-none will-change-transform"
          >
            <div className="relative text-[calc(11.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-bold uppercase tracking-[0.06em] text-slate-600 pb-1">
              SCROLL TO EXPLORE LIVE RADAR
              <span
                ref={scrollCueLineRef}
                className="absolute bottom-0 left-0 w-full h-[1.5px] bg-teal-600 origin-left"
                style={{ willChange: 'transform' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
