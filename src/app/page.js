"use client";

import { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);

  const startCamera = async () => {
    try {
      setStartingCamera(true);
      setCameraDenied(false);

      // Check support
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert("Camera is not supported on this device");
        return;
      }

      // Ask for permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      // Attach stream
      videoRef.current.srcObject = stream;

      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve();
        };
      });

      // Load AI model
      const model = await cocoSsd.load();

      setLoading(false);

      detectFrame(videoRef.current, model);
    } catch (error) {
      console.error(error);

      // Permission denied
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setCameraDenied(true);
      }
    } finally {
      setStartingCamera(false);
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

    if (!canvas || !videoRef.current) return;

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
    startCamera();
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-black via-slate-950 to-cyan-950 overflow-hidden flex items-center justify-center px-4 py-8">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center w-full">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-cyan-400 font-[family-name:var(--font-orbitron)]">
            CyberSight
          </h1>

          <p className="text-slate-300 mt-2 text-xs md:text-sm tracking-[0.3em] uppercase">
            Real-Time AI Object Detection
          </p>
        </div>

        {/* Camera Permission Screen */}
        {(cameraDenied || startingCamera) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

            <div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-2xl p-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.2)]">

              <div className="w-24 h-24 mx-auto rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-6">
                📷
              </div>

              <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                Camera Access
              </h2>

              <p className="text-slate-300 leading-relaxed mb-8">
                CyberSight needs camera permission to detect objects in
                real-time.
              </p>

              {startingCamera ? (
                <div className="flex flex-col items-center gap-5">

                  <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />

                  <p className="tracking-widest uppercase text-cyan-300 text-sm">
                    Requesting Camera...
                  </p>
                </div>
              ) : (
                <button
                  onClick={startCamera}
                  className="w-full py-4 rounded-2xl bg-cyan-400 text-black font-black tracking-widest hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300"
                >
                  ENABLE CAMERA
                </button>
              )}
            </div>
          </div>
        )}

        {/* Video Container */}
        <div className="relative rounded-3xl overflow-hidden border border-cyan-400/40 shadow-[0_0_50px_rgba(34,211,238,0.35)]">

          {/* Loading */}
          {loading && !cameraDenied && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">

              <div className="flex flex-col items-center gap-4">

                <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />

                <p className="text-cyan-300 tracking-wider uppercase text-sm">
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

          {/* Scanner */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="w-full h-1 bg-cyan-400/70 animate-pulse absolute top-1/2 shadow-[0_0_20px_#22d3ee]" />
          </div>
        </div>

        {/* Detection Panel */}
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