import { useState } from "react";
import ResultCard from "./ResultCard";

const TextResults = ({ values, searchQuery, variableName, allTranslations }) => {
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!values || values.length === 0) return null;

  const cards = [...values]
    .sort()
    .map(([lang, text], i) => (
      <ResultCard
        key={lang + text}
        lang={lang}
        text={text}
        index={i}
        searchQuery={searchQuery}
      />
    ));

  const getVal = (lang) => (allTranslations[lang] && allTranslations[lang][variableName]) || "";

  const localisationTemplate = `{{Localisation
|DEname = ${getVal("DE")}
|DEmeaning = 
|ESname = ${getVal("ES")}
|ESmeaning = 
|FRname = ${getVal("FR")}
|FRmeaning = 
|ITname = ${getVal("IT")}
|ITmeaning = 
|JAname = ${getVal("JA")}
|JAromanised = 
|JAmeaning = 
|KOname = ${getVal("KO")}
|KOromanised = 
|KOmeaning = 
|PTname = ${getVal("PT")}
|PTmeaning = 
|RUname = ${getVal("RU")}
|RUromanised = 
|RUmeaning = 
|TWname = ${getVal("ZH_TW")}
|TWromanised = 
|TWmeaning = 
|ZHname = ${getVal("ZH")}
|ZHromanised = 
|ZHmeaning = 
|CODEname = ${variableName || ""}
|CODEmeaning = 
}}`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(localisationTemplate).then(() => {
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000);
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row flex-wrap">{cards}</div>
      {variableName && (
        <div className="px-2 pb-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 shadow">
            <div className="flex justify-between items-center">
              <div
                className="flex items-center cursor-pointer select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <span className="mr-2 transform transition-transform duration-200 dark:text-gray-200">
                  {isCollapsed ? "▶" : "▼"}
                </span>
                <h3 className="text-lg font-bold dark:text-gray-200">
                  Wiki Localisation Template
                </h3>
              </div>
              <button
                onClick={handleCopyTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {showCopyMessage ? "Copied!" : "Copy Template"}
              </button>
            </div>
            {!isCollapsed && (
              <pre className="mt-3 bg-white dark:bg-gray-900 p-3 rounded border border-gray-300 dark:border-gray-700 overflow-x-auto text-xs sm:text-sm dark:text-gray-300">
                {localisationTemplate}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextResults;
