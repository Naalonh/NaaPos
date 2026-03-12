import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import "../css/CropModal.css";
import getCroppedImg from "../utils/cropImage";
import Buttondownload from "./common/Buttondownload";

const CropModal = ({ image, onSave, onClose }) => {
  const [processedImage, setProcessedImage] = useState(image);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [removing, setRemoving] = useState(false);

  const onCropComplete = useCallback((burnedArea, burnedAreaPixels) => {
    setCroppedAreaPixels(burnedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        processedImage,
        croppedAreaPixels,
      );
      onSave(croppedImage);
    } catch (e) {
      console.error("Crop Error:", e);
    }
  };

  const removeBg = async () => {
    if (removing) return;
    setRemoving(true);

    try {
      const blob = await fetch(processedImage).then((r) => r.blob());

      const formData = new FormData();
      formData.append("image", blob);

      const response = await fetch(
        "http://localhost:8081/api/image/remove-bg",
        {
          method: "POST",
          body: formData,
        },
      );

      const resultBlob = await response.blob();
      const newImage = URL.createObjectURL(resultBlob);

      setProcessedImage(newImage);
    } catch (error) {
      console.error("BG Remove Error:", error);
    }

    setRemoving(false);
  };

  return (
    <div className="crop-modal-overlay">
      <div className="crop-modal-container">
        <div className="crop-header">
          <h3>Adjust Image</h3>
          <p>Drag to reposition or scroll to zoom</p>
        </div>

        <div className="cropper-wrapper">
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

        <div className="crop-controls">
          <input
            type="range"
            value={zoom}
            min={1}
            max={5}
            step={0.1}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="zoom-slider"
          />
        </div>
        <Buttondownload
          title={removing ? "Removing..." : "BG Remover"}
          successTitle="Removed"
          onClick={() => !removing && removeBg()}
        />
        <div className="crop-footer">
          <button type="button" className="crop-cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className="crop-save-btn"
            onClick={createCroppedImage}>
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
