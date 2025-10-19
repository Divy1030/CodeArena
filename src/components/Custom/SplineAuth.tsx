"use client";

import Spline from '@splinetool/react-spline';

export default function SplineAuth() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full max-w-[800px] max-h-[800px]">
        <Spline
          scene="https://prod.spline.design/CWecFzDUWy8gHppb/scene.splinecode"
        />
      </div>
    </div>
  );
}