"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={{ lerp: 0.025, duration: 3, smoothWheel: true, wheelMultiplier: 0.3 }}>
      {children}
    </ReactLenis>
  );
}
