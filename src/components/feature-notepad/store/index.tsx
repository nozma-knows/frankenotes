import { CODE_LANGUAGE_FRIENDLY_NAME_MAP } from "@lexical/code";
import {
  BsListUl,
  BsListCheck,
  BsCode,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsListOl,
  BsTextParagraph,
  BsChatSquareQuote,
} from "react-icons/bs";

export const FONT_FAMILY_OPTIONS: [string, string][] = [
  ["Arial", "Arial"],
  ["Courier New", "Courier New"],
  ["Georgia", "Georgia"],
  ["Times New Roman", "Times New Roman"],
  ["Trebuchet MS", "Trebuchet MS"],
  ["Verdana", "Verdana"],
];

export const FONT_SIZE_OPTIONS: [string, string][] = [
  ["10px", "10px"],
  ["11px", "11px"],
  ["12px", "12px"],
  ["13px", "13px"],
  ["14px", "14px"],
  ["15px", "15px"],
  ["16px", "16px"],
  ["17px", "17px"],
  ["18px", "18px"],
  ["19px", "19px"],
  ["20px", "20px"],
];

export const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  number: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
};

export const blockTypeToBlockIcon = {
  bullet: BsListUl,
  check: BsListCheck,
  code: BsCode,
  h1: BsTypeH1,
  h2: BsTypeH2,
  h3: BsTypeH3,
  number: BsListOl,
  paragraph: BsTextParagraph,
  quote: BsChatSquareQuote,
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

export const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();
