"use client";

import { Suspense } from "react";
import RunnerGame from "./components/RunnerGame";

export default function RunnerGamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RunnerGame />;
    </Suspense>
  );
}
