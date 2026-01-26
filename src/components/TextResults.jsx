import ResultCard from "./ResultCard";

const TextResults = ({ values, searchQuery }) => {
  const cards = values
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
  return <div className="flex flex-row flex-wrap">{cards}</div>;
};

export default TextResults;