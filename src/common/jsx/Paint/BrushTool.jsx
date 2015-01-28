var BrushTool = React.createClass({
  render: function() {
    var hex = editor.color.brush.hexString();
    return (
      <div id="Brush-Tool" className="ToolComponent">
        <i className="icon flaticon-small23"/>
        <input type="color" id="Brush-Colorpicker" className="ColorSwatch" value={hex} onChange={this.dispatchColorSelected} title={hex} />
        <span className="spacer"/>
        <Palette editor={this.props.editor} />
      </div>
    );
  },
  dispatchColorSelected: function(event) {
    var color = event.target.value;
    channel.gui.publish('color.select', {color: color});
  }
});