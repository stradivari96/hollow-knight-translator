import { useState, useEffect } from "react";

import Layout from "./components/Layout";
import TextResults from "./components/TextResults";
import Flags from "./components/Flags";
import Form from "./components/Form";

import AllText from "./all_text.json";

const normalize = (str) => {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return str.toLowerCase();
};

const App = () => {
  const [inputText, setInputText] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [variables, setVariables] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState(new Set());
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // URL param parsing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialInput = params.get("search");
    const lang = params.get("lang");

    const initialLangs = new Set();
    if (lang)
      lang
        .split(",")
        .filter((x) => x.length > 0)
        .forEach((x) => initialLangs.add(x));
    if (initialInput) {
      setInputText(initialInput);
      setSelectedLanguages(initialLangs);
    }
  }, []);

  // Filter variables (Debounced for performance)
  useEffect(() => {
    if (inputText === "") {
      setVariables([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const searchStr = normalize(inputText);
      const foundVariablesSet = new Set();
      Object.entries(AllText).forEach(([lang, data]) => {
        Object.entries(data).forEach(([k, v]) => {
          if (foundVariablesSet.has(k)) return;
          if (!v) return;
          if (
            normalize(v).includes(searchStr) ||
            normalize(k).includes(searchStr)
          ) {
            foundVariablesSet.add(k);
          }
        });
      });
      const foundVariables = Array.from(foundVariablesSet);
      foundVariables.sort();
      setVariables(foundVariables);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedLanguages, inputText]);

  // Get results
  useEffect(() => {
    let variable = selectedVariable || variables[0];

    let results = [];
    if (variables.length === 0) {
      setResults(results);
    } else {
      results = Object.entries(AllText)
        .filter(
          ([lang, data]) =>
            (selectedLanguages.size === 0 || selectedLanguages.has(lang)) &&
            data.hasOwnProperty(variable) &&
            data[variable],
        )
        .map(([lang, data]) => [lang, data[variable]]);
      setResults(results);
    }
  }, [variables, selectedLanguages, selectedVariable]);

  // Update URL params
  useEffect(() => {
    if (isLoading) return;

    const params = new URLSearchParams(window.location.search);
    if (inputText) {
      params.set("search", inputText);
    } else {
      params.delete("search");
    }

    if (selectedLanguages.size > 0) {
      params.set("lang", Array.from(selectedLanguages).sort().join(","));
    } else {
      params.delete("lang");
    }

    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [inputText, selectedLanguages, isLoading]);

  const onSelect = (value) => {
    setIsLoading(true);
    if (value === "All") selectedLanguages.clear();
    else {
      if (selectedLanguages.has(value)) {
        selectedLanguages.delete(value);
      } else {
        selectedLanguages.add(value);
      }
    }
    setSelectedLanguages(new Set(selectedLanguages));
  };

  return (
    <Layout>
      <div>
        <Form
          inputText={inputText}
          setInputText={(val) => {
            setInputText(val);
            if (val === "") setIsLoading(false);
            else setIsLoading(true);
          }}
          selectedLanguages={Array.from(selectedLanguages).sort()}
        />
        <Flags onSelect={onSelect} selectedLanguages={selectedLanguages} />
        <div className="px-2">
          {variables.length > 5 ? (
            <select
              className="block w-full border border-gray-300 bg-white text-gray-700 py-2 my-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
              value={selectedVariable}
              required
              onChange={(event) => {
                setSelectedVariable(event.target.value);
              }}
            >
              {variables.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex overflow-x-auto pb-2 mb-4 border-b border-gray-300">
              <div className="flex flex-nowrap space-x-2">
                {variables.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariable(v)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 whitespace-nowrap border-b-2 ${
                      selectedVariable === v ||
                      (!selectedVariable && variables[0] === v)
                        ? "text-black border-gray-800 bg-gray-200"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <TextResults values={results} searchQuery={inputText} />
        )}
      </div>
    </Layout>
  );
};

export default App;
