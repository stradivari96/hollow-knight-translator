import React from "react";

const Form = ({ inputText, setInputText, selectedLanguages }) => (
  <form className="mx-auto sm:w-4/5">
    <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor="text"
    >
      Search
    </label>
    <input
      id="search"
      type="text"
      name="search"
      className="shadow appearance-none border border-gray-300 bg-white w-full rounded-3xl py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      value={inputText}
      placeholder="Text"
      onChange={(e) => setInputText(e.target.value)}
    />
    <input type="hidden" id="lang" name="lang" value={selectedLanguages} />
  </form>
);

export default Form;
