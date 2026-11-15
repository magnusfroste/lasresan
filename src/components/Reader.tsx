import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KIND_HINT,
  KIND_LABEL,
  minutes,
  nextText,
  wordCount,
  type Question,
  type ReadingText,
} from "../lib/texts";
import { useSpeech } from "../lib/speech";
import type { TextResult } from "../lib/progress";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CrossIcon,
  RefreshIcon,
  SoundIcon,
  StopIcon,
} from "./Icons";

type Phase = "read" | "quiz" | "done";

const LETTERS = ["A", "B", "C", "D"];

const LevelBadge = ({ level }: { level: number }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-semibold text-brand-dark">
    Nivå {level}
  </span>
);

const BackLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="-ml-2 inline-flex min-h-[52px] items-center gap-1.5 rounded-2xl px-2 text-[14px] font-semibold text-muted transition hover:text-brand"
  >
    <ArrowLeftIcon className="h-4 w-4" />
    {label}
  </button>
);

/* ---------------------------------------------------------------- läsvyn */

const ReadView = ({
  text,
  result,
  onStart,
  onHome,
}: {
  text: ReadingText;
  result?: TextResult;
  onStart: () => void;
  onHome: () => void;
}) => {
  const speech = useSpeech();
  const fullText = useMemo(() => `${text.title}. ${text.body.join(" ")}`, [text]);

  useEffect(() => () => speech.stop(), [speech.stop]);

  return (
    <div className="flex flex-col gap-4 pb-6">
      <BackLink label="Alla texter" onClick={onHome} />

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={text.level} />
          <span className="text-[12px] font-medium text-muted">{text.topic}</span>
          <span className="text-[12px] text-muted">·</span>
          <span className="text-[12px] text-muted">
            {wordCount(text)} ord · ca {minutes(text)} min
          </span>
          {result && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f4ec] px-2.5 py-1 text-[12px] font-semibold text-[#1d7a4d]">
              <CheckIcon className="h-3.5 w-3.5" />
              Klar · {result.correct}/{result.total}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-[27px] font-extrabold leading-tight tracking-tight text-ink sm:text-[32px]">
          {text.title}
        </h1>
      </div>

      {speech.supported ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => speech.toggle(fullText)}
            aria-pressed={speech.speaking}
            className={`inline-flex min-h-[52px] items-center gap-2 rounded-2xl border px-4 text-[15px] font-semibold transition ${
              speech.speaking
                ? "border-brand bg-brand text-white"
                : "border-line bg-white text-ink hover:border-brand/50 hover:text-brand"
            }`}
          >
            {speech.speaking ? <StopIcon /> : <SoundIcon />}
            {speech.speaking ? "Stoppa uppläsning" : "Lyssna på texten"}
          </button>
          <p className="text-[13px] text-muted">
            {speech.speaking ? "Läser upp…" : "Uppläsning är valfri – du kan läsa själv."}
          </p>
        </div>
      ) : (
        <p className="text-[13px] text-muted">Läs texten här nedan. Uppläsning finns inte i den här webbläsaren.</p>
      )}

      <article className="card border-line px-5 py-6 sm:px-8 sm:py-9">
        <div className="mx-auto flex max-w-[42ch] flex-col gap-[1.15em] text-[19px] leading-[1.7] text-ink">
          {text.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </article>

      <button type="button" onClick={onStart} className="btn-primary w-full sm:w-auto sm:self-start">
        Svara på frågorna
        <ArrowRightIcon />
      </button>
      <p className="text-[13px] text-muted">Tre frågor: en på raderna, en mellan raderna och en om ord.</p>
    </div>
  );
};

/* ------------------------------------------------------------- frågevyn */

const OptionButton = ({
  label,
  text,
  state,
  disabled,
  onClick,
}: {
  label: string;
  text: string;
  state: "idle" | "correct" | "wrong" | "muted";
  disabled: boolean;
  onClick: () => void;
}) => {
  const look =
    state === "correct"
      ? "border-[#1d7a4d] bg-[#e7f4ec] text-ink"
      : state === "wrong"
        ? "border-[#b3261e] bg-[#fdecea] text-ink"
        : state === "muted"
          ? "border-line bg-white text-muted opacity-70"
          : "border-line bg-white text-ink hover:border-brand/50 hover:bg-brand-soft/40";

  const keyLook =
    state === "correct"
      ? "border-[#1d7a4d] bg-[#1d7a4d] text-white"
      : state === "wrong"
        ? "border-[#b3261e] bg-[#b3261e] text-white"
        : "border-line bg-paper text-muted";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[56px] w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-[16px] font-medium leading-snug transition ${look} disabled:cursor-default`}
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[13px] font-bold ${keyLook}`}>
        {label}
      </span>
      <span className="flex-1">{text}</span>
      {state === "correct" && <CheckIcon className="h-5 w-5 shrink-0 text-[#1d7a4d]" />}
      {state === "wrong" && <CrossIcon className="h-5 w-5 shrink-0 text-[#b3261e]" />}
    </button>
  );
};

