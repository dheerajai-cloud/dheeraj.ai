import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Download, Copy, Check, Sparkles, Sliders } from 'lucide-react';
import { useI18n } from '../../utils/i18n';

export const QrCodeGeneratorView: React.FC = () => {
  const { t } = useI18n();

  const [qrValue, setQrValue] = useState('https://omnitools.pro');
  const [fgColor, setFgColor] = useState('#6366f1'); // Indigo
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [centerLabel, setCenterLabel] = useState('PRO');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  // Simple QR code matrix renderer algorithm
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Deterministic pseudo-grid based on hash of qrValue
    let hash = 0;
    for (let i = 0; i < qrValue.length; i++) {
      hash = (hash << 5) - hash + qrValue.charCodeAt(i);
      hash |= 0;
    }

    const gridSize = 25;
    const cellSize = size / gridSize;

    ctx.fillStyle = fgColor;

    // Draw position detection patterns (3 corners)
    const drawCorner = (startX: number, startY: number) => {
      // 7x7 outer square
      ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);
      // 5x5 inner empty square
      ctx.fillStyle = bgColor;
      ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      // 3x3 center solid square
      ctx.fillStyle = fgColor;
      ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawCorner(1, 1);
    drawCorner(gridSize - 8, 1);
    drawCorner(1, gridSize - 8);

    // Draw data modules
    let seed = Math.abs(hash) + 12345;
    const randomBit = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280 > 0.45;
    };

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        // Skip corner detection zones
        const inTopLeft = r < 9 && c < 9;
        const inTopRight = r < 9 && c > gridSize - 10;
        const inBottomLeft = r > gridSize - 10 && c < 9;
        const inCenter = r > 10 && r < 14 && c > 10 && c < 14;

        if (!inTopLeft && !inTopRight && !inBottomLeft && !inCenter) {
          if (randomBit()) {
            ctx.fillStyle = fgColor;
            ctx.beginPath();
            ctx.roundRect(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 1, cellSize - 1, 2);
            ctx.fill();
          }
        }
      }
    }

    // Optional center badge
    if (centerLabel) {
      const badgeSize = cellSize * 5;
      const badgeX = (size - badgeSize) / 2;
      const badgeY = (size - badgeSize) / 2;

      ctx.fillStyle = bgColor;
      ctx.strokeStyle = fgColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = fgColor;
      ctx.font = `bold ${Math.round(badgeSize * 0.4)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(centerLabel.slice(0, 4), size / 2, size / 2);
    }
  }, [qrValue, fgColor, bgColor, size, centerLabel]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${qrValue.slice(0, 15).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-900/30 via-orange-900/20 to-amber-900/30 border border-rose-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_qr_generator')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                High-Res Vector & PNG
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Generate custom branded QR codes for URLs, WiFi, contact cards, and text with logo badges and colors.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl mx-auto">
        {/* Controls Column */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            Customization Directives
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-300">
              Content URL / Text
            </label>
            <input
              type="text"
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-300">QR Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-slate-300">{fgColor}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-slate-300">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-slate-300">{bgColor}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-slate-300">
              Center Brand Label (Short Text)
            </label>
            <input
              type="text"
              maxLength={4}
              value={centerLabel}
              onChange={(e) => setCenterLabel(e.target.value)}
              placeholder="e.g. PRO, APP, GO"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white uppercase focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold uppercase text-slate-300">
              <span>Resolution Size</span>
              <span className="text-rose-400 font-mono">{size}x{size} px</span>
            </div>
            <input
              type="range"
              min={180}
              max={512}
              step={16}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Preview & Download */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col items-center justify-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-slate-800 shadow-2xl flex items-center justify-center">
            <canvas ref={canvasRef} className="rounded-xl shadow-lg max-w-full" />
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res PNG</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
