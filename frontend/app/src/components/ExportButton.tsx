import { FiDownload } from "react-icons/fi";
import * as htmlToImage from 'html-to-image';
import { useReactFlow, getNodesBounds, getViewportForBounds } from '@xyflow/react';

export const ExportButton = () => {
  const { getNodes } = useReactFlow();

  async function GenerateImage() {
    const nodes = getNodes();
    if (nodes.length === 0) return;

    const nodesBounds = getNodesBounds(nodes);

    // Use the actual viewport element dimensions for width/height
    const viewportEl = document.querySelector(".react-flow__viewport") as HTMLElement;
    if (!viewportEl) return;

    const container = viewportEl.closest(".react-flow") as HTMLElement;
    const width = container?.offsetWidth ?? 1920;
    const height = container?.offsetHeight ?? 1080;

    const viewport = getViewportForBounds(
      nodesBounds,
      width,
      height,
      0.1,
      2,
      32
    );

    const dataUrl = await htmlToImage.toPng(viewportEl, {
      backgroundColor: "#ffffff",
      width,
      height,
      pixelRatio: 3,   // sharpness multiplier — 2 or 3 is enough
      style: {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        transformOrigin: "top left",
      },
    });

    const link = document.createElement("a");
    link.download = `${Date.now()}_diagram.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <button
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
      onClick={GenerateImage}
    >
      <FiDownload size={14} />
      Export
    </button>
  );
};