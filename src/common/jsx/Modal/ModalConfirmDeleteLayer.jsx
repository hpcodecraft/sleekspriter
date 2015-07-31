var ModalConfirmDeleteLayer = React.createClass({
  mixins: [FluxMixin, ModalBasicMixin],
  render: function() {
    var layer = storeUtils.layers.getSelected();
    return (
      <div className="dialog">
        <div className="title">Confirmation needed</div>
        <div className="text">Are you sure you want to delete the layer "{layer.name}"?</div>
        <div className="actions">
          <button onClick={this.deleteLayer}>Delete layer</button>
          <button onClick={this.hide}>Cancel</button>
        </div>
      </div>
    )
  },
  deleteLayer: function() {
    channel.file.publish('layer.delete', {layer: this.props.ui.layers.selected});
    this.hide();
  },
});