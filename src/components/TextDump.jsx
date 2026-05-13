import { useState, useMemo } from "react";
import AllText from "../all_text.json";
import { FlagSpan } from "./Flags";

const LANGS = ["DE", "EN", "ES", "FR", "IT", "JA", "KO", "PT", "RU", "ZH", "ZH_TW"];

const TextDump = () => {
  const [selectedLang, setSelectedLang] = useState("EN");
  const rows = useMemo(() => {
    const data = AllText[selectedLang] || {};
    return Object.entries(data);
  }, [selectedLang]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {LANGS.map((lang) => {
          const active = selectedLang === lang;
          return (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                active
                  ? "bg-gray-400 dark:bg-gray-500 font-medium"
                  : "bg-gray-300 dark:bg-gray-700 hover:opacity-75"
              }`}
            >
              <FlagSpan value={lang} />
              <span>{lang === "ZH_TW" ? "TW" : lang}</span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {rows.length} variable{rows.length !== 1 ? "s" : ""}
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
        <table className="w-full text-sm border-collapse bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="px-4 py-2 font-medium w-2/5 border-b border-gray-300 dark:border-gray-600">
                Variable
              </th>
              <th className="px-4 py-2 font-medium border-b border-gray-300 dark:border-gray-600">
                Text
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([key, value], i) => (
              <tr
                key={key}
                className={`${
                  i % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
              >
                <td className="px-4 py-2 font-mono text-xs text-gray-600 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 align-top">
                  {key}
                </td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 whitespace-pre-wrap break-words">
                  {value}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-gray-400 dark:text-gray-500"
                >
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TextDump;
