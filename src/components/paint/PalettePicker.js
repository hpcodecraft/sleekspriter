import React from "react";
import PropTypes from "prop-types";

import { t } from "../../utils";

class PalettePicker extends React.Component {
  constructor(props) {
    super(props);
    this.showPalettes = this.showPalettes.bind(this);
    this.selectPalette = this.selectPalette.bind(this);
  }

  render() {
    return (
      <div className="switch" onClick={this.showPalettes}>
        <i className="icon flaticon-color1" />
        <i className="switch-arrow flaticon-little9" />
        <div className="name">{this.props.palette.short}</div>
        <ul ref={n => (this.paletteList = n)} className="list">
          {this.props.palettes.map(function(palette, i) {
            return (
              <li key={i} data-palette={i} onClick={this.selectPalette}>
                {t("${palette} (${size} colours)", {
                  palette: palette.title,
                  size: palette.colors.length,
                })}
              </li>
            );
          }, this)}
        </ul>
      </div>
    );
  }

  showPalettes() {
    this.paletteList.style.display = "block";
  }

  hidePalettes() {
    this.paletteList.style.display = "none";
  }

  selectPalette(e) {
    e.stopPropagation();
    const palette = e.currentTarget.getAttribute("data-palette");
    this.hidePalettes();
    this.props.paletteSelect(palette);
  }
}

PalettePicker.propTypes = {
  palette: PropTypes.object.isRequired,
  palettes: PropTypes.array.isRequired,
  paletteSelect: PropTypes.func.isRequired,
};

export default PalettePicker;