import React, { useState, useRef } from 'react';
import {
  FileText,
  MessageSquare,
  Image,
  Link as LinkIcon,
  Upload,
  Sparkles,
  AlertCircle,
  ArrowRight,
  X,
  FileCheck
} from 'lucide-react';
import { DemoCase } from '../types/investigation';

interface OpportunityIntakeProps {
  onInvestigate: (payload: { text?: string; file?: File; url?: string }) => void;
  isLoading: boolean;
  demos: DemoCase[];
}

export const OpportunityIntake: React.FC<OpportunityIntakeProps> = ({
  onInvestigate,
  isLoading,
  demos
}) => {
  const [activeMode, setActiveMode] = useState<'text' | 'document' | 'image' | 'url'>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setInputError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setInputError(null);
    }
  };

  const handleLoadDemo = (demo: DemoCase) => {
    setActiveMode('text');
    setTextInput(demo.content);
    setSelectedFile(null);
    setUrlInput('');
    setInputError(null);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(null);

    if (activeMode === 'text') {
      if (!textInput.trim()) {
        setInputError('Please paste the opportunity message or email text.');
        return;
      }
      onInvestigate({ text: textInput });
    } else if (activeMode === 'document' || activeMode === 'image') {
      if (!selectedFile) {
        setInputError('Please select or drag-and-drop a file to investigate.');
        return;
      }
      onInvestigate({ file: selectedFile });
    } else if (activeMode === 'url') {
      if (!urlInput.trim()) {
        setInputError('Please provide a valid opportunity URL.');
        return;
      }
      try {
        new URL(urlInput.trim());
      } catch {
        setInputError('Please enter a valid URL (including https://).');
        return;
      }
      onInvestigate({ url: urlInput.trim() });
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-xs font-mono">
            <span>INTAKE STATION // SECURE EVIDENCE COLLECTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Investigate an Opportunity
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Paste the message, upload the offer document, or provide a URL for AI risk triage.
          </p>
        </div>

        {/* Quick Demo Pre-fills */}
        <div className="mb-6 pb-5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Curated Test Cases:</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {demos.map((demo) => {
              const isHighRisk = demo.badge === 'HIGH RISK';
              const isLowRisk = demo.badge === 'LOW RISK';
              return (
                <button
                  key={demo.id}
                  onClick={() => handleLoadDemo(demo)}
                  type="button"
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 font-medium ${
                    isHighRisk
                      ? 'bg-rose-950/40 border-rose-800/40 text-rose-300 hover:bg-rose-900/60 hover:border-rose-700'
                      : isLowRisk
                      ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-700'
                      : 'bg-amber-950/40 border-amber-800/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{demo.title.split('(')[0].trim()}</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-black/40 border border-white/10">
                    {demo.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveMode('text');
              setInputError(null);
            }}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeMode === 'text'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Paste Text</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('document');
              setInputError(null);
            }}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeMode === 'document'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Upload Document</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('image');
              setInputError(null);
            }}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeMode === 'image'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Screenshot OCR</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('url');
              setInputError(null);
            }}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              activeMode === 'url'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Analyze URL</span>
          </button>
        </div>

        {/* Input Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mode 1: Text Ingestion */}
          {activeMode === 'text' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Offer Letter, Email Body, WhatsApp Message, or DM Text:</span>
                <span className="font-mono text-[11px] text-slate-500">
                  {textInput.length} chars
                </span>
              </div>
              <textarea
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  if (inputError) setInputError(null);
                }}
                rows={7}
                placeholder="Paste the suspicious offer letter, internship message, recruiter email, or DM here..."
                className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y"
              />
            </div>
          )}

          {/* Mode 2: Document Ingestion */}
          {activeMode === 'document' && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm text-slate-200">{selectedFile.name}</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB — Ready to parse
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-xs text-rose-400 hover:underline flex items-center space-x-1 mt-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove file</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    Click to browse or drag and drop offer letter
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Supports PDF, DOCX, or TXT documents (Max 15MB)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Screenshot Ingestion (OCR) */}
          {activeMode === 'image' && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : selectedFile
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-sm text-slate-200">{selectedFile.name}</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB — OCR Ready
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-xs text-rose-400 hover:underline flex items-center space-x-1 mt-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove image</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <Image className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    Upload Screenshot (WhatsApp, Telegram, or Scanned Offer)
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    PNG, JPG, JPEG, or WEBP (OCR text extraction enabled)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Mode 4: URL Ingestion */}
          {activeMode === 'url' && (
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Opportunity, Job Board, or Career Portal URL:</label>
              <div className="relative">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  placeholder="https://company-careers-example.com/jobs/intern-application..."
                  className="w-full p-4 pl-11 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <LinkIcon className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                ScamCheck securely inspects destination headers and text without executing client scripts.
              </p>
            </div>
          )}

          {/* Error Message */}
          {inputError && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Ctrl + Enter</kbd> to launch
            </span>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>INITIALIZING INVESTIGATION...</span>
                </>
              ) : (
                <>
                  <span>INITIATE INVESTIGATION</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
