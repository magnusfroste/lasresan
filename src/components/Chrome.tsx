import { TOTAL_TEXTS } from "../lib/texts";
import { doneCount, type Progress } from "../lib/progress";
import { BookIcon } from "./Icons";

export const Header = () => (
  <header className="flex items-center justify-between gap-3 pt-5 pb-1">
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white shadow-sm">
        <BookIcon className="h-6 w-6" />
      </span>
      <div className="leading-tight">
        <p className="text-[19px] font-extrabold tracking-tight text-ink">Läsresan</p>
        <p className="text-[13px] text-muted">Läsförståelse åk 4–6</p>
      </div>
    </div>
    <span className="rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-semibold text-muted">
      Gratis · utan konto
    </span>
  </header>
);

export const Footer = () => (
  <footer className="mt-auto border-t border-line pt-4 pb-6 safe-bottom">
    <p className="text-center text-[13px] text-muted">Gratis · ingen inloggning · fungerar på iPad</p>
    <p className="mt-1 text-center text-[12px] text-muted">
      Dina framsteg sparas bara i den här webbläsaren. Inga kakor, ingen spårning.
    </p>
  </footer>
);

export const ProgressCard = ({ progress }: { progress: Progress }) => {
  const done = doneCount(progress);
  const pct = Math.round((done / TOTAL_TEXTS) * 100);
  const correct = Object.values(progress.results).reduce((sum, r) => sum + r.correct, 0);
  const total = Object.values(progress.results).reduce((sum, r) => sum + r.total, 0);

  return (
    <section className="card" aria-label="Dina framsteg">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-[15px] font-semibold text-ink">
          {done} av {TOTAL_TEXTS} texter klara
        </h2>
        <p className="text-[13px] text-muted">
          {done === 0 ? "Ingen text klar än" : `${correct} av ${total} frågor rätt`}
        </p>
      </div>
      <div
        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={TOTAL_TEXTS}
        aria-valuenow={done}
        aria-label={`${done} av ${TOTAL_TEXTS} texter klara`}
      >
        <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2.5 text-[13px] text-muted">
        {done === 0
          ? "Börja med en text på nivå 4 – den tar ungefär en minut."
          : done === TOTAL_TEXTS
            ? "Alla texter är klara. Läs om en text och slå ditt resultat!"
            : "Fortsätt där du var – välj en text nedan."}
      </p>
    </section>
  );
};