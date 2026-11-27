/**
 * Uppläsning med inspelad röst (OmniVoice via Shipholms taltjänst).
 *
 * Allt som läses är text som finns först när appen körs – texter, valda ord
 * och barnets egen läsning – så meningarna hämtas från tjänsten och spelas upp
 * som ljud. Ingen talsyntes i webbläsaren används, varken som förstahandsval
 * eller som reserv: svarar tjänsten inte blir det tyst, och texten står kvar
 * på skärmen.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const TAL_URL = "https://api.shipholm.com/speak";

export const isSpeechSupported = (): boolean =>
  typeof window !== "undefined" && typeof window.fetch === "function";

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
  const [supported] = useState(isSpeechSupported);
  const [speaking, setSpeaking] = useState(false);
  const stoppedRef = useRef(false);
  const ljudRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const rensa = useCallback(() => {
    const ljud = ljudRef.current;
    if (ljud) {
      ljud.onended = null;
      ljud.onerror = null;
      ljud.pause();
      ljudRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    rensa();
    setSpeaking(false);
  }, [rensa]);

  useEffect(() => () => stop(), [stop]);

  const toggle = useCallback(
    (text: string) => {
      if (!supported) return;
      if (speaking) {
        stop();
        return;
      }
      const meningar = splitSentences(text);
      if (!meningar.length) return;

      rensa();
      stoppedRef.current = false;
      setSpeaking(true);

      // En mening i taget: hämta, spela, fortsätt när den tagit slut.
      const spela = (i: number) => {
        if (stoppedRef.current) return;
        if (i >= meningar.length) {
          setSpeaking(false);
          return;
        }
        fetch(TAL_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: meningar[i], voice: "omni" }),
        })
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
          .then((b) => {
            if (stoppedRef.current) return;
            const url = URL.createObjectURL(b);
            urlRef.current = url;
            const ljud = new Audio(url);
            ljudRef.current = ljud;
            const nästa = () => {
              URL.revokeObjectURL(url);
              if (urlRef.current === url) urlRef.current = null;
              spela(i + 1);
            };
            ljud.onended = nästa;
            ljud.onerror = nästa;
            return ljud.play().catch(nästa);
          })
          .catch(() => {
            // Tyst: texten syns redan på skärmen.
            if (!stoppedRef.current) setSpeaking(false);
          });
      };

      spela(0);
    },
    [rensa, speaking, stop, supported]
  );

  return { supported, speaking, voiceLabel: "OmniVoice", toggle, stop };
};
