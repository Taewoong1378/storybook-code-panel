import React from "react";
import { AddonPanel } from "@storybook/components";
import { addons } from "@storybook/manager-api";
import { useParameter } from "@storybook/manager-api";
import { ADDON_ID, PARAM_KEY, PANEL_ID } from "./constants";
import MyPanel from "./panel";
addons.register(ADDON_ID, api => {
  const render = ({
    active
  }) => {
    const p = useParameter(PARAM_KEY, null);
    if (p === null) {
      return null;
    }
    return /*#__PURE__*/React.createElement(AddonPanel, {
      active: active
    }, /*#__PURE__*/React.createElement(MyPanel, null));
  };
  const title = "Code";
  addons.add(PANEL_ID, {
    type: "panel",
    title,
    render,
    paramKey: PARAM_KEY
  });
});