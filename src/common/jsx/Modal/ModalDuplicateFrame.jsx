var ModalDuplicateFrame = React.createClass({
  mixins: [FluxMixin, ModalBasicMixin],
  getInitialState: function() {
    return {
      source: this.props.ui.frames.selected,
      target: 1,
    }
  },
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Duplicate Frame</div>
        <div className="text">
          Copy a frame with its layers to another frame.<br />
          The target frame will be replaced.
          <ul>
            <li>
              <label>Source:</label>
              <input type="number" ref="source" value={this.state.source} min="1" max={this.props.ui.frames.total} onChange={this.updateForm} />
            </li>
            <li>
              <label>Target:</label>
              <input type="number" ref="target" value={this.state.target} min="1" max={this.props.ui.frames.total} onChange={this.updateForm} />
            </li>
          </ul>
        </div>
        <div className="actions">
          <button onClick={this.duplicateFrame}>Ok, do it!</button>
          <button onClick={this.hide}>Cancel</button>
        </div>
      </div>
    )
  },
  updateForm: function() {
    var source = +this.refs.source.getDOMNode().value,
        target = +this.refs.target.getDOMNode().value;

    this.setState({
      source: source,
      target: target,
    });
  },
  duplicateFrame: function() {
    if(this.state.source !== this.state.target) {
      this.getFlux().actions.pixelsSave();
      this.getFlux().actions.frameDuplicate(this.state.source, this.state.target);
    }
    this.hide();
  },
});