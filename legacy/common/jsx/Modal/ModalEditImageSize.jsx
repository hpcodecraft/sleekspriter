var ModalEditImageSize = React.createClass({
  mixins: [FluxMixin, TouchMixin, ModalBasicMixin],
  getInitialState: function() {
    return {
      frames: {
        x: flux.stores.FileStore.getData().frames.x,
        y: flux.stores.FileStore.getData().frames.y,
      },
      pixels: {
        x: flux.stores.FileStore.getData().size.width,
        y: flux.stores.FileStore.getData().size.height,
      },
    }
  },
  render: function() {

    var fileType = this.state.frames.x * this.state.frames.y === 1 ? 'Image' : 'Spritesheet';

    var wrapperCss = {
      width: this.state.pixels.x*this.state.frames.x,
      height: this.state.pixels.y*this.state.frames.y
    };

    return (
      <div className="dialog">
        <div className="title">Image size</div>
        <div className="text">

          <div className="new-file-preview">
            <div className="new-file-preview-headline">Layout preview</div>
            <div className="new-file-preview-content" style={wrapperCss}>
              <GridCanvas
                width={wrapperCss.width}
                height={wrapperCss.height}
                columns={this.state.frames.x}
                rows={this.state.frames.y} />
            </div>
          </div>

          <ul className="new-file-frame-size">
            <li>
              <label>Frames:</label>
              <input type="number" ref="framesX" value={this.state.frames.x} min="1" onChange={this.updateForm} />
              x
              <input type="number" ref="framesY" value={this.state.frames.y} min="1" onChange={this.updateForm} />
            </li>
            <li>
              <label>Frame size:</label>
              <input type="number" ref="pixelsX" value={this.state.pixels.x} min="1" onChange={this.updateForm} />
              x
              <input type="number" ref="pixelsY" value={this.state.pixels.y} min="1" onChange={this.updateForm} />
              px
            </li>
            <li>
              <i ref="size">{fileType} size: {this.state.frames.x*this.state.pixels.x}x{this.state.frames.y*this.state.pixels.y} pixels</i>
            </li>
          </ul>
        </div>
        <div className="actions">
          <button onClick={this.handleClick.bind(this, this.updateFile)} onTouchStart={this.handleTouch.bind(this, this.updateFile)}>Ok</button>
          <button onClick={this.handleClick.bind(this, this.hide)} onTouchStart={this.handleTouch.bind(this, this.hide)}>Cancel</button>
        </div>
      </div>
    )
  },
  updateFile: function() {
    var framesX = +this.refs.framesX.value,
        framesY = +this.refs.framesY.value,
        pixelsX = +this.refs.pixelsX.value,
        pixelsY = +this.refs.pixelsY.value;

    this.getFlux().actions.fileSize(framesX, framesY, pixelsX, pixelsY);
    this.hide();
  },
  updateForm: function() {
    var size = {
      frames: {
        x: this.refs.framesX.value,
        y: this.refs.framesY.value,
      },
      pixels: {
        x: this.refs.pixelsX.value,
        y: this.refs.pixelsY.value,
      },
    };
    this.setState(size);
  },
});