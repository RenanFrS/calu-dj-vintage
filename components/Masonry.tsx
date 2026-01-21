"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";


// This file replaces the old Masonry with a Skiper-inspired parallax gallery.
// It keeps the default export named `Masonry` so existing imports (in `app/page.tsx`) don't need changes.

const images = [
  "/images/lummi/img15.png",
  "/images/lummi/img21.png",
  "/images/lummi/img3.png",
  "/images/lummi/img4.png",
  "/images/lummi/img5.png",
  "/images/lummi/img6.png",
  "/images/lummi/img7.png",
  "/images/lummi/img8.png",
  "/images/lummi/img24.png",
  "/images/lummi/img10.png",
  "/images/lummi/img11.png",
  "/images/lummi/img12.png",
  "/images/lummi/img13.png",
];

type MasonryProps = React.HTMLAttributes<HTMLElement> & { images?: string[] };

const Masonry: React.FC<MasonryProps> = ({ images: propImages, className, ...rest }) => {
  const gallery = useRef<HTMLDivElement | null>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const imgs = propImages ?? images;

  const { scrollYProgress } = useScroll({ target: gallery, offset: ["start end", "end start"] });

  const { height } = dimension;
  const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    let lenis: any = null;
    let rafId: number | null = null;

    const startLenis = async () => {
      try {
        const mod = await import("lenis");
        lenis = new (mod.default ?? mod)();

        const raf = (time: number) => {
          if (lenis && typeof lenis.raf === "function") lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);
      } catch (err) {
        console.warn("Lenis not installed — smooth scrolling disabled. Run: npm install lenis", err);
      }
    };

    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    startLenis();
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis && typeof lenis.destroy === "function") lenis.destroy();
    };
  }, []);

  return (
    <section {...rest} className={`relative ${className ?? "py-12"}`}>
      <div className="font-geist flex h-[10px] items-center justify-center gap-2">
        <div className="absolute left-1/2 top-[-2%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-linear-to-b after:from-white after:to-black after:content-['']">
          </span>
        </div>
      </div>

      {/* Mobile: two-column stacked rows (left small, right large). Desktop: Skiper parallax columns */}
      {dimension.width <= 768 ? (
        <div ref={gallery} className="container mx-auto px-4 space-y-4">
          {Array.from({ length: Math.ceil(imgs.length / 2) }).map((_, row) => {
            const left = imgs[row * 2];
            const right = imgs[row * 2 + 1];
            return (
              <div key={row} className="grid grid-cols-[1fr_2fr] gap-4 items-start">
                {left ? <MobileImage src={left} small index={row * 2} /> : <div />}
                {right ? <MobileImage src={right} large index={row * 2 + 1} /> : <div />}
              </div>
            );
          })}
        </div>
      ) : (
        <div ref={gallery} className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-transparent p-[2vw]">
          <Column images={[imgs[0], imgs[1], imgs[2]]} y={y} />
          <Column images={[imgs[3], imgs[4], imgs[5]]} y={y2} />
          <Column images={[imgs[6], imgs[7], imgs[8]]} y={y3} />
          <Column images={[imgs[9], imgs[10], imgs[11]]} y={y4} />
        </div>
      )}

      <div className="font-geist relative flex items-center justify-center gap-2">
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-linear-to-b after:from-white after:to-black after:content-['']">
          </span>
        </div>
      </div>
    </section>
  );
};

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const MobileImage: React.FC<{ src: string; small?: boolean; large?: boolean; index: number }> = ({ src, small, large }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["center end", "center start"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.06, 1]);
  const z = useTransform(scrollYProgress, [0, 0.5, 1], [1, 50, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, scale, zIndex: z }}
      className={`overflow-hidden bg-transparent ${small ? "h-48" : "h-72"}`}
    >
      <img src={src} alt="mobile-img" className="w-full h-full object-cover block" />
    </motion.div>
  );
};

const Column = ({ images, y }: ColumnProps) => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="relative h-[45vh] w-full overflow-hidden transition-all duration-300"
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          style={{ zIndex: active === i ? 50 : 1, transform: active === i ? 'scale(1.03)' : 'scale(1)' }}
        >
          <img src={`${src}`} alt={`img-${i}`} className="pointer-events-none object-cover w-full h-full block" />
        </div>
      ))}
    </motion.div>
  );
};

export default Masonry;
