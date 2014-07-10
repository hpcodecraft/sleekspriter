/** @jsx React.DOM */
var FrameBoxFrame = React.createClass({
  mixins: [ResetStateMixin, PostalSubscriptionMixin, FrameCanvasMixin],
  render: function() {
    var fit = fitCanvasIntoSquareContainer(this.props.width, this.props.height, this.props.size);
    return (
      <canvas width={fit.width} height={fit.height} style={fit.style}/>
    );
  }
});