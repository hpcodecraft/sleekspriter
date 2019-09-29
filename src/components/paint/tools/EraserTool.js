import React from "react";
import { t } from "../../../utils";

const EraserTool = () => {
  return (
    <div id="Eraser-Tool" className="ToolComponent">
      <i
        className="icon flaticon-double31"
        style={{ position: "relative", left: "0.25em" }}
      />
      <span className="hint">{t("Click a pixel to erase it.")}</span>
    </div>
  );
};

export default EraserTool;