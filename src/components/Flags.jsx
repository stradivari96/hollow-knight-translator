import React from "react";

const langs = [
  "JP",
  "FR",
  "RU",
  "PT",
  "SC",
  "ES",
  "KO",
  "IT",
  "JA",
  "DE",
  "EN",
  "BP",
  "ZH",
];
langs.sort();
langs.unshift("All");

export const FlagSpan = ({ value }) => {
  const lowerCaseSuffix = ["JP", "FR", "RU", "PT", "ES", "IT", "DE"];
  let flagSuffix;
  if (lowerCaseSuffix.indexOf(value) >= 0) {
    flagSuffix = value.toLowerCase();
  } else {
    switch (value) {
      case "SC":
        flagSuffix = "cn";
        break;
      case "KO":
        flagSuffix = "kr";
        break;
      case "JA":
        flagSuffix = "jp";
        break;
      case "EN":
        flagSuffix = "gb";
        break;
      case "BP":
        flagSuffix = "br";
        break;
      case "ZH":
        flagSuffix = "cn";
        break;
      default:
        return null;
    }
  }
  return <span className={`fi fi-${flagSuffix}`} />;
};

const Flag = ({ value, onSelect, selectedLanguages }) => {
  const checked =
    selectedLanguages.has(value) ||
    (value === "All" && selectedLanguages.size === 0);
  return (
    <div
      className={`flex flex-row text-sm justify-around rounded-full w-16 sm:w-20 mx-auto my-2 px-3 py-1 hover:opacity-75 ${
        checked ? "bg-gray-400" : "bg-gray-300"
      }`}
      role="button"
      onClick={() => {
        if (onSelect) onSelect(value);
      }}
    >
      <FlagSpan value={value} />
      <p className="select-none">{value}</p>
    </div>
  );
};

const Flags = ({ onSelect, selectedLanguages }) => (
  <div className="grid py-2 my-3 m-auto grid-cols-3 sm:grid-cols-5 lg:grid-cols-9">
    {langs.map((k) => (
      <Flag
        key={k}
        value={k}
        onSelect={onSelect}
        selectedLanguages={selectedLanguages}
      />
    ))}
  </div>
);

export default Flags;
