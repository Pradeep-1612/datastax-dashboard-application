import { type BeforeMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

export const defaultEditorOptions: editor.IStandaloneEditorConstructionOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  stickyScroll: {
    enabled: false,
  },
  formatOnPaste: true,
  formatOnType: true,
  scrollBeyondLastLine: false,
  fontSize: 13,
  tabSize: 2,
  autoClosingBrackets: "never",
  autoClosingQuotes: "never",
  autoSurround: "never",
};

export const MONACO_THEME = "app-json-theme";

export const monacoBeforeMount: BeforeMount = (monaco) => {
  monaco.editor.defineTheme(MONACO_THEME, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "string.key.json", foreground: "393939" },   // keys   → black
      { token: "string.value.json", foreground: "1062fe" },  // string values → blue
      { token: "number.json", foreground: "750e13" },        // numbers → magenta
      { token: "keyword.json", foreground: "198038" },       // true/false/null → green
    ],
    colors: {
      "editorLineNumber.foreground": "#393939",          // Normal line numbers
      "editorLineNumber.activeForeground": "#1062fe",   // Current line number
      "editor.lineHighlightBackground": "#F8F8F8", // or transparent
      "editor.lineHighlightBorder": "#00000000",   // transparent
    },
  });
};