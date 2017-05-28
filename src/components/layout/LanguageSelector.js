import React from "react";

const LanguageButton = ({buttonLang, currentLang, switcher}) => (
  <button
      className={(buttonLang === currentLang) ? "is-active" : "is-inactive"}
      onClick={e => switcher(buttonLang)}>{buttonLang.toUpperCase()}</button>
)

const LanguageSelector = ({ ...props }) => (
  <div className="Lang-Selector">
      <LanguageButton buttonLang="zh" currentLang={props.lang} switcher={props.languageSwitch} />
      <LanguageButton buttonLang="en" currentLang={props.lang} switcher={props.languageSwitch} />
  </div>
);

export default LanguageSelector;
