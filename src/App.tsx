import { useCallback, useEffect, useState } from "react";
import { Footer, Header } from "./components/Chrome";
import { Home } from "./components/Home";
import { Reader } from "./components/Reader";
import { textById } from "./lib/texts";
import { loadProgress, recordResult, saveProgress, type Progress } from "./lib/progress";

type Route = { v: "home" } | { v: "text"; id: string };

/** Enkel hash-routing så att webbläsarens bakåtknapp fungerar på iPad. */
const routeFromHash = (): Route => {
  const match = window.location.hash.match(/^#\/text\/([\w-]+)$/);
  const text = match ? textById(match[1]) : undefined;
  return text ? { v: "text", id: text.id } : { v: "home" };
};

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [route, setRoute] = useState<Route>(() => routeFromHash());

  // Framsteg sparas bara lokalt i webbläsaren.
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const sync = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const open = useCallback((id: string) => {
    window.location.hash = `#/text/${id}`;
    setRoute({ v: "text", id });
    window.scrollTo(0, 0);
  }, []);

  const goHome = useCallback(() => {
    history.pushState(null, "", window.location.pathname + window.location.search);
    setRoute({ v: "home" });
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") goHome();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goHome]);

  const text = route.v === "text" ? textById(route.id) : undefined;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[820px] flex-col px-4 sm:px-6">
      <Header />
      <main className="flex-1 pt-3">
        {text ? (
          <Reader
            key={text.id}
            text={text}
            result={progress.results[text.id]}
            onFinish={(correct, total) =>
              setProgress((prev) => recordResult(prev, text.id, correct, total))
            }
            onHome={goHome}
            onOpen={open}
          />
        ) : (
          <Home progress={progress} onOpen={open} />
        )}
      </main>
      <Footer />
    </div>
  );
}