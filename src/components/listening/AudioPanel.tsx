"use client";

import React from "react";
import MockAudioPlayer from "./MockAudioPlayer";
import TranscriptViewer from "./TranscriptViewer";

export default function AudioPanel() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="shrink-0">
        <MockAudioPlayer />
      </div>
      <div className="flex-1 min-h-0">
        <TranscriptViewer />
      </div>
    </div>
  );
}
