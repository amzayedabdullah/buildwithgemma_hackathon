'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mic, Volume2, Sparkles, CheckCircle2, Loader2, Play, Square, AlertCircle } from 'lucide-react';
import { REGIONAL_AUDIO_PRESETS } from '../data/mockData';
import { parseSpokenBanglaTransaction } from '../services/gemmaService';
import { GemmaIntentResult } from '../types/ledger';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (result: GemmaIntentResult, dialect?: string, transcript?: string) => void;
  apiKey: string;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  apiKey,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<GemmaIntentResult | null>(null);
  const [selectedDialect, setSelectedDialect] = useState('Standard Bangla');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePlayingPresetId, setActivePlayingPresetId] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Define stop recording handler before useEffect to fix hoisting ReferenceError
  const handleStopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      handleStopRecording();
      setTranscript('');
      setParsedResult(null);
      setMicError(null);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }
  }, [isOpen, handleStopRecording]);

  if (!isOpen) return null;

  // Real Bangla Voice Audio Playback using SpeechSynthesis API
  const handlePlayPresetVoice = (e: React.MouseEvent, preset: (typeof REGIONAL_AUDIO_PRESETS)[0]) => {
    e.stopPropagation();
    setSelectedDialect(preset.dialect);
    setTranscript(preset.transcript);
    setParsedResult(null);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setActivePlayingPresetId(preset.id);
      setIsPlayingAudio(true);

      const utterance = new SpeechSynthesisUtterance(preset.transcript);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setActivePlayingPresetId(null);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setActivePlayingPresetId(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Real Speech Synthesis for spoken transcript
  const handleListenTranscriptVoice = () => {
    if (!transcript) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.95;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Real Live Microphone Speech Recognition (Web Speech API)
  const handleStartRecording = () => {
    setMicError(null);
    setTranscript('');
    setParsedResult(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('আপনার ব্রাউজারে ভয়েস রিকগনিশন সমর্থন করে না। (Chrome/Edge ব্যবহার করার পরামর্শ দেওয়া হচ্ছে)');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setTranscript(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('মাইক্রোফোন ব্যবহারের অনুমতি দিন');
        } else if (event.error === 'no-speech') {
          setMicError('কোনো কথা শোনা যায়নি। আবার চেষ্টা করুন।');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setMicError('মাইক্রোফোন চালু করতে সমস্যা হয়েছে');
      setIsRecording(false);
    }
  };

  const handleProcessWithGemma = async () => {
    if (!transcript) return;
    setIsProcessing(true);
    try {
      const result = await parseSpokenBanglaTransaction(transcript, apiKey);
      setParsedResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmTransaction = () => {
    if (parsedResult) {
      onAddTransaction(parsedResult, selectedDialect, transcript);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">রিয়েল ভয়েসে হিসাব নথিভুক্ত করুন</h3>
              <p className="text-xs text-slate-400">মাইক্রোফোনে রিয়েল বাংলা ভয়েসে কথা বলুন বা ভয়েস স্যাম্পল শুনুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Audio Presets Quick-Selector for Judges with Real Voice Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 block">
                💡 হ্যাকাথন জাজ টেস্ট (আঞ্চলিক ভাষার রিয়েল ভয়েস প্লে করুন):
              </label>
              {isPlayingAudio && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold animate-pulse">
                  <Volume2 className="w-3 h-3" /> অডিও বাজছে...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REGIONAL_AUDIO_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    setSelectedDialect(preset.dialect);
                    setTranscript(preset.transcript);
                    setParsedResult(null);
                  }}
                  className={`text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer flex items-center justify-between ${
                    transcript === preset.transcript
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex-1 pr-2">
                    <div className="font-semibold text-slate-200">{preset.label}</div>
                    <p className="text-slate-400 line-clamp-1 italic mt-0.5">"{preset.transcript}"</p>
                  </div>

                  <button
                    onClick={(e) => handlePlayPresetVoice(e, preset)}
                    className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 transition-all border border-emerald-500/30 shrink-0"
                    title="রিয়েল অডিও শুনুন"
                  >
                    {activePlayingPresetId === preset.id ? (
                      <Volume2 className="w-4 h-4 animate-bounce" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Record Button & Real Audio Waveform Area */}
          <div className="flex flex-col items-center justify-center py-6 bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 relative overflow-hidden">
            {isRecording && (
              <div className="absolute inset-0 bg-emerald-500/5 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full border border-emerald-500/20 animate-ping opacity-20" />
              </div>
            )}

            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all transform active:scale-90 z-10 ${
                isRecording
                  ? 'bg-rose-500 shadow-rose-500/50 text-white animate-pulse'
                  : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/30 hover:scale-105 text-slate-950'
              }`}
            >
              {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
            </button>

            <p className="text-sm mt-4 text-slate-300 font-bold z-10">
              {isRecording ? 'রিয়েল ভয়েসে কথা বলুন... (থামাতে ক্লিক করুন)' : 'মাইক্রোফোনে ক্লিক করে রিয়েল বাংলা বলুন'}
            </p>

            {micError && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{micError}</span>
              </div>
            )}

            {/* Live Transcript Box */}
            <div className="w-full mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 min-h-[90px] text-sm text-slate-200 relative">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>লাইভ অডিও ট্রান্সক্রিপ্ট:</span>
                {transcript && (
                  <button
                    onClick={handleListenTranscriptVoice}
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>ভয়েসে শুনুন</span>
                  </button>
                )}
              </div>

              {transcript ? (
                <p className="text-slate-100 font-medium italic">"{transcript}"</p>
              ) : (
                <p className="text-slate-500 text-center py-2">
                  বলা কথা এখানে লাইভ বাংলায় দেখা যাবে...
                </p>
              )}
            </div>

            {/* Process Button */}
            {transcript && !parsedResult && (
              <button
                onClick={handleProcessWithGemma}
                disabled={isProcessing}
                className="mt-4 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all z-10"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemma 4 AI দিয়ে হিসাব বের হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gemma 4 AI দিয়ে হিসাব প্রসেস করুন</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Parsed Result Display Card */}
          {parsedResult && (
            <div className="bg-slate-800/80 border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-bold text-white text-base">Gemma 4 সনাক্তকৃত রিয়েল হিসাব</h4>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 font-semibold">
                  কনফিডেন্স: {(parsedResult.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 block">কাস্টমার</span>
                  <span className="font-bold text-emerald-300 text-sm">{parsedResult.customerName}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 block">মোট পরিমাণ</span>
                  <span className="font-bold text-white text-sm">৳ {parsedResult.totalAmount}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 block">নগদ শোধ</span>
                  <span className="font-bold text-teal-400 text-sm">৳ {parsedResult.cashPaid}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 block">নিট বাকি</span>
                  <span className="font-bold text-amber-400 text-sm">৳ {parsedResult.netBaki}</span>
                </div>
              </div>

              <div className="text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
                <span className="text-slate-400 font-semibold block mb-1">Gemma 4 AI বিশ্লেষণ:</span>
                <p className="text-slate-300">{parsedResult.reasoningBangla}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            বাতিল
          </button>
          <button
            onClick={handleConfirmTransaction}
            disabled={!parsedResult}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all"
          >
            খাতায় যোগ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
