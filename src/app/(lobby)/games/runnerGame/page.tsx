"use client";

import { Suspense } from "react";
import RunnerGame from "./components/RunnerGame";

export default function RunnerGamePage() {
  return (
    <Suspense>
      <RunnerGame />
    </Suspense>
  );
}
