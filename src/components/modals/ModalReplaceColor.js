import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { t } from "../../utils";
import { colorReplace, modalHide } from "../../state/actions";
import {
  getFilePixels,
  getFileSize,
  getPaintFrame,
  getPaintLayerId,
  getSelection,
  getSpritePalette,
} from "../../state/selectors";
import { ColorswatchPicker } from "../common";
import Palette from "../paint/Palette";
import { sizeShape, selectionShape } from "../../shapes";

const mapStateToProps = state => ({
  frame: getPaintFrame(state),
  layer: getPaintLayerId(state),
  palette: getSpritePalette(state),
  pixels: getFilePixels(state),
  selection: getSelection(state),
  size: getFileSize(state),
});

const mapDispatchToProps = { colorReplace, modalHide };

class ModalReplaceColor extends React.Component {
  constructor(props) {
    super(props);

    const color = this.props.palette[0] || null;

    this.state = {
      color,
      newColor: "#ffffff",
      scope: "layer",
    };
  }

  render() {
    return (
      <div className="dialog modal-replace-color">
        <div className="title">{t("Replace color")}</div>
        <div className="text">
          <label>Replace</label>
          <div className="from">
            <Palette
              colors={this.props.palette}
              action={color => this.setState({ color: color })}
              selected={this.state.color}
            />
          </div>
          <label style={{ margin: "5px 0" }}>with</label>
          <div className="to">
            <ColorswatchPicker
              color={this.state.newColor}
              action={color => this.setState({ newColor: color })}
            />
          </div>
          <ul className="horizontal">
            <li>
              <label>in</label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="scope"
                  value="layer"
                  onChange={e => this.setScope(e)}
                  checked={this.setCheckedForReplaceIn("layer")}
                />
                Layer/Selection
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="scope"
                  value="frame"
                  onChange={e => this.setScope(e)}
                  checked={this.setCheckedForReplaceIn("frame")}
                />
                Frame
              </label>
            </li>
            <li>
              <label>
                <input
                  type="radio"
                  name="scope"
                  value="spritesheet"
                  onChange={e => this.setScope(e)}
                  checked={this.setCheckedForReplaceIn("spritesheet")}
                />
                Spritesheet
              </label>
            </li>
          </ul>
        </div>
        <div className="actions">
          <button onClick={() => this.replaceColor()}>{t("Ok")}</button>
          <button onClick={this.props.modalHide}>{t("Cancel")}</button>
        </div>
      </div>
    );
  }

  setScope(e) {
    this.setState({ scope: e.target.value });
  }

  setCheckedForReplaceIn(checkbox) {
    return this.state.scope === checkbox;
  }

  replaceColor() {
    const { color, newColor, scope } = this.state;
    const {
      colorReplace,
      modalHide,
      pixels,
      frame,
      layer,
      selection,
      size,
    } = this.props;
    colorReplace(color, newColor, scope, frame, layer, selection, size, pixels);
    modalHide();
  }
}

ModalReplaceColor.propTypes = {
  colorReplace: PropTypes.func.isRequired,
  modalHide: PropTypes.func.isRequired,
  palette: PropTypes.array.isRequired,
  pixels: PropTypes.object,
  frame: PropTypes.number.isRequired,
  layer: PropTypes.number.isRequired,
  selection: selectionShape.isRequired,
  size: sizeShape.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalReplaceColor);