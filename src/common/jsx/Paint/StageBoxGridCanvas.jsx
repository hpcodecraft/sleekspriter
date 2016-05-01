var StageBoxGridCanvas = React.createClass({
  mixins: [StageBoxCanvasMixin],
  shouldComponentUpdate: function() {
    var valid = [constants.SETTINGS_GRID, constants.ZOOM_SELECT, constants.LAYER_SELECT];
    return inArray(valid, stateHistory.last.action);
  },
  render: function() {
    return (
      <canvas id="StageBoxGridCanvas" className="Layer" width={this.props.width} height={this.props.height} />
    );
  },
  componentDidMount: function() {
    if(this.props.ui.settings.grid === true) this.drawGrid();
  },
  componentDidUpdate: function() {
    if(this.props.ui.settings.grid === true) this.drawGrid();
    else this.clear();
  },
  drawGrid: function() {
    var canvas = ReactDOM.findDOMNode(this),
        zoom = this.props.ui.zoom.selected;

    if(zoom < 3) return;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#828282";

    ctx.beginPath();

    // vertical lines
    for(var x = zoom+0.5; x < canvas.width; x+= zoom) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }

    // horizontal lines
    for(var y = zoom+0.5; y < canvas.height; y+= zoom) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }

    ctx.stroke();
  },
});
