var EyedropperTool = React.createClass({
  render: function() {
    return (
      <div id="Eyedropper-Tool" className="ToolComponent">
        <i className="icon-target"></i>
        <div id="EyedropperSwatch" className="colorswatch" style={{background: this.props.editor.pixelColor.rgbaString()}}></div>
        <ul>
          <li>Hex: {this.props.editor.pixelColor.alpha() == 0 ? '': this.props.editor.pixelColor.hexString()}</li>
          <li>RGB: {this.props.editor.pixelColor.alpha() == 0 ? '': this.props.editor.pixelColor.red()+', '+this.props.editor.pixelColor.green()+', '+this.props.editor.pixelColor.blue()}</li>
        </ul>
        <span className="hint">Click any non-transparent pixel to pick its color.</span>

      </div>
    );
  }
});