/** @jsx React.DOM */
var LayerBoxLayerPreview = React.createClass({
  mixins:[PostalSubscriptionMixin, LayerCanvasMixin],
  render: function() {
    var fit = fitCanvasIntoSquareContainer(this.props.width, this.props.height, 30);
    return (
      <canvas width={fit.width} height={fit.height} style={fit.style}></canvas>
    );
  }
});