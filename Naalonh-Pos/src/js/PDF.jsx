import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function PDF() {
  const [images, setImages] = useState([]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const imageList = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      imageList.push(canvas.toDataURL("image/png"));
    }

    setImages(imageList);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFile} />

      {images.map((img, i) => (
        <div key={i}>
          <p>Page {i + 1}</p>
          <img src={img} style={{ width: 300 }} />
        </div>
      ))}
    </div>
  );
}

export default PDF;
