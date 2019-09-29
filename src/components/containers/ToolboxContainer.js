import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ToolboxTool from "../paint/ToolboxTool";

import { toolSelect } from "../../state/actions";
import { getTool } from "../../state/selectors";
import { t } from "../../utils";

import { Hotkeys } from "../../classes";

const bindings = Hotkeys.bindings.paint;
const [
  brush,
  eraser,
  eyedropper,
  selection,
  paintbucket,
  brightness,
  move,
  zoom,
] = bindings;

const mapStateToProps = state => ({
  tool: getTool(state),
});

const mapDispatchToProps = { toolSelect };

class ToolboxContainer extends React.Component {
  render() {
    const tools = [
      {
        id: "BrushTool",
        icon: "flaticon-small23",
        title: t("Brush Tool", { key: brush.key }),
      },
      {
        id: "EraserTool",
        icon: "flaticon-double31",
        title: t("Eraser Tool", { key: eraser.key }),
      },
      {
        id: "EyedropperTool",
        icon: "flaticon-eyedropper2",
        title: t("Eyedropper Tool", { key: eyedropper.key }),
      },
      {
        id: "RectangularSelectionTool",
        icon: "flaticon-selection7",
        title: t("Selection Tool", { key: selection.key }),
      },
      {
        id: "PaintbucketTool",
        icon: "flaticon-paint2",
        title: t("Paint Bucket Tool", { key: paintbucket.key }),
      },
      {
        id: "BrightnessTool",
        icon: "flaticon-sun4",
        title: t("Brightness Tool", { key: brightness.key }),
      },
      {
        id: "MoveTool",
        icon: "flaticon-move11",
        title: t("Move Tool", { key: move.key }),
      },
      {
        id: "ZoomTool",
        icon: "flaticon-magnifier5",
        title: t("Zoom Tool", { key: zoom.key }),
      },
    ];

    return (
      <div id="ToolBox">
        <h4>{t("Tools")}</h4>
        <div>
          {tools.map(function(tool) {
            return (
              <ToolboxTool
                key={tool.id}
                id={tool.id}
                icon={tool.icon}
                selected={tool.id === this.props.tool}
                title={tool.title}
                toolSelect={this.props.toolSelect}
              />
            );
          }, this)}
        </div>
      </div>
    );
  }
}

ToolboxContainer.propTypes = {
  tool: PropTypes.string.isRequired,
  toolSelect: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolboxContainer);