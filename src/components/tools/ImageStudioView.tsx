import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Maximize2,
  X,
  Layers,
  Palette,
  Eye,
  Camera,
  SunMedium,
} from 'lucide-react';
import { useI18n } from '../../utils/i18n';

interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  enhancedPrompt: string;
  style: string;
  aspectRatio: string;
  timestamp: string;
  meta?: {
    lighting?: string;
    camera?: string;
    dimensions?: string;
  };
}

export const ImageStudioView: React.FC = () => {
  const { t } = useI18n();

  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic 8K Masterpiece');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [lighting, setLighting] = useState('Cinematic Volumetric Lighting');
  const [cameraLens, setCameraLens] = useState('85mm Portrait Lens f/1.4');
  const [negativePrompt, setNegativePrompt] = useState('blurry, deformed, oversaturated, low resolution, artifacts');

  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceName, setReferenceName] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImageItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReferenceName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReferenceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !referenceImage) return;
    setLoading(true);

    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${prompt} (${lighting}, ${cameraLens})`,
          style,
          aspectRatio,
          negativePrompt,
          referenceImageBase64: referenceImage,
        }),
      });

      const json = await res.json();
      if (json.success && json.imageUrl) {
        const newItem: GeneratedImageItem = {
          id: Date.now().toString(),
          url: json.imageUrl,
          prompt,
          enhancedPrompt: json.enhancedPrompt || prompt,
          style,
          aspectRatio,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          meta: json.meta || {
            lighting,
            camera: cameraLens,
            dimensions: aspectRatio === '16:9' ? '1280x720' : '1024x1024',
          },
        };

        setGallery((prev) => [newItem, ...prev]);
        setSelectedImage(newItem);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imgUrl: string, name: string) => {
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `omnitools_${name.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.click();
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-900/30 via-orange-900/20 to-red-900/30 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_image_studio')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                8K Ultra Visual Studio
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Transform ideas and reference photos into hyper-detailed renders, anime art, or studio photography with custom aspect ratios.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Palette className="w-4 h-4 text-amber-400" />
          <span>Image-to-Image & Style Transfer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-amber-400" />
              Image Art Directives
            </h3>

            {/* Prompt input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Prompt / Visual Vision *</span>
                <span
                  className="text-[11px] text-amber-400 cursor-pointer hover:underline"
                  onClick={() =>
                    setPrompt(
                      'A majestic cybernetic falcon perched atop a glass skyscraper overlooking a rain-drenched neon metropolis at dusk, intricate golden circuit feathers, sharp 8K reflections'
                    )
                  }
                >
                  Try Example
                </span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your subject, atmosphere, colors, materials, and fine details..."
                rows={3}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-y"
              />
            </div>

            {/* Reference Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Upload Reference Photo / Style Base</span>
                <span className="text-[11px] text-slate-400">Optional</span>
              </label>

              {referenceImage ? (
                <div className="relative rounded-xl border border-amber-500/30 overflow-hidden bg-slate-950 p-2 flex items-center gap-3">
                  <img
                    src={referenceImage}
                    alt="Reference preview"
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-200 truncate">{referenceName}</div>
                    <div className="text-[11px] text-emerald-400">Reference active for style transfer</div>
                  </div>
                  <button
                    onClick={() => {
                      setReferenceImage(null);
                      setReferenceName(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-slate-500 group-hover:text-amber-400 mb-1 transition-colors" />
                  <span className="text-xs text-slate-300 font-medium">Click or drop reference image</span>
                  <span className="text-[10px] text-slate-500">AI guides output using your reference structure</span>
                </label>
              )}
            </div>

            {/* Style Preset & Aspect Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Visual Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option>Photorealistic 8K Masterpiece</option>
                  <option>3D Pixar / Disney CGI Render</option>
                  <option>Cyberpunk Neon Blade Runner</option>
                  <option>Studio High-Fashion Portrait</option>
                  <option>Japanese Anime Studio Ghibli</option>
                  <option>Vintage 35mm Film Grain (Kodak)</option>
                  <option>Textured Oil Painting on Canvas</option>
                  <option>Dark Moody Cinematic Lighting</option>
                  <option>Minimalist Vector Illustration</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="1:1">1:1 Square (Instagram)</option>
                  <option value="16:9">16:9 Cinema Landscape (YouTube/TV)</option>
                  <option value="9:16">9:16 Vertical Story (Reels / TikTok)</option>
                  <option value="4:3">4:3 Classic Photo</option>
                  <option value="3:4">3:4 Vertical Portrait</option>
                </select>
              </div>
            </div>

            {/* Lighting & Camera Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                  <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                  Lighting Style
                </label>
                <select
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option>Cinematic Volumetric God-Rays</option>
                  <option>Golden Hour Sunset Warmth</option>
                  <option>Studio Softbox Diffusion</option>
                  <option>Cyber Neon Rim Glow</option>
                  <option>Dramatic Chiaroscuro Shadows</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  Lens / Camera
                </label>
                <select
                  value={cameraLens}
                  onChange={(e) => setCameraLens(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option>85mm Portrait Lens f/1.4</option>
                  <option>24mm Ultra-Wide Angle</option>
                  <option>100mm Macro Close-Up</option>
                  <option>50mm Prime Natural Eye</option>
                  <option>Anamorphic Cinema Scope</option>
                </select>
              </div>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Negative Prompt (Elements to Exclude)
              </label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || (!prompt.trim() && !referenceImage)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Artwork...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Masterpiece</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Gallery & Detail Column */}
        <div className="lg:col-span-7 space-y-6">
          {selectedImage ? (
            <div className="space-y-6">
              {/* Primary Active Image Display */}
              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 p-4 space-y-4">
                <div className="relative group bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center max-h-[440px]">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    className="w-full h-full object-contain max-h-[440px] rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                  />

                  {/* Quick Action Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownload(selectedImage.url, selectedImage.prompt)}
                      className="p-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center gap-1 text-xs px-2.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleCopyPrompt(selectedImage.enhancedPrompt, selectedImage.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs flex items-center gap-1 px-2"
                      title="Copy Prompt"
                    >
                      {copiedId === selectedImage.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Metadata & Prompt Details */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {selectedImage.style}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Aspect: {selectedImage.aspectRatio}</span>
                      <span>•</span>
                      <span>{selectedImage.meta?.dimensions || '1024x1024'}</span>
                      <span>•</span>
                      <span>{selectedImage.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-normal">
                    <strong className="text-slate-400">Prompt: </strong>
                    {selectedImage.prompt}
                  </p>

                  {selectedImage.meta && (
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-500">Lighting: </span>
                        {selectedImage.meta.lighting}
                      </div>
                      <div>
                        <span className="text-slate-500">Camera / Lens: </span>
                        {selectedImage.meta.camera}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Grid of Generations */}
              {gallery.length > 1 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Generated Gallery ({gallery.length})
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {gallery.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedImage(item)}
                        className={`relative rounded-xl overflow-hidden aspect-square border cursor-pointer group transition-all ${
                          selectedImage.id === item.id
                            ? 'border-amber-500 ring-2 ring-amber-500/30 scale-102'
                            : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                          <span className="text-[10px] text-white truncate font-medium">{item.style}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-slate-800 min-h-[460px]">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-semibold text-white">Visual Canvas Waiting</h4>
                <p className="text-xs text-slate-400">
                  Write your prompt on the left, optionally upload a reference photo for structure, and click "Generate Masterpiece".
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] text-slate-500">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ 8K Ultra Photorealism</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ Style Transfer Ready</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ Custom Aspect Ratios</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
