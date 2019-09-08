import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { FrameCanvas } from "../canvases";
import { sizeShape } from "../../shapes";

const ExportPreviewSingleFrame = ({
  background,
  format,
  frame,
  size,
  pixels,
  zoom,
}) => {
  const classes = {
    preview: true,
    checkerboard: !!(format === "png" || format === "gif"),
  };
  const style = {
    width: size.width * zoom,
    height: size.height * zoom,
  };

  background = format === "jpeg" ? background : null;

  return (
    <div className={classnames(classes)} style={style}>
      <FrameCanvas
        frame={frame}
        size={size}
        zoom={zoom}
        pixels={pixels[frame] || null}
        background={background}
      />
    </div>
  );
};

ExportPreviewSingleFrame.propTypes = {
  background: PropTypes.string,
  format: PropTypes.string.isRequired,
  frame: PropTypes.number.isRequired,
  pixels: PropTypes.object.isRequired,
  size: sizeShape.isRequired,
  zoom: PropTypes.number.isRequired,
};

export default ExportPreviewSingleFrame;
