var ScreenExport = React.createClass({
  mixins: [PostalSubscriptionMixin],
  getInitialState: function() {
    return {
      part: 'spritesheet',
      frame: 1,
      animation: null,
      zoom: 1,
      format: 'png',
      subscriptions: {
        'export.part.set': this.updateSettings,
        'export.frame.set': this.updateSettings,
        'export.animation.set': this.updateSettings,
        'export.zoom.set': this.updateSettings,
        'export.format.set': this.updateSettings,
      },
    }
  },
  render: function() {
    return (
      <section className="screen export">
        <div className="area left">
          <h5>Settings</h5>
          <ExportPartSelection editor={this.props.editor} part={this.state.part} frame={this.state.frame} />
          <ExportZoomSelection zoom={this.state.zoom} part={this.state.part} dimensions={this.props.editor.file.size} frames={this.props.editor.frames} />
          <ExportOutputSelection format={this.state.format} part={this.state.part} />
          <ExportButton editor={this.props.editor} format={this.state.format} part={this.state.part} frame={this.state.frame} />
        </div>

        <div className="area right">
          <ExportPreviewBox 
            part={this.state.part}
            frame={this.state.frame}
            animation={this.state.animation}
            zoom={this.state.zoom} 
            format={this.state.format}
            dimensions={this.props.editor.file.size}
            frames={this.props.editor.frames} />
        </div>

        <div className="area statusbar">
          <ExportStatus />
        </div>
      </section>
    )
  },
  componentDidUpdate: function() {
    if(this.state.animation === null && this.props.editor.animations.list.length > 0) {
      this.setState({animation: this.props.editor.animations.list[0].name});
    }
  },
  updateSettings: function(data) {
    this.setState(data);
  },
});