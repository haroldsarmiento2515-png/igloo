"use client";

import { useEffect, useRef, useState } from "react";

export default function OverlayUI() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);

  const stopSound = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
  };

  const createNoiseBuffer = (context: AudioContext) => {
    const duration = 2;
    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    return buffer;
  };

  const startSound = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    if (!context) return;

    if (context.state === "suspended") {
      await context.resume();
    }

    stopSound();
    const source = context.createBufferSource();
    source.buffer = createNoiseBuffer(context);
    source.loop = true;

    const gain = context.createGain();
    gain.gain.value = 0.18;
    source.connect(gain);
    gain.connect(context.destination);

    source.start(0);
    sourceRef.current = source;
    gainRef.current = gain;
  };

  useEffect(() => {
    if (!soundOn) {
      stopSound();
      setNeedsTap(false);
      return;
    }

    startSound()
      .then(() => setNeedsTap(false))
      .catch(() => setNeedsTap(true));
  }, [soundOn]);

  const handleToggle = () => {
    setSoundOn((prev) => !prev);
  };

  useEffect(
    () => () => {
      stopSound();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    },
    []
  );

  return (
    <div className="overlay">
      <div className="overlay-top">
        <div className="overlay-left">
          <div className="logo">IGLOO</div>
          <div className="meta">// Copyright © 2024</div>
          <div className="meta">Igloo, Inc.</div>
          <div className="meta">All Rights Reserved.</div>
        </div>
        <div className="overlay-right">
          <div className="manifesto-title">////// Manifesto</div>
          <p className="manifesto-text">
            Our mission is to create the largest onchain community, driving the
            consumer crypto revolution.
          </p>
        </div>
      </div>

      <div className="overlay-bottom">
        <button type="button" className="sound-toggle" onClick={handleToggle}>
          <span className="sound-icon" aria-hidden="true">
            {soundOn ? "🔊" : "🔈"}
          </span>
          Sound: {soundOn ? "On" : "Off"}
        </button>
        {needsTap && (
          <span className="sound-hint">Tap to enable sound</span>
        )}
      </div>
    </div>
  );
}
