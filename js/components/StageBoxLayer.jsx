/** @jsx React.DOM */
var StageBoxLayer = React.createClass({
  mixins:[ResetStateMixin, PostalSubscriptionMixin, LayerCanvasMixin],
  render: function() {
    var display = (this.props.layer.visible === true) ? 'block' : 'none';
    return (
      <canvas
        id={this.props.key}
        className="Layer"
        width={this.props.csswidth}
        height={this.props.cssheight}
        style={{
          zIndex: this.props.layer.z,
          opacity: this.props.layer.opacity/100,
          display: display,
          width: this.props.csswidth,
          height: this.props.cssheight
        }}>
      </canvas>
    );
  },
});