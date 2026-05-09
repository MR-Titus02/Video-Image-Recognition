"use client";

import { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const runDetection = async () => {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert("Camera is not supported");
        return;
      }

      // Webcam stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
      });

      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve();
        };
      });

      // Load model
      const model = await cocoSsd.load();

      setLoading(false);

      detectFrame(videoRef.current, model);
    } catch (error) {
      console.error(error);
    }
  };

  const detectFrame = async (video, model) => {
    const predictions = await model.detect(video);

    setObjects(predictions);

    renderPredictions(predictions);

    requestAnimationFrame(() => {
      detectFrame(video, model);
    });
  };

  const renderPredictions = (predictions) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = "18px Arial";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;

      // Border
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Label background
      ctx.fillStyle = "#00ffff";

      const text = `${prediction.class} ${Math.round(
        prediction.score * 100
      )}%`;

      const textWidth = ctx.measureText(text).width;

      ctx.fillRect(x, y - 28, textWidth + 12, 28);

      // Text
      ctx.fillStyle = "#000";
      ctx.fillText(text, x + 6, y - 24);
    });
  };

  useEffect(() => {
    runDetection();
  }, []);

  return (
    <main className="relative h-screen w-full bg-gradient-to-br from-black via-slate-950 to-cyan-950 overflow-hidden flex items-center justify-center">

      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full" />

      {/* Main container */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-bold tracking-widest text-cyan-400 font-[family-name:var(--font-orbitron)]">
            AI VISION
          </h1>

          <p className="text-slate-300 mt-2 text-sm tracking-[0.3em] uppercase">
            Real-Time Object Detection
          </p>
        </div>

        {/* Video container */}
        <div className="relative rounded-3xl overflow-hidden border border-cyan-400/40 shadow-[0_0_50px_rgba(34,211,238,0.35)]">

          {/* Loading */}
          {loading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />

                <p className="text-cyan-300 tracking-wider">
                  Loading AI Model...
                </p>
              </div>
            </div>
          )}

          {/* Webcam */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-[900px] max-w-[95vw] rounded-3xl"
          />

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />

          {/* Scanner line */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="w-full h-1 bg-cyan-400/70 animate-pulse absolute top-1/2 shadow-[0_0_20px_#22d3ee]" />
          </div>
        </div>

        {/* Detection panel */}
        <div className="mt-6 w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-cyan-400 text-xl font-semibold">
              Detected Objects
            </h2>

            <span className="text-sm text-slate-300">
              {objects.length} Objects Found
            </span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {objects.map((obj, index) => (
              <div
                key={index}
                className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="capitalize font-medium text-white">
                    {obj.class}
                  </p>

                  <span className="text-cyan-300 text-sm">
                    {Math.round(obj.score * 100)}%
                  </span>
                </div>

                <div className="w-full bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400"
                    style={{
                      width: `${obj.score * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}