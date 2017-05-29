import React from "react";
import { connect } from "react-redux";
import actions from "../state/actions";
import {
  BrightnessTool,
  BrushTool,
  EraserTool,
  EyedropperTool,
  MoveTool,
  RectangularSelectionTool,
  ZoomTool
} from "../views/paint/tools";

const components = {
  BrightnessTool,
  BrushTool,
  EraserTool,
  EyedropperTool,
  MoveTool,
  RectangularSelectionTool,
  ZoomTool
};

const {
  brightnessToolIntensity,
  brightnessToolMode,
  selectZoom,
  zoomIn,
  zoomOut,
  zoomFit,
} = actions;

const mapStateToProps = (state) => {
  return {
    tool: state.ui.paint.tool,
    zoom: state.ui.paint.zoom,
    fileSize: state.file.size,
    brightnessTool: state.ui.paint.brightnessTool,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    brightnessToolIntensity: (intensity) => dispatch(brightnessToolIntensity(intensity)),
    brightnessToolMode: (mode) => dispatch(brightnessToolMode(mode)),
    selectZoom: (zoom) => dispatch(selectZoom(zoom)),
    zoomIn: () => dispatch(zoomIn()),
    zoomOut: () => dispatch(zoomOut()),
    zoomFit: (fileSize) => dispatch(zoomFit(fileSize)),
  };
};

const ToolContainer = (props) => {
  const ToolComponent = components[props.tool];
  return <ToolComponent {...props} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolContainer);
