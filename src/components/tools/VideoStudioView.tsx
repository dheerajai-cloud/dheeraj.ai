import React, { useState, useRef, useEffect } from 'react';
import {
  Clapperboard,
  Upload,
  Play,
  Pause,
  Volume2,
  Sparkles,
  RefreshCw,
  Film,
  Camera,
  Layers,
  Download,
  Check,
  Music,
  Video,
  Image as ImageIcon,
  X,
  Sliders,
} from 'lucide-react';
import { useI18n } from '../../utils/i18n';

interface VideoScene {
  sceneNumber: number;
  timestamp: string;
  visualDescription: string;
  cameraAngle: string;
  voiceover: string;
  onscreenText: string;
  soundDesign: string;
}

interface VideoStoryboardResult {
  title: string;
  concept: string;
  aspectRatio: string;
  estimatedDuration: string;
  colorPalette: string[];
  scenes: VideoScene[];
  musicRecommendation: string;
  exportSettings: {
    fps: number;
    resolution: string;
    aspect: string;
  };
}

export const VideoStudioView: React.FC = () => {
  const { t } = useI18n();

  const [prompt, setPrompt] = useState('');
  const [videoStyle, setVideoStyle] = useState('Cinematic 4K Commercial');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [targetDuration, setTargetDuration] = useState('30s');
  const [voiceTone, setVoiceTone] = useState('Deep, Inspiring & Confident');

  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string; type: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VideoStoryboardResult | null>(null);

  // Player state
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechActive, setSpeechActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: { name: string; url: string; type: string }[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newFiles.push({
        name: file.name,
        url,
        type: file.type.startsWith('video') ? 'video' : 'image',
      });
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeUploadedFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && uploadedFiles.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/video/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || `Create an impactful video based on ${uploadedFiles.map((f) => f.name).join(', ')}`,
          videoStyle,
          aspectRatio,
          targetDuration,
          voiceTone,
          hasUploadedMedia: uploadedFiles.length > 0,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
        setCurrentSceneIndex(0);
        setIsPlaying(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Canvas visual rendering simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result || !result.scenes[currentSceneIndex]) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;
    const activeScene = result.scenes[currentSceneIndex];

    const render = () => {
      tick += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      // Draw background dynamic gradient
      const grad = ctx.createLinearGradient(
        0,
        0,
        width * Math.sin(tick * 0.5) * 0.5 + width * 0.5,
        height
      );
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines / motion particles
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      // Draw active scene visualization badge
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.roundRect(30, 30, 240, 48, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#a5b4fc';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(
        `SCENE ${activeScene.sceneNumber} / ${result.scenes.length} • ${activeScene.timestamp}`,
        46,
        60
      );
      ctx.restore();

      // Camera Angle Tag
      ctx.save();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.roundRect(width - 250, 30, 220, 36, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`CAM: ${activeScene.cameraAngle}`, width - 240, 52);
      ctx.restore();

      // Cinematic center title or on-screen text
      ctx.save();
      const scale = 1 + 0.03 * Math.sin(tick * 1.5);
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(99, 102, 241, 0.8)';
      ctx.shadowBlur = 24;
      ctx.fillText(activeScene.onscreenText || result.title, 0, 0);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.shadowBlur = 0;
      ctx.fillText(activeScene.cameraAngle, 0, 36);
      ctx.restore();

      // Subtitle / Narration Bar at bottom
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.roundRect(40, height - 90, width - 80, 60, 10);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'italic 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      const truncatedVoiceover =
        activeScene.voiceover.length > 95
          ? activeScene.voiceover.slice(0, 95) + '...'
          : activeScene.voiceover;
      ctx.fillText(`"${truncatedVoiceover}"`, width / 2, height - 55);
      ctx.restore();

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [result, currentSceneIndex, isPlaying]);

  // Handle scene playback interval
  useEffect(() => {
    let interval: any;
    if (isPlaying && result) {
      interval = setInterval(() => {
        setCurrentSceneIndex((prev) => (prev + 1) % result.scenes.length);
      }, 4500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, result]);

  // Audio voiceover test using browser SpeechSynthesis
  const speakVoiceover = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speechActive) {
      setSpeechActive(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeechActive(false);
    utterance.onerror = () => setSpeechActive(false);
    setSpeechActive(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadScript = () => {
    if (!result) return;
    let formatted = `# ${result.title}\nConcept: ${result.concept}\nDuration: ${result.estimatedDuration}\nMusic: ${result.musicRecommendation}\n\n`;
    result.scenes.forEach((sc) => {
      formatted += `--- SCENE ${sc.sceneNumber} (${sc.timestamp}) ---\n`;
      formatted += `Camera: ${sc.cameraAngle}\n`;
      formatted += `Visual: ${sc.visualDescription}\n`;
      formatted += `Voiceover: "${sc.voiceover}"\n`;
      formatted += `On-Screen: ${sc.onscreenText}\n`;
      formatted += `Sound: ${sc.soundDesign}\n\n`;
    });

    const blob = new Blob([formatted], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/[^a-zA-Z0-9]/g, '_')}_storyboard.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-rose-900/30 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Clapperboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {t('tool_video_studio')}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                AI Timeline & Storyboard Engine
              </span>
            </h2>
            <p className="text-sm text-slate-400">
              Upload images or video clips, give your vision prompt, and generate cinematic scenes with camera directions and synced voiceovers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <Film className="w-4 h-4 text-purple-400" />
          <span>Multi-Angle 4K Direction</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-purple-400" />
              Video Creation Directives
            </h3>

            {/* Prompt */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Video Concept / Prompt *</span>
                <span
                  className="text-[11px] text-purple-400 cursor-pointer hover:underline"
                  onClick={() =>
                    setPrompt(
                      'A futuristic electric hypercar speeding across the neon-lit streets of Tokyo at midnight, showcasing sleek aerodynamic lines and next-gen holographic dashboard.'
                    )
                  }
                >
                  Try Example
                </span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create (e.g. dynamic product commercial, viral short, cinematic trailer, educational explainer)..."
                rows={3}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-y"
              />
            </div>

            {/* Media Upload Area (Image or Video) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Upload Reference Media (Images / Clips)</span>
                <span className="text-[11px] text-slate-400">Optional</span>
              </label>

              <label className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 group">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-slate-500 group-hover:text-purple-400 mb-2 transition-colors" />
                <span className="text-xs text-slate-300 font-medium">Click or drag photos & video frames</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, MP4, WebM</span>
              </label>

              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                    >
                      {file.type === 'video' ? (
                        <Video className="w-3.5 h-3.5 text-purple-400" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                      )}
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      <button
                        onClick={() => removeUploadedFile(idx)}
                        className="text-slate-500 hover:text-rose-400 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Aspect Ratio & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="16:9">16:9 (Landscape YouTube)</option>
                  <option value="9:16">9:16 (Vertical Reels / TikTok)</option>
                  <option value="1:1">1:1 (Square Instagram)</option>
                  <option value="4:5">4:5 (Social Feed)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Visual Style
                </label>
                <select
                  value={videoStyle}
                  onChange={(e) => setVideoStyle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option>Cinematic 4K Commercial</option>
                  <option>High-Energy Viral Short</option>
                  <option>Minimalist Tech Showcase</option>
                  <option>Cyberpunk Neon Future</option>
                  <option>Documentary Narrative</option>
                  <option>Pixar 3D CGI Animation</option>
                </select>
              </div>
            </div>

            {/* Target Duration & Voice Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Target Duration
                </label>
                <select
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="15s">15 Seconds (Punchy Hook)</option>
                  <option value="30s">30 Seconds (Commercial)</option>
                  <option value="60s">60 Seconds (Detailed Story)</option>
                  <option value="90s">90 Seconds (Full Showcase)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Narration Voice Tone
                </label>
                <select
                  value={voiceTone}
                  onChange={(e) => setVoiceTone(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option>Deep, Inspiring & Confident</option>
                  <option>Energetic & Upbeat Creator</option>
                  <option>Warm & Friendly Storyteller</option>
                  <option>Futuristic AI Synthesizer</option>
                  <option>Calm & Thoughtful Luxury</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || (!prompt.trim() && uploadedFiles.length === 0)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Directing Video & Storyboard...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create AI Video Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Preview & Storyboard Column */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Interactive Player Screen */}
              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
                <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                      Interactive Scene Canvas
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({result.aspectRatio} • {result.estimatedDuration})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                        isPlaying
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
                    </button>

                    <button
                      onClick={handleDownloadScript}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Plan</span>
                    </button>
                  </div>
                </div>

                <div className="relative bg-black flex items-center justify-center p-2">
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={360}
                    className="w-full max-h-[360px] object-contain rounded-lg border border-slate-800 shadow-2xl"
                  />
                </div>

                {/* Scene navigation strip */}
                <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-2">
                    {result.scenes.map((scene, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentSceneIndex(idx);
                          setIsPlaying(false);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                          currentSceneIndex === idx
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        <span>Scene {scene.sceneNumber}</span>
                        <span className="text-[10px] opacity-75">{scene.timestamp}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => speakVoiceover(result.scenes[currentSceneIndex].voiceover)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all whitespace-nowrap ${
                      speechActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{speechActive ? 'Speaking...' : 'Listen Voiceover'}</span>
                  </button>
                </div>
              </div>

              {/* Scene Breakdown Detail Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Scene-by-Scene Production Direction
                  </h4>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-pink-400" />
                    <span>{result.musicRecommendation}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {result.scenes.map((scene, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        currentSceneIndex === idx
                          ? 'bg-purple-950/20 border-purple-500/50 shadow-lg'
                          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                      }`}
                      onClick={() => setCurrentSceneIndex(idx)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-mono font-semibold">
                            Scene {scene.sceneNumber}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{scene.timestamp}</span>
                        </div>
                        <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {scene.cameraAngle}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed mb-2.5">
                        <strong className="text-purple-300">Visual: </strong>
                        {scene.visualDescription}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/60">
                        <div className="text-slate-400">
                          <span className="text-slate-300 font-semibold">Audio Narration: </span>
                          "{scene.voiceover}"
                        </div>
                        <div className="text-slate-400">
                          <span className="text-slate-300 font-semibold">Sound Design: </span>
                          {scene.soundDesign}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-slate-800 min-h-[460px]">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Film className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-semibold text-white">Direct Your Next Video</h4>
                <p className="text-xs text-slate-400">
                  Enter your prompt or upload pictures/clips to generate full cinematic storyboards, automated camera movements, and audio narrations.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] text-slate-500">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ 4K Commercials</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ Social 9:16 Shorts</span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">✓ Browser Voiceover Synthesis</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
