import React from "react";
import classnames from "classnames";

import NameEditable from "../common/NameEditable";

class LayerboxLayer extends React.Component {
  render() {
    const
      htmlId    = "LayerBoxLayer-"+this.props.layer.id,
      cssClass  = classnames({
        LayerBoxLayer: true,
        selected: this.props.selected,
        first: this.props.position === 0,
        last: this.props.position === this.props.layerCount - 1, // this.props.position === this.props.ui.layers.frame.length - 1,
      });

    return (
      <div id={htmlId} className={cssClass}>
        <div className="order up" onClick={::this.moveUp}>
          <i className="flaticon-little16"></i>
        </div>
        <div className="visibility">
          <input type="checkbox" checked={this.props.layer.visible} onChange={::this.visibility} />
        </div>
        <div className="preview" onClick={::this.select}>
          {/*<LayerCanvas layer={this.props.layer.id} zoom={this.props.ui.zoom.selected} file={this.props.file} pixels={this.props.pixels} maxSize={30} />*/}
        </div>
        <NameEditable name={this.props.layer.name} callback={::this.name} />
        <input type="range" className="opacity-slider" min="0" max="100" value={this.props.layer.opacity} onChange={::this.opacity} />
        <input type="number" className="opacity-number" min="0" max="100" value={this.props.layer.opacity} onChange={::this.opacity} />
        <div className="order down" onClick={::this.moveDown}>
          <i className="flaticon-little16"></i>
        </div>
      </div>
    );
  }

  opacity(e) {
    this.props.layerOpacity(this.props.layer.id, e.target.value);
  }

  visibility(e) {
    this.props.layerVisibility(this.props.layer.id, e.target.checked);
  }

  select() {
    this.props.layerSelect(this.props.layer.id);
  }

  name(name) {
    this.props.layerName(this.props.layer.id, name);
  }

  moveUp() {
    console.log('move up');
  }

  moveDown() {
    console.log('move down');
  }
}

export default LayerboxLayer;
