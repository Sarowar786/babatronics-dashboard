"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- Animated Plane SVG ---
const Plane = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M90,50 L10,20 L25,47 L10,50 L25,53 L10,80 Z" />
    <path d="M40,47 L55,30 L70,47 Z" opacity="0.6" />
    <path d="M40,53 L55,70 L70,53 Z" opacity="0.6" />
  </svg>
);

// --- Cloud SVG ---
const Cloud = ({
  className,
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) => (
  <svg
    viewBox="0 0 200 80"
    fill="white"
    className={className}
    style={{ opacity }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="100" cy="55" rx="90" ry="25" />
    <ellipse cx="70" cy="45" rx="45" ry="30" />
    <ellipse cx="130" cy="42" rx="50" ry="32" />
    <ellipse cx="100" cy="38" rx="40" ry="28" />
  </svg>
);

// --- Star dot ---
const StarField = () => {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${2 + star.delay}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [planeX, setPlaneX] = useState(-10);

  // Countdown redirect
  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  // Plane fly animation
  useEffect(() => {
    let frame: number;
    let x = -10;
    const animate = () => {
      x += 0.15;
      if (x > 110) x = -10;
      setPlaneX(x);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const quickLinks = [
    { label: "🏠 Home", href: "/" },
    { label: "✈️ Destinations", href: "/destinations" },
    { label: "📖 Blog", href: "/blogs" },
    { label: "📞 Contact", href: "/contact" },
  ];

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes float-cloud-slow {
          0% { transform: translateX(-5%); }
          50% { transform: translateX(5%); }
          100% { transform: translateX(-5%); }
        }
        @keyframes float-cloud-medium {
          0% { transform: translateX(3%); }
          50% { transform: translateX(-3%); }
          100% { transform: translateX(3%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(44, 212, 191, 0.3); }
          50% { box-shadow: 0 0 50px rgba(44, 212, 191, 0.7), 0 0 80px rgba(44, 212, 191, 0.3); }
        }
        @keyframes number-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #2CD4BF, #a3e635, #2CD4BF);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }
        .number-float { animation: number-float 3s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .cloud-slow { animation: float-cloud-slow 8s ease-in-out infinite; }
        .cloud-medium { animation: float-cloud-medium 6s ease-in-out infinite; }
      `}</style>

      <div
        className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
        style={{
          background:
            "linear-gradient(160deg, #030d1a 0%, #0b1f35 30%, #0b4f4a 70%, #041a17 100%)",
        }}
      >
        {/* Star field */}
        <StarField />

        {/* Clouds */}
        <div
          className="absolute top-[8%] left-[-5%] w-56 md:w-80 cloud-slow pointer-events-none"
          style={{ opacity: 0.06 }}
        >
          <Cloud />
        </div>
        <div
          className="absolute top-[15%] right-[-3%] w-44 md:w-64 cloud-medium pointer-events-none"
          style={{ opacity: 0.05 }}
        >
          <Cloud />
        </div>
        <div
          className="absolute bottom-[20%] left-[5%] w-36 md:w-52 cloud-slow pointer-events-none"
          style={{ opacity: 0.04 }}
        >
          <Cloud />
        </div>
        <div
          className="absolute bottom-[10%] right-[8%] w-48 md:w-72 cloud-medium pointer-events-none"
          style={{ opacity: 0.06 }}
        >
          <Cloud />
        </div>

        {/* Flying plane */}
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left: `${planeX}%`,
            top: "22%",
            transition: "left 0.016s linear",
          }}
        >
          <Plane className="w-10 h-10 md:w-14 md:h-14 text-[#2CD4BF] drop-shadow-[0_0_12px_rgba(44,212,191,0.8)]" />
        </div>

        {/* Dotted flight path */}
        <div className="absolute top-[22%] left-0 right-0 h-px pointer-events-none">
          <svg width="100%" height="2" className="overflow-visible">
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="rgba(44,212,191,0.2)"
              strokeWidth="1.5"
              strokeDasharray="6 14"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Main content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-3xl mx-auto">
          {/* 404 Number */}
          <div className="number-float mb-2 select-none">
            <h1
              className="gradient-text font-black leading-none tracking-tighter"
              style={{ fontSize: "clamp(8rem, 20vw, 14rem)" }}
            >
              404
            </h1>
          </div>

          {/* Glowing divider */}
          <div
            className="w-24 h-1 rounded-full mb-8 pulse-glow"
            style={{
              background: "linear-gradient(90deg, #2CD4BF, #a3e635)",
            }}
          />

          {/* Headline */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Oops! This destination{" "}
            <span className="text-[#2CD4BF]">doesn't exist</span>
          </h2>

          {/* Sub-copy */}
          <p className="text-gray-400 text-base md:text-lg mb-10 max-w-md leading-relaxed">
            Looks like our plane flew off-course. The page you're looking for
            has either moved, been removed, or never existed.
          </p>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/80 text-sm font-medium
                           hover:bg-[#2CD4BF]/20 hover:border-[#2CD4BF]/50 hover:text-[#2CD4BF]
                           transition-all duration-300 backdrop-blur-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Primary CTA */}
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg text-brand-navy overflow-hidden
                       transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #2CD4BF 0%, #a3e635 100%)",
              boxShadow: "0 8px 32px rgba(44,212,191,0.4)",
            }}
          >
            <span>Take Me Home</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>

          {/* Auto-redirect countdown */}
          <p className="mt-6 text-gray-500 text-sm">
            Redirecting to home in{" "}
            <span
              className="font-bold tabular-nums"
              style={{ color: "#2CD4BF" }}
            >
              {countdown}s
            </span>
          </p>

          {/* Countdown ring */}
          <div className="mt-3 relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#2CD4BF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - countdown / 10)}`}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#2CD4BF]">
              {countdown}
            </span>
          </div>
        </div>

        {/* Bottom horizon glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(44,212,191,0.06), transparent)",
          }}
        />

        {/* Bottom city silhouette */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: "80px", opacity: 0.08 }}
          >
            <path
              d="M0 120 L0 80 L40 80 L40 50 L60 50 L60 30 L80 30 L80 50 L100 50 L100 60 L120 60 L120 40 L130 40 L130 20 L140 20 L140 40 L150 40 L150 60 L180 60 L180 45 L200 45 L200 30 L210 30 L210 45 L230 45 L230 60 L260 60 L260 70 L280 70 L280 50 L290 50 L290 35 L300 35 L300 50 L310 50 L310 70 L340 70 L340 55 L360 55 L360 30 L375 30 L375 10 L390 10 L390 30 L405 30 L405 55 L430 55 L430 65 L460 65 L460 50 L475 50 L475 40 L490 40 L490 50 L505 50 L505 65 L530 65 L530 75 L560 75 L560 55 L575 55 L575 35 L585 35 L585 55 L600 55 L600 75 L630 75 L630 60 L650 60 L650 45 L660 45 L660 25 L670 25 L670 45 L680 45 L680 60 L710 60 L710 70 L730 70 L730 50 L745 50 L745 35 L760 35 L760 50 L775 50 L775 70 L800 70 L800 55 L820 55 L820 40 L832 40 L832 20 L845 20 L845 40 L858 40 L858 55 L880 55 L880 65 L910 65 L910 50 L925 50 L925 65 L950 65 L950 75 L980 75 L980 60 L995 60 L995 40 L1005 40 L1005 60 L1020 60 L1020 75 L1050 75 L1050 60 L1070 60 L1070 45 L1085 45 L1085 30 L1095 30 L1095 45 L1110 45 L1110 60 L1140 60 L1140 70 L1160 70 L1160 55 L1175 55 L1175 70 L1200 70 L1200 80 L1230 80 L1230 65 L1245 65 L1245 50 L1255 50 L1255 65 L1270 65 L1270 80 L1300 80 L1300 70 L1320 70 L1320 55 L1335 55 L1335 70 L1360 70 L1360 80 L1380 80 L1380 90 L1440 90 L1440 120 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </>
  );
}
