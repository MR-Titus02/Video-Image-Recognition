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
      setImageUrl(URL.createObjectURL(file));
      setPredictions([]);
    }
  };

  const handleClassify = async () => {
    try {
      setLoading(true);

      const imgElement = document.querySelector("#uploaded-image");

      const model = await mobilenet.load();

      const prediction = await model.classify(imgElement);

      setPredictions(prediction);
    } catch (error) {
      console.error("Error occurred while classifying image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI Image Recognition
          </h1>

          <p className="text-slate-300">
            Upload an image and let AI identify it
          </p>
        </div>

        {/* Upload Box */}
        <label className="group cursor-pointer">
          <div className="border-2 border-dashed border-slate-500 hover:border-cyan-400 transition-all duration-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-slate-900/40">
            <div className="text-5xl mb-4 group-hover:scale-110 transition">
              📸
            </div>

            <h2 className="text-xl font-semibold mb-2">
              Click to Upload Image
            </h2>

            <p className="text-slate-400 text-sm">
              PNG, JPG, JPEG supported
            </p>
          </div>

          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            hidden
          />
        </label>

        {/* Preview */}
        {imageUrl && (
          <div className="mt-8 grid md:grid-cols-2 gap-8 items-start">
            
            {/* Image */}
            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700">
              <img
                id="uploaded-image"
                src={imageUrl}
                alt="Uploaded"
                className="rounded-xl w-full object-cover max-h-[400px]"
              />
            </div>

            {/* Results */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleClassify}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition disabled:opacity-50 shadow-lg"
              >
                {loading ? "Classifying..." : "Classify Image"}
              </button>

              {/* Prediction Cards */}
              {predictions.length > 0 && (
                <div className="space-y-4 mt-2">
                  <h2 className="text-2xl font-bold text-cyan-400">
                    Predictions
                  </h2>

                  {predictions.map((prediction, index) => (
                    <div
                      key={index}
                      className="bg-slate-900/60 border border-slate-700 rounded-2xl p-4 shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg capitalize">
                          {prediction.className}
                        </span>

                        <span className="text-cyan-400 font-bold">
                          {(prediction.probability * 100).toFixed(2)}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{
                            width: `${prediction.probability * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recognize;