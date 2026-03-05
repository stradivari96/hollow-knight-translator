import { useState, useEffect, useRef } from "react";
import { FlagSpan } from "./Flags";
import changelog from "../changelog.json";

const LANGS = ["DE", "EN", "ES", "FR", "IT", "JA", "KO", "PT", "RU", "ZH"];

const lcsDiff = (oldLines, newLines) => {
  const m = oldLines.length, n = newLines.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = oldLines[i - 1] === newLines[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({ type: "context", line: oldLines[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", line: newLines[j - 1] });
      j--;
    } else {
      result.unshift({ type: "removed", line: oldLines[i - 1] });
      i--;
    }
  }
  return result;
};

const ROW = {
  context: { bg: "", prefix: " ", prefixCls: "text-gray-400 select-none", textCls: "text-gray-700 dark:text-gray-300" },
  removed: { bg: "bg-red-50 dark:bg-red-950/40", prefix: "-", prefixCls: "text-red-500 dark:text-red-400 select-none", textCls: "text-red-900 dark:text-red-200" },
  added: { bg: "bg-green-50 dark:bg-green-950/40", prefix: "+", prefixCls: "text-green-600 dark:text-green-400 select-none", textCls: "text-green-900 dark:text-green-200" },
};

const DiffBlock = ({ oldText, newText }) => {
  const rows = oldText && newText
    ? lcsDiff(oldText.split("\n"), newText.split("\n"))
    : (oldText ?? newText).split("\n").map((line) => ({
      type: oldText ? "removed" : "added", line,
    }));

  return (
    <>
      {rows.map(({ type, line }, i) => {
        const r = ROW[type];
        return (
          <div key={i} className={`flex font-mono text-sm px-2 py-px ${r.bg}`}>
            <span className={`mr-3 shrink-0 ${r.prefixCls}`}>{r.prefix}</span>
            <span className={`whitespace-pre-wrap break-all ${r.textCls}`}>{line}</span>
          </div>
        );
      })}
    </>
  );
};

const ChangeEntry = ({ change, onKeyClick }) => (
  <div className="mb-3 rounded overflow-hidden border border-gray-200 dark:border-gray-700 text-sm">
    <div className="px-3 py-1 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-1.5 flex-wrap">
      <FlagSpan value={change.lang} />
      <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{change.lang}</span>
      <span className="text-gray-400">·</span>
      <button
        className="font-mono text-xs text-blue-600 dark:text-blue-400 hover:underline"
        onClick={() => onKeyClick(change.key)}
      >
        {change.key}
      </button>
    </div>
    <DiffBlock oldText={change.old ?? null} newText={change.new ?? null} />
  </div>
);

const PAGE_SIZE = 50;

const CommitSection = ({ entry, selectedLangs, onKeyClick }) => {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  const changes =
    selectedLangs.size === 0
      ? entry.changes
      : entry.changes.filter((c) => selectedLangs.has(c.lang));

  useEffect(() => {
    if (!open || visibleCount >= changes.length) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisibleCount((n) => n + PAGE_SIZE); },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open, visibleCount, changes.length]);

  const handleOpen = () => {
    setOpen((o) => !o);
    setVisibleCount(PAGE_SIZE);
  };

  if (changes.length === 0) return null;

  const added = changes.filter((c) => c.type === "added").length;
  const removed = changes.filter((c) => c.type === "removed").length;
  const modified = changes.filter((c) => c.type === "modified").length;

  return (
    <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={handleOpen}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-gray-400">{entry.commit}</span>
          <span className="text-gray-400">·</span>
          <span className="text-sm font-medium">{entry.message}</span>
        </div>
        <div className="flex items-center gap-2 text-xs shrink-0 ml-2">
          {added > 0 && <span className="text-green-600 dark:text-green-400">+{added}</span>}
          {removed > 0 && <span className="text-red-500 dark:text-red-400">-{removed}</span>}
          {modified > 0 && (
            <span className="text-yellow-600 dark:text-yellow-400">~{modified}</span>
          )}
          <span className="text-gray-400 dark:text-gray-500">{entry.date}</span>
          <span className="text-gray-400">{open ? "▲" : "▼"}</span>
        </div>
      </button>
      {open && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          {changes.slice(0, visibleCount).map((change, i) => (
            <ChangeEntry key={i} change={change} onKeyClick={onKeyClick} />
          ))}
          {visibleCount < changes.length && (
            <div ref={sentinelRef} className="py-4 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 dark:border-gray-500" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Changelog = ({ onKeyClick }) => {
  const [selectedLang, setSelectedLang] = useState("");

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {LANGS.map((lang) => {
          const active = selectedLang === lang;
          return (
            <button
              key={lang}
              onClick={() => setSelectedLang(active ? "" : lang)}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full transition-colors cursor-pointer ${active
                  ? "bg-gray-400 dark:bg-gray-500"
                  : "bg-gray-300 dark:bg-gray-700 hover:opacity-75"
                }`}
            >
              <FlagSpan value={lang} />
              <span>{lang}</span>
            </button>
          );
        })}
        {selectedLang && (
          <button
            onClick={() => setSelectedLang("")}
            className="text-sm px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:opacity-75 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
      {changelog.map((entry) => (
        <CommitSection
          key={entry.commit}
          entry={entry}
          selectedLangs={selectedLang ? new Set([selectedLang]) : new Set()}
          onKeyClick={onKeyClick}
        />
      ))}
    </div>
  );
};

export default Changelog;
