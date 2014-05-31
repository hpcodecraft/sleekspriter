/** @jsx React.DOM */
var StageBox = React.createClass({
  getInitialState: function() {
    return {
      //needsRefresh: false,
      mousedown: false,
      mousedownPoint: new Point(0, 0),
      last: null, // we need to record the mousedown timestamp because of a chrome bug,
                  // see https://code.google.com/p/chromium/issues/detail?id=161464
                  // and http://stackoverflow.com/questions/14538743/what-to-do-if-mousemove-and-click-events-fire-simultaneously
    };
  },
  render: function() {

    var w = this.props.editor.size.width*this.props.editor.zoom,
        h = this.props.editor.size.height*this.props.editor.zoom,
        centerAreaWidth = window.innerWidth - editor.offset.left - editor.offset.right,
        centerAreaHeight = window.innerHeight - editor.offset.top - editor.offset.bottom;

    var css = {
      width: w,
      height: h,
    };

    if( w > centerAreaWidth ) css.left = 0;
    else css.left = (centerAreaWidth - w)/2;

    if( h > centerAreaHeight ) css.top = 0;
    else css.top = (centerAreaHeight - h)/2;

    return (
      <div id="StageBox"
        style={css}
        onMouseDown={this.mousedown}
        onMouseMove={this.mousemove}
        onMouseUp={this.mouseup}>

        <StageBoxCursorCanvas width={w} height={h} editor={this.props.editor} />
        <StageBoxSelectionCanvas width={w} height={h} editor={this.props.editor} />
        <StageBoxGridCanvas width={w} height={h} editor={this.props.editor} />

        {this.props.editor.layers.frame.map(function(layer) {
          var id = 'StageBoxLayer-'+layer.id;
          return (
            <StageBoxLayer
              key={id}
              csswidth={w}
              cssheight={h} 
              width={this.props.editor.size.width}
              height={this.props.editor.size.width}
              id={layer.id}
              layer={layer} />
          );
        }, this)}
      </div>
    );
  },
  componentDidMount: function() {
    this.subscriptions = [
      //channel.subscribe('app.frame.select', this.prepareRefresh),
      //channel.subscribe('stage.zoom.select', this.prepareRefresh),
    ];
  },
  /*
  prepareRefresh: function() {
    this.setState({needsRefresh: true});
  },
  componentDidUpdate: function() {
    if(this.state.needsRefresh) {
      //stage.frame.refresh();

      this.setState({needsRefresh: false});
    }
  },
  */

  mousedown: function(event) {

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event);

    switch(this.props.editor.tool) {

      case 'BrushTool':
        this.useBrushTool();
        break;

      case 'EraserTool':
        this.useEraserTool();
        break;

      case 'BrightnessTool':
        this.useBrightnessTool();
        break;

      case 'RectangularSelectionTool':
        this.startRectangularSelection(point);
        break;
    }

    this.setState({mousedown: true, mousedownPoint: point, last: event.timeStamp});
  },

  mousemove: function(event) {

    event = event.nativeEvent;

    this.getLayerPixelColor(event);

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance();

    if(event.timeStamp > this.state.last + 10) {
      channel.publish('app.pixel.select', {point: point});
    }

    if(this.state.mousedown === true) {

      switch(this.props.editor.tool) {

        case 'BrushTool':
          this.useBrushTool();
          break;

        case 'EraserTool':
          this.useEraserTool();
          break;

        case 'RectangularSelectionTool':
          if(editor.selection.isActive) this.updateRectangularSelection(distance);
          else this.resizeRectangularSelection(point);
          break;

        case 'BrightnessTool':
          this.useBrightnessTool();
          break;

        case 'MoveTool':
          this.useMoveTool();
          break;
      }
    }
  },

  mouseup: function(event) {

    event = event.nativeEvent;

    var point = this.getWorldCoordinates(event),
        distance = this.getMouseDownDistance(),
        selectionActive = editor.selection.isActive;

    this.setState({mousedown: false});

    switch(this.props.editor.tool) {

      case 'EyedropperTool':
        this.useEyedropperTool();
        break;

      case 'RectangularSelectionTool':
        this.endRectangularSelection(point, distance);
        break;

      case 'PaintBucketTool':
        this.usePaintBucketTool(point);
        break;

      case 'MoveTool':
        if(editor.selection.isActive) {
          channel.publish('stage.selection.move.pixels', {distance: distance});
          channel.publish('stage.selection.move.bounds', {distance: distance});
        }
        else channel.publish('stage.tool.move', {distance: distance});
        break;
    }
  },


  getLayerPixelColor: function(event) {
    var layer = file.getLayerById(this.props.editor.layers.selected),
        ctx = document.getElementById('StageBoxLayer-'+layer.id).getContext('2d'),
        px = ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data,
        color = Color({r:px[0], g:px[1], b:px[2], a:px[3]});

    editor.layerPixelColor = color;
  },
  getWorldCoordinates: function(event) {
    return new Point(
      Math.ceil(event.layerX/this.props.editor.zoom),
      Math.ceil(event.layerY/this.props.editor.zoom)
    );
  },
  getMouseDownDistance: function() {
    return new Point(
      editor.pixel.x - this.state.mousedownPoint.x,
      editor.pixel.y - this.state.mousedownPoint.y
    );
  },







  useBrushTool: function() {
    if(isLayerVisible()) {
      if(!editor.selection.isActive) {
        channel.publish('stage.pixel.fill', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: editor.pixel.x,
          y: editor.pixel.y,
          color: editor.color.hexString()
        });
      }
      else { // restrict to selection
        if(editor.selection.contains(editor.pixel)) {
          channel.publish('stage.pixel.fill', {
            frame: editor.frame,
            layer: editor.layers.selected,
            x: editor.pixel.x,
            y: editor.pixel.y,
            color: editor.color.hexString()
          });
        }
      }
    }
  },
  useEraserTool: function() {
    if(isLayerVisible()) {
      if(!editor.selection.isActive) {
        channel.publish('stage.pixel.clear', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: editor.pixel.x,
          y: editor.pixel.y,
        });
      }
      else { // restrict to selection
        if(editor.selection.contains(editor.pixel)) {
          channel.publish('stage.pixel.clear', {
            frame: editor.frame,
            layer: editor.layers.selected,
            x: editor.pixel.x,
            y: editor.pixel.y,
          });
        }
      }
    }
  },
  useEyedropperTool: function() {
    if(editor.pixelColor.alpha() == 0) return;
    channel.publish('app.tool.select', {tool: 'BrushTool'});
    channel.publish('app.color.select', {color: editor.pixelColor.hexString()});
  },
  usePaintBucketTool: function(point) {
    if(isLayerVisible()) {
      if(editor.selection.isActive) {
        if(editor.selection.contains(point)) channel.publish('stage.tool.paintbucket', {point: point});
      }
      else channel.publish('stage.tool.paintbucket', {point: point});
    }
  },
  useBrightnessTool: function() {
    if(isLayerVisible()) {

      function lighten() {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.layerPixelColor, editor.brightnessTool.intensity);
        channel.publish('stage.pixel.fill', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: editor.pixel.x,
          y: editor.pixel.y,
          color: newColor.hexString()
        });
      };

      function darken() {
        if(editor.layerPixelColor.alpha() == 0) return; // skip transparent pixels
        var newColor = changeColorLightness(editor.layerPixelColor, -editor.brightnessTool.intensity);
        channel.publish('stage.pixel.fill', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: editor.pixel.x,
          y: editor.pixel.y,
          color: newColor.hexString()
        });
      };

      var px = _.findWhere(editor.pixels, {layer: editor.layers.selected, x: editor.pixel.x, y: editor.pixel.y }),
          pixelExists = !_.isUndefined(px);

      if(pixelExists) {
        if(!editor.selection.isActive) {
          if(editor.brightnessTool.mode == 'lighten') lighten();
          else if(editor.brightnessTool.mode == 'darken') darken();
        }
        else { // restrict to selection
          if(editor.selection.contains(editor.pixel)) {
            if(editor.brightnessTool.mode == 'lighten') lighten();
            else if(editor.brightnessTool.mode == 'darken') darken();
          }
        }
      }
    }
  },
  useMoveTool: function() {

    var distance = this.getMouseDownDistance(),
        canvas = document.getElementById('StageBoxLayer-'+editor.layers.selected);

    canvas.width = canvas.width;

    if(editor.selection.isActive) {

      this.updateRectangularSelection(distance);

      editor.selection.pixels.forEach(function(pixel) {
        var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')'),
            target = wrapPixel(pixel, distance);

        channel.publish('stage.pixel.fill', {
          frame: editor.frame,
          layer: editor.layers.selected,
          x: target.x,
          y: target.y,
          color: color.hexString()
        });
      });

      editor.pixels.forEach(function(pixel) {
        if(pixel.layer == editor.layers.selected) {
          var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')');
          channel.publish('stage.pixel.fill', {
            frame: editor.frame,
            layer: editor.layers.selected,
            x: pixel.x,
            y: pixel.y,
            color: color.hexString()
          });
        }
      });
    }
    else {
      editor.pixels.forEach(function(pixel) {
        if(pixel.layer == editor.layers.selected) {
          var color = new Color('rgb('+pixel.r+', '+pixel.g+', '+pixel.b+')'),
              target = wrapPixel(pixel, distance);

          channel.publish('stage.pixel.fill', {
            frame: editor.frame,
            layer: editor.layers.selected,
            x: target.x,
            y: target.y,
            color: color.hexString()
          });
        }
      });
    }
  },

  startRectangularSelection: function(point) {
    if(!editor.selection || !editor.selection.contains(point)) {
      channel.publish('stage.selection.clear');
      channel.publish('stage.selection.start', {point: point});
    }
  },
  resizeRectangularSelection: function(point) {
    channel.publish('stage.selection.resize', {point: point});
  },
  updateRectangularSelection: function(distance) {
    channel.publish('stage.selection.update', {distance: distance});
  },
  endRectangularSelection: function(point, distance) {
    if(editor.selection.isActive) {
      channel.publish('stage.selection.move.bounds', {distance: distance});
    }
    else {
      if(_.isEqual(point, this.state.mousedownPoint))
        channel.publish('stage.selection.clear');
      else
        channel.publish('stage.selection.end', {point: point});
    }
  },

});