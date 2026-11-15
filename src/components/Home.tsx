import { useMemo, useState } from "react";
import { LEVELS, TEXTS, minutes, wordCount, type Level } from "../lib/texts";
import { doneCount, type Progress } from "../lib/progress";
import { ProgressCard } from "./Chrome";
import { CheckIcon, ChevronIcon } from "./Icons";

const LevelMeter = ({ level }: { level: Level }) => (
  <span className="ml-0.5 inline-flex items-end gap-[2px]" aria-hidden="true">
    {[4, 5, 6].map((n) => (
      <span
        key={n}
        className={`w-[3px] rounded-sm ${n <= level ? "bg-brand" : "bg-brand/25"}`}
        style={{ height: `${4 + (n - 4) * 2}px` }}
      />
    ))}
  </span>
);

const snippet = (body: string[]): string => {
  const first = body[0] ?? "";
  return first.length > 110 ? `${first.slice(0, 108).trimEnd()}…` : first;
};

type Filter = "all" | Level;

export const Home = ({
  progress,
  onOpen,
}: {
  progress: Progress;
  onOpen: (id: string) => void;
}) => {
  const [filter, setFilter] = useState<Filter>("all");
  const done = doneCount(progress);

  const list = useMemo(
    () => (filter === "all" ? TEXTS : TEXTS.filter((t) => t.level === filter)),
    [filter]
  );

  return (
    <div className="flex flex-col gap-5">
      <section className="pt-2">
        <h1 className="max-w-[22ch] text-[28px] font-extrabold leading-[1.15] tracking-tight text-ink sm:text-[34px]">
          Läs en kort text. Svara på tre frågor.
        </h1>
        <p className="mt-3 max-w-[46ch] text-[16px] leading-[1.6] text-muted">
          Tolv egna texter för åk 4–6, i tre nivåer. Läs i lugn takt, lyssna om du vill och få svar
          direkt – utan konto och utan krångel.
        </p>
      </section>

      <ProgressCard progress={progress} />

      <section aria-label="Välj nivå" className="flex flex-wrap items-center gap-2">
        <h2 className="mr-1 text-[13px] font-semibold uppercase tracking-wide text-muted">Nivå</h2>
        <div className="flex items-center gap-1 rounded-2xl border border-line bg-white p-1">
          {(["all", ...LEVELS] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <button
                key={String(f)}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                aria-label={f === "all" ? "Alla nivåer" : `Nivå ${f}`}
                className={`min-h-[52px] min-w-[52px] rounded-xl px-3 text-[15px] font-semibold transition ${
                  active ? "bg-brand text-white shadow-sm" : "text-ink hover:bg-paper"
                }`}
              >
                {f === "all" ? "Alla" : f}
              </button>
            );
          })}
        </div>
        <p className="w-full text-[13px] text-muted">
          Nivå 4 är kortast, nivå 6 kräver mest slutledning.
        </p>
      </section>

      <section aria-label="Texter" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold text-ink">
            {filter === "all" ? "Alla texter" : `Texter på nivå ${filter}`}
          </h2>
          <span className="text-[13px] text-muted">{list.length} texter</span>
        </div>

        {list.map((text) => {
          const result = progress.results[text.id];
          return (
            <button
              key={text.id}
              type="button"
              onClick={() => onOpen(text.id)}
              className="group w-full rounded-3xl border border-line bg-white p-5 text-left shadow-[0_1px_2px_rgba(20,24,31,0.04)] transition hover:border-brand/40 hover:shadow-md active:scale-[0.995]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-semibold text-brand-dark">
                      Nivå {text.level}
                      <LevelMeter level={text.level} />
                    </span>
                    <span className="text-[12px] font-medium text-muted">{text.topic}</span>
                    {result ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f4ec] px-2.5 py-1 text-[12px] font-semibold text-[#1d7a4d]">
                        <CheckIcon className="h-3.5 w-3.5" />
                        Klar · {result.correct}/{result.total}
                      </span>
                    ) : (
                      <span className="rounded-full border border-line px-2.5 py-1 text-[12px] font-medium text-muted">
                        Ny
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2.5 text-[18px] font-bold leading-snug text-ink">{text.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[14px] leading-[1.5] text-muted">{snippet(text.body)}</p>
                  <p className="mt-2.5 text-[12px] text-muted">
                    {wordCount(text)} ord · ca {minutes(text)} min · 3 frågor
                  </p>
                </div>
                <ChevronIcon className="mt-1 h-5 w-5 shrink-0 text-muted/50 transition group-hover:text-brand" />
              </div>
            </button>
          );
        })}

        {done === TEXTS.length && (
          <p className="rounded-2xl border border-line bg-white p-4 text-[14px] text-muted">
            Du har läst alla texter. Välj en text igen för att träna mer – övning gör läsningen
            lättare.
          </p>
        )}
      </section>
    </div>
  );
};