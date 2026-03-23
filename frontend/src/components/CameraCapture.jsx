import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

const CameraCapture = ({ userId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [nutritionData, setNutritionData] = useState(null);
  const [caloriesToBurn, setCaloriesToBurn] = useState(0);
  const [stepsNeeded, setStepsNeeded] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      stopCamera();
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
    } catch {
      setError("Error accessing camera.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (imageURL) URL.revokeObjectURL(imageURL);
    };
  }, [imageURL]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.png", { type: "image/png" });
      setImage(file);
      setImageURL(URL.createObjectURL(file));
    });
  };

  const sendImageToBackend = async () => {
    if (!image) return setError("No image");
    if (!userId) return setError("User ID missing");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `http://localhost:5001/api/ocr/${userId}`,
        formData
      );

      setOcrResult(res.data.text || "");
      setNutritionData(res.data.nutrition || {});
      setCaloriesToBurn(res.data.caloriesToBurn || 0);
      setStepsNeeded(res.data.stepsNeeded || 0);
    } catch {
      setError("Error processing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">

      {/* VIDEO */}
      <div className="w-full max-w-sm rounded-xl overflow-hidden border border-gray-700 bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-auto"
        />
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        <button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold">
          {stream ? "Camera Ready ✅" : "Start Camera"}
        </button>

        <button onClick={captureImage} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold">
          Capture 📸
        </button>

        <button onClick={stopCamera} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold">
          Stop ⏹
        </button>

        <button onClick={sendImageToBackend} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold">
          {loading ? "Scanning..." : "Scan 📝"}
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* IMAGE PREVIEW */}
      {imageURL && (
        <div className="mt-6 text-center">
          <p className="mb-2 text-gray-300">Captured Image</p>
          <img
            src={imageURL}
            className="mx-auto w-56 rounded-lg border border-gray-600"
          />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-500 mt-3 font-medium">{error}</p>
      )}

      {/* OCR RESULT */}
      {ocrResult && (
        <div className="w-full max-w-xl mt-6 bg-white text-black p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-2">Extracted Text</h3>
          <p className="text-sm break-words">{ocrResult}</p>
        </div>
      )}

      {/* NUTRITION */}
      {nutritionData && Object.keys(nutritionData).length > 0 && (
        <div className="w-full max-w-xl mt-4 bg-white text-black p-4 rounded-xl shadow-md">
          <h3 className="font-semibold mb-2">Nutrition Data</h3>
          <ul className="space-y-1 text-sm">
            {Object.entries(nutritionData).map(([k, v]) => (
              <li key={k}>
                <span className="font-semibold capitalize">{k}:</span> {v ?? "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* EXTRA */}
      {caloriesToBurn > 0 && (
        <div className="w-full max-w-xl mt-4 bg-white text-black p-4 rounded-xl shadow-md">
          <p>🔥 Calories to Burn: {caloriesToBurn}</p>
          <p>🚶 Steps Needed: {stepsNeeded}</p>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;