const QuestionView = ({
  question,
  index,
  total,
  onAnswer,
  onNext,
  onBackToText,
  text,
}: {
  question: Question;
  index: number;
  total: number;
  onAnswer: (choice: number) => void;
  onNext: () => void;
  onBackToText: () => void;
  text: ReadingText;
}) => {
  const [choice, setChoice] = useState<number | null>(null);
  const answered = choice !== null;
  const isCorrect = answered && choice === question.correct;
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const pick = (i: number) => {
    if (answered) return;
    setChoice(i);
    onAnswer(i);
  };

  useEffect(() => {
    if (answered) nextRef.current?.focus({ preventScroll: true });
  }, [answered]);

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between gap-3">
        <BackLink label="Läs texten igen" onClick={onBackToText} />
        <span className="shrink-0 text-[13px] font-semibold text-muted">
          Fråga {index + 1} av {total}
        </span>
      </div>

      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < index ? "bg-brand/60" : i === index ? "bg-brand" : "bg-line"}`}
          />
        ))}
      </div>

      <div className="card">
        <span className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-1 text-[12px] font-semibold text-muted">
          {KIND_LABEL[question.kind]}
        </span>
        <h1 className="mt-3 text-[21px] font-bold leading-snug text-ink sm:text-[24px]">{question.prompt}</h1>
        <p className="mt-1.5 text-[13px] text-muted">{KIND_HINT[question.kind]}</p>

        <div className="mt-5 flex flex-col gap-2.5">
          {question.options.map((option, i) => (
            <OptionButton
              key={i}
              label={LETTERS[i]}
              text={option}
              disabled={answered}
              state={
                !answered
                  ? "idle"
                  : i === question.correct
                    ? "correct"
                    : i === choice
                      ? "wrong"
                      : "muted"
              }
              onClick={() => pick(i)}
            />
          ))}
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {answered && (
          <div
            className={`rounded-3xl border p-5 ${
              isCorrect ? "border-[#1d7a4d]/30 bg-[#e7f4ec]" : "border-[#b3261e]/25 bg-[#fdecea]"
            }`}
          >
            <p className={`flex items-center gap-2 text-[16px] font-bold ${isCorrect ? "text-[#1d7a4d]" : "text-[#b3261e]"}`}>
              {isCorrect ? <CheckIcon className="h-5 w-5" /> : <CrossIcon className="h-5 w-5" />}
              {isCorrect ? "Rätt svar!" : "Inte riktigt"}
            </p>
            {!isCorrect && (
              <p className="mt-2 text-[15px] leading-[1.6] text-ink">
                Rätt svar: <strong>{question.options[question.correct]}</strong>
              </p>
            )}
            <p className="mt-2 text-[15px] leading-[1.65] text-ink/90">{question.explain}</p>
          </div>
        )}
      </div>

      {answered && (
        <button ref={nextRef} type="button" onClick={onNext} className="btn-primary w-full">
          {index + 1 === total ? "Se resultat" : "Nästa fråga"}
          <ArrowRightIcon />
        </button>
      )}

      <details className="rounded-3xl border border-line bg-white p-4">
        <summary className="cursor-pointer text-[14px] font-semibold text-ink marker:text-brand">
          visa texten
        </summary>
        <div className="mt-3 flex max-w-[42ch] flex-col gap-3 text-[16px] leading-[1.7] text-ink/90">
          {text.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </details>
    </div>
  );
};

/* ------------------------------------------------------------- resultat */

const scoreMessage = (correct: number, total: number): string => {
  if (correct === total) return "Alla rätt! Du läste både på och mellan raderna.";
  if (correct >= Math.ceil(total / 2)) return "Bra jobbat – läs förklaringarna och testa igen om du vill.";
  return "Läs texten en gång till i lugn takt. Det är så läsningen blir lättare.";
};

const ResultView = ({
  text,
  answers,
  onHome,
  onRetry,
  onNext,
}: {
  text: ReadingText;
  answers: (number | null)[];
  onHome: () => void;
  onRetry: () => void;
  onNext: () => void;
}) => {
  const correct = text.questions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
  const total = text.questions.length;
  const next = nextText(text.id, text.level);

  return (
    <div className="flex flex-col gap-4 pb-8">
      <span className="text-[13px] font-semibold uppercase tracking-wide text-muted">Resultat</span>
      <div className="card">
        <div className="flex items-end gap-2">
          <p className="text-[44px] font-extrabold leading-none tracking-tight text-brand">
            {correct} av {total}
          </p>
          <p className="pb-1 text-[14px] font-medium text-muted">rätt</p>
        </div>
        <h1 className="mt-3 text-[20px] font-bold leading-snug text-ink">”{text.title}”</h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-muted">{scoreMessage(correct, total)}</p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {text.questions.map((q, i) => {
          const ok = answers[i] === q.correct;
          return (
            <li key={i} className="rounded-3xl border border-line bg-white p-4">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                    ok ? "bg-[#e7f4ec] text-[#1d7a4d]" : "bg-[#fdecea] text-[#b3261e]"
                  }`}
                >
                  {ok ? <CheckIcon className="h-4 w-4" /> : <CrossIcon className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
                    {KIND_LABEL[q.kind]}
                  </p>
                  <p className="mt-1 text-[15px] font-medium leading-snug text-ink">{q.prompt}</p>
                  {!ok && (
                    <>
                      {answers[i] !== null && (
                        <p className="mt-1.5 text-[14px] leading-snug text-muted">
                          Du svarade:{" "}
                          <span className="font-medium text-ink/70">{q.options[answers[i] as number]}</span>
                        </p>
                      )}
                      <p className="mt-1 text-[14px] leading-snug text-muted">
                        Rätt svar: <span className="font-semibold text-ink">{q.options[q.correct]}</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={onHome} className="btn-primary w-full sm:w-auto">
          Läs en text till
          <ArrowRightIcon />
        </button>
        <button type="button" onClick={onRetry} className="btn-ghost w-full sm:w-auto">
          <RefreshIcon className="h-5 w-5" />
          Gör om texten
        </button>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="inline-flex min-h-[52px] items-center justify-between gap-2 rounded-2xl border border-line bg-white px-4 text-left text-[14px] font-semibold text-ink transition hover:border-brand/50"
      >
        <span className="min-w-0">
          <span className="block text-[12px] font-medium uppercase tracking-wide text-muted">Nästa text</span>
          <span className="block truncate">{next.title}</span>
        </span>
        <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted" />
      </button>
    </div>
  );
};

/* ---------------------------------------------------------------- Reader */

export const Reader = ({
  text,
  result,
  onFinish,
  onHome,
  onOpen,
}: {
  text: ReadingText;
  result?: TextResult;
  onFinish: (correct: number, total: number) => void;
  onHome: () => void;
  onOpen: (id: string) => void;
}) => {
  const [phase, setPhase] = useState<Phase>("read");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => text.questions.map(() => null));
  const finishedRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase, index]);

  const reset = useCallback(() => {
    finishedRef.current = false;
    setAnswers(text.questions.map(() => null));
    setIndex(0);
    setPhase("read");
  }, [text]);

  const answer = (choice: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = choice;
      return next;
    });
  };

  const advance = () => {
    if (index + 1 < text.questions.length) {
      setIndex(index + 1);
      return;
    }
    const correct = text.questions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
    if (!finishedRef.current) {
      finishedRef.current = true;
      onFinish(correct, text.questions.length);
    }
    setPhase("done");
  };

  if (phase === "read")
    return <ReadView text={text} result={result} onStart={() => setPhase("quiz")} onHome={onHome} />;

  if (phase === "done")
    return (
      <ResultView
        text={text}
        answers={answers}
        onHome={onHome}
        onRetry={reset}
        onNext={() => onOpen(nextText(text.id, text.level).id)}
      />
    );

  return (
    <QuestionView
      key={index}
      text={text}
      question={text.questions[index]}
      index={index}
      total={text.questions.length}
      onAnswer={answer}
      onNext={advance}
      onBackToText={() => setPhase("read")}
    />
  );
};