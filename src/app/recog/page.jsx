"use client";

import React, { useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

function Recognize() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageObjectUrl = URL.createObjectURL(file);

      setImageUrl(imageObjectUrl);
      setPredictions([]);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setPredictions([]);
  };

  const handleClassify = async () => {
    try {
      setLoading(true);

      const model = await mobilenet.load();

      const imgElement = document.getElementById("uploaded-image");

      if (!imgElement) return;

      const prediction = await model.classify(imgElement);

      setPredictions(prediction);
    } catch (error) {
      console.error("Classification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-cyan-950 text-white overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-cyan-500/20 blur-3xl rounded-full" />

        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:45px_45px]" />
      </div>

      <div className="relative z-10 px-4 py-8 md:px-8">

        {/* Header */}
        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 backdrop-blur-xl mb-5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

            <span className="text-xs tracking-[0.3em] uppercase text-cyan-300">
              CyberSight
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-widest text-cyan-400 font-[family-name:var(--font-orbitron)]">
            AI VISION
          </h1>

          <p className="text-slate-300 mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Upload an image and let AI identify objects with confidence scoring.
          </p>
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 items-start">

          {/* LEFT PANEL */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[28px] p-5 md:p-6 shadow-[0_0_50px_rgba(34,211,238,0.08)]">

            {/* SHOW UPLOAD BOX ONLY IF NO IMAGE */}
            {!imageUrl ? (
              <label className="group cursor-pointer block">

                <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-cyan-400/20 hover:border-cyan-400 transition-all duration-500 bg-black/30 hover:bg-cyan-400/5 p-10 md:p-14">

                  <div className="flex flex-col items-center text-center">

                    <div className="w-24 h-24 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                      <span className="text-5xl">🧠</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                      Upload Image
                    </h2>

                    <p className="text-slate-400 mb-6 max-w-md">
                      Select an image and let AI classify what it sees.
                    </p>

                    <div className="px-6 py-3 rounded-xl bg-cyan-400 text-black font-bold tracking-wide shadow-lg shadow-cyan-400/30">
                      SELECT IMAGE
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <>
                {/* IMAGE PREVIEW */}
                <div className="relative rounded-3xl overflow-hidden border border-cyan-400/20 bg-black/40">

                  {/* Loading Overlay */}
                  {loading && (
                    <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">

                      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-5" />

                      <p className="tracking-widest text-cyan-300 uppercase text-sm">
                        Analyzing Image...
                      </p>
                    </div>
                  )}

                  {/* IMAGE */}
                  <img
                    id="uploaded-image"
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full max-h-[500px] object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                  {/* Scan line */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-pulse" />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-red-500 transition flex items-center justify-center border border-white/10"
                  >
                    ✕
                  </button>
                </div>

                {/* ACTION BUTTON */}
                <button
                  onClick={handleClassify}
                  disabled={loading}
                  className="mt-5 w-full py-4 rounded-2xl bg-cyan-400 text-black font-black tracking-widest hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "PROCESSING..." : "START AI ANALYSIS"}
                </button>
              </>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[28px] p-5 md:p-6 shadow-[0_0_50px_rgba(34,211,238,0.08)]">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 font-[family-name:var(--font-orbitron)]">
                  DETECTIONS
                </h2>

                <p className="text-slate-400 mt-2 text-sm">
                  AI prediction results
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                ⚡
              </div>
            </div>

            {/* EMPTY STATE */}
            {!predictions.length && !loading && (
              <div className="min-h-[250px] flex items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">

                <div className="text-center px-5">

                  <div className="text-6xl mb-5 opacity-60">
                    👁️
                  </div>

                  <h3 className="text-2xl font-semibold mb-3">
                    Waiting For Analysis
                  </h3>

                  <p className="text-slate-400 text-sm md:text-base">
                    Upload an image and start AI analysis.
                  </p>
                </div>
              </div>
            )}

            {/* PREDICTIONS */}
            <div className="space-y-4">

              {predictions.map((prediction, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-white/[0.03] hover:bg-cyan-400/[0.05] transition-all duration-300 p-5"
                >

                  <div className="flex items-start justify-between mb-5">

                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-2">
                        Object Detected
                      </p>

                      <h3 className="text-2xl font-bold capitalize">
                        {prediction.className}
                      </h3>
                    </div>

                    <div className="text-right">
                      <p className="text-4xl font-black text-cyan-400">
                        {(prediction.probability * 100).toFixed(0)}%
                      </p>

                      <p className="text-xs uppercase tracking-widest text-slate-400">
                        Confidence
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden border border-white/5">

                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                      style={{
                        width: `${prediction.probability * 100}%`,
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                    <span>MobileNet Classification</span>

                    <span>Rank #{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Recognize;