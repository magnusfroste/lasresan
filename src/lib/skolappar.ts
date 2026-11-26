// Anonyma användningssiffror till skolappar.org (kotten.js, laddas i index.html).
// Bara händelsenamn och tal skickas – aldrig något barnet har skrivit.
declare global { interface Window { skolappar?: { event: (name: string, value?: number) => void } } }
export const report = (name: 'round_start' | 'round_done' | 'level' | 'hint' | 'sound_off', value?: number) => window.skolappar?.event(name, value);
