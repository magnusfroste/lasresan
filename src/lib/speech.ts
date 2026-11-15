/**
 * Uppläsning via webbläsarens egen Web Speech API (sv-SE).
 * Inga nätverksanrop, inga cookies – rösten finns i webbläsaren eller
 * operativsystemet. Saknas stödet visas ingen uppläsningsknapp.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const isSpeechSupported = (): boolean =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  typeof window.SpeechSynthesisUtterance !== "undefined";

const pickSwedishVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined => {
  const swedish = voices.filter((v) => v.lang?.toLowerCase().startsWith("sv"));
  if (swedish.length === 0) return undefined;
  // Föredra en röst som är markerad som standard, annars första svenska.
  return swedish.find((v) => v.default) ?? swedish[0];
};

/** Delar upp texten i meningar så att uppläsningen blir jämn och kan stoppas snabbt. */
const splitSentences = (text: string): string[] => {
  const parts = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  // Slå ihop alltför korta bitar så att rösten inte hackar.
  const out: string[] = [];
  for (const part of parts) {
    const last = out[out.length - 1];
    if (last && last.length < 24) out[out.length - 1] = `${last} ${part}`;
    else out.push(part);
  }
  return out.length ? out : [text];
};

export type SpeechController = {
  supported: boolean;
  speaking: boolean;
  voiceLabel: string | null;
  toggle: (text: string) => void;
  stop: () => void;
};

export const useSpeech = (): SpeechController => {
  const supported = useMemo(isSpeechSupported, []);
  const [speaking, setSpeaking] = useState(false);
  const [voiceLabel, setVoiceLabel] = useState<string | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const stoppedRef = useRef(false);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      voicesRef.current = synth.getVoices() ?? [];
      const voice = pickSwedishVoice(voicesRef.current);
      setVoiceLabel(voice ? voice.name : null);
    };

    loadVoices();
    // Chrome fyller röstlistan först efter ett tag.
    synth.addEventListener?.("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener?.("voiceschanged", loadVoices);
      stoppedRef.current = true;
      synth.cancel();
    };
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const toggle = useCallback(
    (text: string) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      if (speaking) {
        stop();
        return;
      }

      synth.cancel();
      stoppedRef.current = false;
      const voice = pickSwedishVoice(voicesRef.current.length ? voicesRef.current : synth.getVoices() ?? []);
      const sentences = splitSentences(text);

      sentences.forEach((sentence, i) => {
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = "sv-SE";
        utterance.rate = 0.95;
        utterance.pitch = 1;
        if (voice) utterance.voice = voice;
        if (i === sentences.length - 1) {
          utterance.onend = () => {
            if (!stoppedRef.current) setSpeaking(false);
          };
        }
        utterance.onerror = () => {
          if (!stoppedRef.current) setSpeaking(false);
        };
        synth.speak(utterance);
      });

      setSpeaking(true);

      // Säkerhetsnät: en del webbläsare saknar röst och spelar då aldrig upp.
      // Då ska knappen inte fastna i "Stoppa uppläsning".
      window.setTimeout(() => {
        if (stoppedRef.current) return;
        if (!synth.speaking && !synth.pending) setSpeaking(false);
      }, 1600);
    },
    [speaking, stop, supported]
  );

  return { supported, speaking, voiceLabel, toggle, stop };
};