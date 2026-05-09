"use client";


import { useRef, useEffect } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export default function Home() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const runDetection = () => {
    const doesExist = navigator.mediaDevices.getUserMedia({ video: true }) instanceof Promise;
    if (!doesExist) {
      console.log("Camera is supported"); 
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const webcamPromise = navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } }).then((stream) => {
          videoRef.current.srcObject = stream;
          return new Promise((resolve, reject) => {
            videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });

        const modelPromise = cocoSsd.load();

        Promise.all([modelPromise, webcamPromise]).then((values) => {
          const model = values[0];
          detectFrame(videoRef.current, model);
        });

        }
      }

  const detectFrame = (video, model) => {
    model.detect(video).then((predictions) => {
      renderPredictions(predictions);
      requestAnimationFrame(() => {        detectFrame(video, model);
      });
    });
  };

  const renderPredictions = (predictions) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    
    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      ctx.fillRect(x, y, textWidth + 4, parseInt(font, 10) + 4);
      
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
  
    });
  };

  useEffect(() => {
    runDetection();
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center bg-indigo-400">
      <video autoPlay ref={videoRef} 
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-8 border-dashed rounded-xl"
      />

      <canvas ref={canvasRef}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        width={500} 
        height={500}
      />
    </div>
  );
}
