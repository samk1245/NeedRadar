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
  const processListRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [loaderVisible, setLoaderVisible] = useState<boolean>(true);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    const heroCopy = heroCopyRef.current;
    const scrollCue = scrollCueRef.current;
    const scrollCueLine = scrollCueLineRef.current;
    const processList = processListRef.current;

    if (!track || !video) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isRecorder = window.location.search.includes('rec=1');

    // 1. Loader logic
    let loaderDismissed = false;
    const dismiss = () => {
      if (loaderDismissed) return;
      loaderDismissed = true;
      setLoaderVisible(false);
    };

    if (isRecorder) {
      dismiss();
    } else {
      const maxTimer = setTimeout(dismiss, 3200);
      const onReady = () => {
        setTimeout(() => {
          clearTimeout(maxTimer);
          dismiss();
        }, 300);
      };

      if (video.readyState >= 2) {
        onReady();
      } else {
        video.addEventListener('loadeddata', onReady, { once: true });
        video.addEventListener('canplay', onReady, { once: true });
      }
    }

    video.pause();

    const duration = 5.04;
    let targetP = 0;
    let smoothP = 0;
    let curTime = 0;
    let targetTime = 0;
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
      // 1. Headline transform & opacity with butter-smooth layback
      if (heroCopy) {
        const h = easeInOutQuad(p / 0.38);
        const ty = -32 * h;
        const rx = 60 * h;
        const s = 1 - 0.11 * h;
        heroCopy.style.transform = `translate3d(0, ${ty}vh, 0) rotateX(${rx}deg) scale(${s})`;

        let headOpacity = 1;
        if (p <= 0.08) {
          headOpacity = 1;
        } else if (p >= 0.23) {
          headOpacity = 0;
        } else {
          headOpacity = 1 - (p - 0.08) / (0.23 - 0.08);
        }
        heroCopy.style.opacity = headOpacity.toString();
      }

      // 2. Scroll cue
      if (scrollCueLine) {
        const lineScale = Math.max(0, 1 - p / 0.10);
        scrollCueLine.style.transform = `scaleX(${lineScale})`;
      }
      if (scrollCue) {
        let cueOp = 1;
        if (p <= 0.04) {
          cueOp = 1;
        } else if (p >= 0.12) {
          cueOp = 0;
        } else {
          cueOp = 1 - (p - 0.04) / (0.12 - 0.04);
        }
        scrollCue.style.opacity = cueOp.toString();
      }

      // 3. Process list elevation & opacity
      if (processList) {
        let procP = 0;
        if (p <= 0.07) {
          procP = 0;
        } else if (p >= 0.22) {
          procP = 1;
        } else {
          procP = (p - 0.07) / (0.22 - 0.07);
        }
        const procY = (1 - procP) * 36;
        processList.style.opacity = procP.toString();
        processList.style.transform = `translate3d(0, ${procY}px, 0)`;
      }

      // Step active threshold
      const nextStep = p < 0.62 ? 0 : 1;
      setActiveStep(nextStep);
    };

    const onSeeked = () => {
      if (Math.abs(video.currentTime - targetTime) > 0.02) {
        if (!video.seeking) {
          video.currentTime = targetTime;
        }
      }
    };
    video.addEventListener('seeked', onSeeked);

    // Butter-smooth double-dampened animation loop
    const tick = () => {
      if (!isRecorder) {
        targetP = getProgress();
        // Progress dampening for 120fps buttery smoothness across all mice & touchpads
        if (isReducedMotion) {
          smoothP = targetP;
        } else {
          smoothP += (targetP - smoothP) * 0.12;
        }

        const vidDur = video.duration || duration;
        targetTime = smoothP * Math.max(0, vidDur - 1 / 48);

        if (isReducedMotion) {
          curTime = targetTime;
          if (!video.seeking && Math.abs(video.currentTime - curTime) > 0.02) {
            video.currentTime = curTime;
          }
        } else {
          curTime += (targetTime - curTime) * 0.14;
          if (!video.seeking && Math.abs(video.currentTime - curTime) > 0.02) {
            video.currentTime = curTime;
          }
        }

        updateVisuals(smoothP);
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    // Recorder mode support (?rec=1)
    if (isRecorder) {
      (window as unknown as { __recTime: (vid: HTMLVideoElement, t: number) => number }).__recTime = (
        v: HTMLVideoElement,
        t: number
      ) => {
        const tgtVid = v || video;
        const vidDur = tgtVid.duration || duration;
        let p = 0;
        if (t <= 0.55) {
          p = 0;
        } else if (t <= 5.59) {
          p = (t - 0.55) / 5.04;
        } else {
          p = 1;
        }
        p = Math.max(0, Math.min(1, p));

        const maxScroll = track.offsetHeight - window.innerHeight;
        window.scrollTo(0, p * maxScroll);

        const cTime = p * Math.max(0, vidDur - 1 / 48);
        tgtVid.currentTime = cTime;
        updateVisuals(p);
        return cTime;
      };

      const startRec = performance.now();
      const recStep = (now: number) => {
        const elapsed = (now - startRec) / 1000;
        if (elapsed <= 6.5) {
          (window as unknown as { __recTime: (vid: HTMLVideoElement, t: number) => number }).__recTime(
            video,
            elapsed
          );
          requestAnimationFrame(recStep);
        } else {
          (window as unknown as { __recTime: (vid: HTMLVideoElement, t: number) => number }).__recTime(
            video,
            6.5
          );
        }
      };
      requestAnimationFrame(recStep);
    }

    return () => {
      cancelAnimationFrame(animId);
      video.removeEventListener('seeked', onSeeked);
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
              {/* Outer Wide Ellipse (Dotted) */}
              <ellipse
                cx="120"
                cy="120"
                rx="100"
                ry="52"
                stroke="rgba(15, 23, 42, 0.16)"
                strokeWidth="1.4"
                strokeDasharray="4 6"
              />
              {/* Inner Circular Ellipse (Dotted) */}
              <circle
                cx="120"
                cy="120"
                r="76"
                stroke="rgba(14, 165, 233, 0.45)"
                strokeWidth="1.4"
                strokeDasharray="3 5"
              />
              {/* Spinning Central Mark */}
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

      {/* 420vh Scroll Track */}
      <div ref={trackRef} className="relative w-full h-[420vh] bg-slate-50">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          {/* Scrubbed 3D Video Layer */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-1"
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/33150b94-09f7-47da-a7c9-3ae76c2dd7eb.jpg"
            playsInline
            muted
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

          {/* Hero Headline Stage (Perspective 900u) with Clean Daylight Typography */}
          <div
            className="fixed top-[calc(92*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:top-[96px] left-0 w-full flex justify-center z-20 pointer-events-none"
            style={{
              perspective: 'calc(900 * clamp(0.72px, min(100vw / 1440, 100vh / 960), 1.5px))',
            }}
          >
            <div
              ref={heroCopyRef}
              className="flex flex-col items-center text-center px-6 max-w-4xl"
              style={{
                transformOrigin: '50% 100%',
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
              }}
            >
              <h1 className="text-[calc(80*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[clamp(36px,10vw,48px)] font-black leading-[0.98] tracking-[-0.04em] text-slate-900 mb-[calc(22*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:mb-4 drop-shadow-xs">
                See What Your City Needs.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
                  Help Make It Happen.
                </span>
              </h1>
              <p className="text-[calc(18*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[15px] font-medium leading-[1.45] text-slate-700 max-w-[calc(740*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:max-w-[34ch]">
                AI-driven speed. Verified ground coordination.<br className="hidden sm:inline" />
                We mobilize verified community resources and vetted NGOs to resolve unmet local needs in real-time.
              </p>
            </div>
          </div>

          {/* Daylight Scroll Cue */}
          <div
            ref={scrollCueRef}
            className="fixed bottom-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] left-1/2 -translate-x-1/2 z-25 flex flex-col items-center pointer-events-none"
            style={{ willChange: 'opacity' }}
          >
            <div className="relative text-[calc(11.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-bold uppercase tracking-[0.06em] text-slate-600 pb-1">
              SCROLL TO DISCOVER OUR PROCESS
              <span
                ref={scrollCueLineRef}
                className="absolute bottom-0 left-0 w-full h-[1.5px] bg-teal-600 origin-left"
                style={{ willChange: 'transform' }}
              />
            </div>
          </div>

          {/* Daylight Process List (Bottom Left Glass Card) */}
          <div
            ref={processListRef}
            className="fixed left-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] bottom-[calc(28*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] w-[calc(430*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:left-[18px] max-md:right-[18px] max-md:bottom-[22px] max-md:w-auto z-25 flex flex-col gap-2.5 p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-xl pointer-events-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Row 01 */}
            <div className={`flex flex-col transition-all duration-350 ${activeStep === 0 ? 'active' : ''}`}>
              <div className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-[calc(34*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(34*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] flex items-center justify-center text-[calc(12*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-bold rounded-xl transition-all duration-300 ${
                    activeStep === 0
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  01
                </div>
                <div
                  className={`transition-all duration-300 tracking-tight ${
                    activeStep === 0
                      ? 'text-[calc(16.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-bold text-slate-900'
                      : 'text-[calc(13*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold text-slate-500'
                  }`}
                >
                  Activation, simplified
                </div>
              </div>
              <div
                className={`grid transition-[grid-template-rows] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                  activeStep === 0 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="min-h-0 border-l-2 border-teal-500/70 pl-3.5 ml-[16px] mt-2 mb-2">
                  <p className="text-[calc(13*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[13px] leading-[1.5] text-slate-600 font-normal">
                    One call starts mobilization. Craft, headcount and start date go straight to our vetted crews. No hand-offs. No escalations. Just boots on site within minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 02 */}
            <div className={`flex flex-col transition-all duration-350 ${activeStep === 1 ? 'active' : ''}`}>
              <div className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`w-[calc(34*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(34*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] flex items-center justify-center text-[calc(12*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-bold rounded-xl transition-all duration-300 ${
                    activeStep === 1
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  02
                </div>
                <div
                  className={`transition-all duration-300 tracking-tight ${
                    activeStep === 1
                      ? 'text-[calc(16.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-bold text-slate-900'
                      : 'text-[calc(13*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold text-slate-500'
                  }`}
                >
                  Cleared to count
                </div>
              </div>
              <div
                className={`grid transition-[grid-template-rows] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                  activeStep === 1 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="min-h-0 border-l-2 border-teal-500/70 pl-3.5 ml-[16px] mt-2 mb-2">
                  <p className="text-[calc(13*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[13px] leading-[1.5] text-slate-600 font-normal">
                    Every worker is screened before dispatch: compliance, background, certifications and fitness for duty, so the whole crew clears the gate on day one.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 03 */}
            <div className="flex flex-col transition-all duration-300">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-[calc(34*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(34*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] flex items-center justify-center text-[calc(12*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold text-slate-400 bg-slate-50 rounded-xl">
                  03
                </div>
                <div className="text-[calc(13*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-medium text-slate-500 tracking-tight">
                  Proven field match
                </div>
              </div>
            </div>

            {/* Row 04 */}
            <div className="flex flex-col transition-all duration-300">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-[calc(34*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(34*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] flex items-center justify-center text-[calc(12*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold text-slate-400 bg-slate-50 rounded-xl">
                  04
                </div>
                <div className="text-[calc(13*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-medium text-slate-500 tracking-tight">
                  Seamless arrival
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
