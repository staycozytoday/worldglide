"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1, smoothWheel: true, wheelMultiplier: 0.8 }}>
      {children}
    </ReactLenis>
  );
}
