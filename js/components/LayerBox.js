var LayerBox = React.createClass({
  mixins: [FoldableMixin],
  getInitialState: function() {
    return {
      shouldSelectLayer: false
    }
  },
  render: function() {
    var frameLayers = _.where(this.props.file.layers, {frame: this.props.editor.frame});
    var disabled = frameLayers.length <= 1 ? true : false;
    return (
      <div id="LayerBox" className="box">
        <h4 className="foldable-handle">Layers</h4>
        <div className="foldable-fold">
          <div className="layers">
            {this.props.file.layers.map(function(layer) {
              var visible = (layer.frame == this.props.editor.frame) ? true : false;
              var id = 'LayerBoxLayer-'+layer.id;
              return (
                <LayerBoxLayer key={id} layer={layer} size={this.props.file.size} editor={this.props.editor} signal={this.props.signal} visible={visible} />
              );
            }, this)}
          </div>
          <div className="actions">
            <button title="New layer above selected layer" onClick={this.dispatchLayerAdded} className="tiny transparent"><i className="flaticon-plus25"></i></button>
            <button title="Delete selected layer" onClick={this.dispatchLayerRemoved} className="tiny transparent" disabled={disabled}><i className="flaticon-minus18"></i></button>
          </div>
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    this.props.signal.layerAdded.add(this.shouldSelectLayer);
    this.props.signal.layerRemoved.add(this.shouldSelectLayer);
  },
  componentDidUpdate: function() {
    if(this.state.shouldSelectLayer !== false) {
      this.props.signal.layerSelected.dispatch(this.state.shouldSelectLayer);
      this.setState({ shouldSelectLayer: false });
    }

    var h = this.calculateHeight();
    this.getDOMNode().querySelector('.layers').style.maxHeight = h+'px';
  },
  dispatchLayerAdded: function(event) {
    this.props.signal.file.layerAdded.dispatch(this.props.editor.layer);
  },
  dispatchLayerRemoved: function(event) {
    this.props.signal.file.layerRemoved.dispatch(this.props.editor.layer);
  },
  shouldSelectLayer: function(layer) {
    this.setState({ shouldSelectLayer: layer });
  },
  calculateHeight: function() {
    var areaRightHeight = document.querySelector('.area.right').clientHeight,
        otherBoxesHeight = document.getElementById('layerboxhelper').clientHeight;

    return areaRightHeight - otherBoxesHeight - 47;
  },
});