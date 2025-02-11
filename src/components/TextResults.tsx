import React, { useState } from "react";
import { FlagSpan } from "./Flags";

const TextResults = ({ values }: { values: Array<[string, string]> }) => {
  const [showAlert, setShowAlert] = useState(false);
  const cards: Array<JSX.Element> = values.sort().map(([lang, text], i) => (
    <div
      key={lang + text}
      className="flex-grow sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 py-2"
    >
      <div className="bg-gray-100 rounded px-2 py-2 shadow h-full">
        <div
          role="button"
          tabIndex={0}
          id={i == 0 ? "fkrc-checkbox" : i}
          className="focus:outline-none hover:bg-gray-400 hover:text-black text-gray-100 cursor-pointer px-2 rounded flex flex-row"
          onClick={() => {
            setShowAlert(true);
            navigator.clipboard.writeText(text);
            setTimeout(() => setShowAlert(false), 1000);
          }}
        >
          <FlagSpan value={lang} />
          <p className="px-1 whitespace-pre">
            {showAlert ? "Copied!   " : "Copy text"}
          </p>
        </div>
        <p className="px-2 py-2 break-words" style={{ whiteSpace: "pre-line" }}>
          {text}
        </p>
      </div>
    </div>
  ));
  return <div className="flex flex-row flex-wrap">{cards}</div>;
};

export default TextResults;
