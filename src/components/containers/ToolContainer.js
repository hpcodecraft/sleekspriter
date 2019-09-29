import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import * as components from "../paint/tools";

import {
  brightnessToolIntensity,
  brightnessToolMode,
  brushColor,
  zoomIn,
  zoomOut,
  zoomSelect,
  zoomFit,
} from "../../state/actions";

import {
  getBrightnessTool,
  getBrushColor,
  getFileSize,
  getTool,
  getZoom,
} from "../../state/selectors";

const mapStateToProps = state => ({
  tool: getTool(state),
  color: getBrushColor(state),
  zoom: getZoom(state),
  fileSize: getFileSize(state),
  brightnessTool: getBrightnessTool(state),
});

const mapDispatchToProps = {
  brightnessToolIntensity,
  brightnessToolMode,
  brushColor,
  zoomIn,
  zoomOut,
  zoomSelect,
  zoomFit,
};

const ToolContainer = props => {
  const ToolComponent = components[props.tool];
  return <ToolComponent {...props} />;
};

ToolContainer.propTypes = {
  tool: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolContainer);