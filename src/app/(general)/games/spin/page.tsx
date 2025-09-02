"use client";

import { Suspense } from "react";
import { SpinWheelPage } from "./components/SpinWheelGame";

export default function RunnerGamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpinWheelPage />
    </Suspense>
  );
}
