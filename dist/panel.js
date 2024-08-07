import React from "react";
import { useParameter, useAddonState } from "@storybook/manager-api";
import { PARAM_KEY, ADDON_ID } from "./constants";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Form } from "@storybook/components";
import createParams from "./createParams";
const SourcePanel = () => {
  let params = getParams();
  const [fileName, setFileName] = useAddonState(`${ADDON_ID}/fileName`, params.files[0]);
  const [hideLineNumbers, setHideLineNumbers] = useAddonState(`${ADDON_ID}/hideLineNumbers`, !!params.hideLineNumbers);
  let fileMap = params.files.reduce((prev, curr) => ({
    ...prev,
    [curr.fileName]: curr
  }), {});
  let file = fileMap[fileName] || params.files[0];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Field, {
    label: "Show Line Numbers:"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !hideLineNumbers,
    onChange: e => {
      setHideLineNumbers(!e.target.checked);
    }
  })), /*#__PURE__*/React.createElement(Form.Field, {
    label: "File:"
  }, /*#__PURE__*/React.createElement(Form.Select, {
    value: file.fileName,
    name: "File",
    onChange: e => {
      setFileName(e.target.value);
    },
    size: "flex"
  }, params.files.map(x => /*#__PURE__*/React.createElement("option", {
    key: x.fileName,
    value: x.fileName
  }, x.fileName)))), file ? /*#__PURE__*/React.createElement(SyntaxHighlighter, {
    language: file.language || getLanguage(file.fileName, params),
    showLineNumbers: !hideLineNumbers,
    style: params.style || atomDark
  }, file.code.default ? file.code.default : file.code) : null);
};
function getParams() {
  const p = useParameter(PARAM_KEY, []);
  let params = {};
  if (p.fromContext) {
    params = createParams(p.fromContext);
  } else {
    if (Array.isArray(p)) {
      params.files = p;
    } else {
      if (Array.isArray(p.files)) {
        params.files = p.files;
      } else if (p.code) {
        params.files = [p];
      } else {
        params.files = [];
      }
    }
  }
  if (p.style) {
    params.style = p.style;
  }
  params.extensionMapping = p.extensionMapping || {};
  if (p.allowedExtensions) {
    params.files = params.files.filter(x => p.allowedExtensions.indexOf(getExtension(x.fileName)) > -1);
    params.files = params.files.sort((x, y) => p.allowedExtensions.indexOf(getExtension(x.fileName)) - p.allowedExtensions.indexOf(getExtension(y.fileName)));
  }
  return params;
}
function getLanguage(fileName, params) {
  let extension = getExtension(fileName);
  const found = params.extensionMapping[extension];
  if (found) {
    return found;
  }
  return extension;
}
function getExtension(fileName) {
  let split = fileName.split(".");
  let extension = split[split.length - 1];
  return extension;
}
export default SourcePanel;