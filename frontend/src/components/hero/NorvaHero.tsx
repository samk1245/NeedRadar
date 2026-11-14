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

    // Loader logic
    let loaderDismissed = false;
    const dismiss = () => {
      if (loaderDismissed) return;
      loaderDismissed = true;
      setLoaderVisible(false);
    };

    if (isRecorder) {
      dismiss();
    } else {
      const maxTimer = setTimeout(dismiss, 3500);
      const onReady = () => {
        setTimeout(() => {
          clearTimeout(maxTimer);
          dismiss();
        }, 350);
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
      // 1. Headline transform & opacity
      if (heroCopy) {
        const h = easeInOutQuad(p / 0.38);
        const ty = -34 * h;
        const rx = 62 * h;
        const s = 1 - 0.12 * h;
        heroCopy.style.transform = `translateY(${ty}vh) rotateX(${rx}deg) scale(${s})`;

        let headOpacity = 1;
        if (p <= 0.10) {
          headOpacity = 1;
        } else if (p >= 0.24) {
          headOpacity = 0;
        } else {
          headOpacity = 1 - (p - 0.10) / (0.24 - 0.10);
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

      // 3. Process list
      if (processList) {
        let procP = 0;
        if (p <= 0.08) {
          procP = 0;
        } else if (p >= 0.24) {
          procP = 1;
        } else {
          procP = (p - 0.08) / (0.24 - 0.08);
        }
        const procY = (1 - procP) * 40;
        processList.style.opacity = procP.toString();
        processList.style.transform = `translateY(${procY}px)`;
      }

      // Step active threshold
      const nextStep = p < 0.62 ? 0 : 1;
      setActiveStep(nextStep);
    };

    const onSeeked = () => {
      if (Math.abs(video.currentTime - targetTime) > 1 / 60) {
        if (!video.seeking) {
          video.currentTime = targetTime;
        }
      }
    };
    video.addEventListener('seeked', onSeeked);

    const tick = () => {
      if (!isRecorder) {
        const p = getProgress();
        const vidDur = video.duration || duration;
        targetTime = p * Math.max(0, vidDur - 1 / 48);

        if (isReducedMotion) {
          curTime = targetTime;
          if (!video.seeking && Math.abs(video.currentTime - curTime) > 1 / 60) {
            video.currentTime = curTime;
          }
        } else {
          curTime += (targetTime - curTime) * 0.2;
          if (!video.seeking && Math.abs(video.currentTime - curTime) > 1 / 60) {
            video.currentTime = curTime;
          }
        }

        updateVisuals(p);
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    // Recorder mode
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
    <div className="relative w-full bg-[#0f1626] text-[#f4f6fa] font-['Inter_Tight',sans-serif]">
      {/* Fullscreen Loader */}
      {loaderVisible && (
        <div
          ref={loaderRef}
          className="fixed inset-0 bg-[#0f1626] z-50 flex items-center justify-center transition-opacity duration-600 pointer-events-auto"
        >
          <div className="w-[calc(260*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(260*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] relative">
            <svg viewBox="0 0 240 240" className="w-full h-full fill-none">
              {/* Outer Wide Ellipse (Dotted) */}
              <ellipse
                cx="120"
                cy="120"
                rx="100"
                ry="52"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              {/* Inner Circular Ellipse (Dotted) */}
              <circle
                cx="120"
                cy="120"
                r="76"
                stroke="rgba(63, 216, 255, 0.35)"
                strokeWidth="1.2"
                strokeDasharray="3 5"
              />
              {/* Spinning Central Mark */}
              <g
                className="animate-[spin_1.6s_cubic-bezier(0.4,0,0.2,1)_infinite]"
                style={{ transformOrigin: '120px 120px' }}
              >
                <rect x="145" y="117" width="6" height="6" rx="1" fill="#3fd8ff" />
                <rect x="131" y="141" width="6" height="6" rx="1" fill="#3fd8ff" />
                <rect x="103" y="141" width="6" height="6" rx="1" fill="#3fd8ff" />
                <rect x="89" y="117" width="6" height="6" rx="1" fill="#3fd8ff" />
                <rect x="103" y="93" width="6" height="6" rx="1" fill="#3fd8ff" />
                <rect x="131" y="93" width="6" height="6" rx="1" fill="#3fd8ff" />
                <path
                  d="M 113 116 L 120 124 L 127 116"
                  stroke="#c6ff2e"
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
      <div ref={trackRef} className="relative w-full h-[420vh] bg-[#0f1626]">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          {/* Scrubbed Video Layer */}
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

          {/* Light Contrast Shade */}
          <div
            className="absolute inset-0 z-2 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(15, 22, 38, 0.55) 0%, rgba(15, 22, 38, 0) 34%), linear-gradient(0deg, rgba(15, 22, 38, 0.50) 0%, rgba(15, 22, 38, 0) 30%)',
            }}
          />

          {/* Hero Headline Stage (Perspective 900u) */}
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
              }}
            >
              <h1 className="text-[calc(84*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[clamp(38px,11vw,48px)] font-semibold leading-[0.96] tracking-[-0.045em] text-[#f4f6fa] mb-[calc(24*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:mb-4">
                The New Standard<br />in Staffing
              </h1>
              <p className="text-[calc(18*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[15px] font-normal leading-[1.42] text-[rgba(244,246,250,0.72)] max-w-[calc(720*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:max-w-[34ch]">
                AI driven speed. Expert curation.<br className="hidden sm:inline" />
                We mobilize verified crews to protect your schedule and<br className="hidden sm:inline" />
                your bottom line in high-consequence environments.
              </p>
            </div>
          </div>

          {/* Scroll Cue */}
          <div
            ref={scrollCueRef}
            className="fixed bottom-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] left-1/2 -translate-x-1/2 z-25 flex flex-col items-center pointer-events-none"
            style={{ willChange: 'opacity' }}
          >
            <div className="relative text-[calc(11.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold uppercase tracking-[0.06em] text-[rgba(244,246,250,0.72)] pb-1">
              SCROLL TO DISCOVER OUR PROCESS
              <span
                ref={scrollCueLineRef}
                className="absolute bottom-0 left-0 w-full h-[1px] bg-[rgba(244,246,250,0.72)] origin-left"
                style={{ willChange: 'transform' }}
              />
            </div>
          </div>

          {/* Process List (Bottom Left) */}
          <div
            ref={processListRef}
            className="fixed left-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] bottom-[calc(28*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] w-[calc(430*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:left-[18px] max-md:right-[18px] max-md:bottom-[22px] max-md:w-auto z-25 flex flex-col gap-2 pointer-events-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Row 01 */}
            <div className={`flex flex-col transition-all duration-300 ${activeStep === 0 ? 'active' : ''}`}>
              <div className="flex items-center gap-3.5 cursor-pointer">
                <div
                  className={`w-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] flex items-center justify-center text-[calc(12.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold rounded-[calc(8*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] transition-colors duration-350 ${
                    activeStep === 0
                      ? 'bg-[#f4f6fa] text-[#0f1626] font-bold'
                      : 'text-[rgba(244,246,250,0.72)]'
                  }`}
                >
                  01
                </div>
                <div
                  className={`transition-all duration-350 tracking-tight ${
                    activeStep === 0
                      ? 'text-[calc(18*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold text-[#f4f6fa]'
                      : 'text-[calc(12.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-medium text-[rgba(244,246,250,0.72)]'
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
                <div className="min-h-0 border-l border-[rgba(255,255,255,0.22)] pl-4 ml-[17px] mt-2 mb-2.5">
                  <p className="text-[calc(13.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[13px] leading-[1.48] text-[rgba(244,246,250,0.72)] font-normal">
                    One call starts mobilization. Craft, headcount and start date go straight to our vetted crews. No hand-offs. No escalations. Just boots on site within minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 02 */}
            <div className={`flex flex-col transition-all duration-300 ${activeStep === 1 ? 'active' : ''}`}>
              <div className="flex items-center gap-3.5 cursor-pointer">
                <div
                  className={`w-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] flex items-center justify-center text-[calc(12.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold rounded-[calc(8*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] transition-colors duration-350 ${
                    activeStep === 1
                      ? 'bg-[#f4f6fa] text-[#0f1626] font-bold'
                      : 'text-[rgba(244,246,250,0.72)]'
                  }`}
                >
                  02
                </div>
                <div
                  className={`transition-all duration-350 tracking-tight ${
                    activeStep === 1
                      ? 'text-[calc(18*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold text-[#f4f6fa]'
                      : 'text-[calc(12.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-medium text-[rgba(244,246,250,0.72)]'
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
                <div className="min-h-0 border-l border-[rgba(255,255,255,0.22)] pl-4 ml-[17px] mt-2 mb-2.5">
                  <p className="text-[calc(13.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] max-md:text-[13px] leading-[1.48] text-[rgba(244,246,250,0.72)] font-normal">
                    Every worker is screened before dispatch: compliance, background, certifications and fitness for duty, so the whole crew clears the gate on day one.
                  </p>
                </div>
              </div>
            </div>

            {/* Row 03 */}
            <div className="flex flex-col transition-all duration-300">
              <div className="flex items-center gap-3.5 cursor-pointer">
                <div className="w-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] flex items-center justify-center text-[calc(12.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold text-[rgba(244,246,250,0.72)]">
                  03
                </div>
                <div className="text-[calc(12.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-medium text-[rgba(244,246,250,0.72)] tracking-tight">
                  Proven field match
                </div>
              </div>
            </div>

            {/* Row 04 */}
            <div className="flex flex-col transition-all duration-300">
              <div className="flex items-center gap-3.5 cursor-pointer">
                <div className="w-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] h-[calc(36*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] flex items-center justify-center text-[calc(12.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-semibold text-[rgba(244,246,250,0.72)]">
                  04
                </div>
                <div className="text-[calc(12.5*clamp(0.72px,min(100vw/1440,100vh/960),1.5px))] font-medium text-[rgba(244,246,250,0.72)] tracking-tight">
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
