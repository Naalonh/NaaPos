import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import Buttondownload from "./common/Buttondownload";

interface CropModalProps {
  image: string;
  onSave: (croppedImage: string) => void;
  onClose: () => void;
}

const CropModal: React.FC<CropModalProps> = ({ image, onSave, onClose }) => {
  const [processedImage, setProcessedImage] = useState<string>(image);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [removing, setRemoving] = useState<boolean>(false);

  const onCropComplete = useCallback((_burnedArea: Area, burnedAreaPixels: Area) => {
    setCroppedAreaPixels(burnedAreaPixels);
  }, []);

  const createCroppedImage = async (): Promise<void> => {
    try {
      const croppedImage = await getCroppedImg(processedImage, croppedAreaPixels);
      onSave(croppedImage);
    } catch (e) {
      console.error("Crop Error:", e);
    }
  };

  const removeBg = async (): Promise<void> => {
    if (removing) return;
    setRemoving(true);

    try {
      const blob = await fetch(processedImage).then((r) => r.blob());

      const formData = new FormData();
      formData.append("image", blob);

      const response = await fetch("http://localhost:8081/api/image/remove-bg", {
        method: "POST",
        body: formData,
      });

      const resultBlob = await response.blob();
      const newImage = URL.createObjectURL(resultBlob);

      setProcessedImage(newImage);
    } catch (error) {
      console.error("BG Remove Error:", error);
    }

    setRemoving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-5000">
      <div className="bg-white w-[90%] max-w-112.5 rounded-3xl p-6 flex flex-col gap-5">

        {/* Header */}
        <div>
          <h3 className="m-0 font-[Outfit,sans-serif] text-slate-800 font-semibold text-lg">
            Adjust Image
          </h3>
          <p className="text-sm text-slate-500 mt-1 mb-0">
            Drag to reposition or scroll to zoom
          </p>
        </div>

        {/* Cropper */}
        <div className="relative w-full h-75 bg-[#333] rounded-xl overflow-hidden">
          <Cropper
            image={processedImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Zoom Slider */}
        <div>
          <input
            type="range"
            value={zoom}
            min={1}
            max={5}
            step={0.1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZoom(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* BG Remover Button */}
        <Buttondownload
          title={removing ? "Removing..." : "BG Remover"}
          successTitle="Removed"
          onClick={() => !removing && removeBg()}
        />

        {/* Footer */}
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 py-3 rounded-xl font-semibold cursor-pointer bg-slate-100 border-none text-slate-600 hover:bg-slate-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-xl font-semibold cursor-pointer bg-indigo-500 border-none text-white hover:bg-indigo-600 transition-colors"
            onClick={createCroppedImage}
          >
            Apply Crop
          </button>
        </div>

      </div>
    </div>
  );
};

export default CropModal;