import React from "react";
import classnames from "classnames";
import config from "../../config";
import { FrameCanvas, GridCanvas } from "../canvases";
import { Color, Point } from "../../classes";
import StageboxCursorCanvas from "./StageboxCursorCanvas";
import StageboxSelectionCanvas from "./StageboxSelectionCanvas";
import StageboxLayer from "./StageboxLayer";
import _ from "lodash";
import { getPixelsInScope, selectionIsActive, insideBounds } from "../../utils";
import paintbucketWorker from "../../workers/paintbucket";

class Stagebox extends React.Component {
  constructor(props) {
    super(props);

    this.mouse = {
      down: false,
      downStart: { x: 0, y: 0 },
    };

    this.cursor = {
      x: 0,
      y: 0,
    };

    this.cursorColor = "transparent";

    this.pixels = {}; // a map of pixels filled by the tools and then batch-sent to redux
    this.layerVisibilityMap = {}; // a helper map for easy access to layer visibilty
    this.layerBackup = null; // a backup canvas for MoveTool
    this.layers = {}; // layer refs

    this.mousedown = this.mousedown.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mouseout = this.mouseout.bind(this);
  }

  componentWillMount() {
    this.worker = new paintbucketWorker();

    this.worker.onmessage = m => {
      document.getElementById("ScreenBlocker").style.display = "none";
      this.props.pixelsAdd(this.props.frame, this.props.layer, m.data);
    };

    this.worker.onfail = e => {
      console.error(
        `worker failed in line ${e.lineno} with message: ${e.message}`
      );
      document.getElementById("ScreenBlocker").style.display = "none";
    };
  }

  render() {
    const { onionFrameAbsolute, size, tool, zoom } = this.props,
      w = size.width * zoom,
      h = size.height * zoom,
      centerAreaWidth =
        window.innerWidth - config.offset.left - config.offset.right,
      centerAreaHeight =
        window.innerHeight - config.offset.top - config.offset.bottom;

    let style = {
      width: w,
      height: h,
    };

    if (w > centerAreaWidth) style.left = 0;
    else style.left = (centerAreaWidth - w) / 2;

    // if (style.left < 5) style.left = 5;

    if (h > centerAreaHeight) style.top = 0;
    else style.top = (centerAreaHeight - h) / 2;

    // if (style.top < 5) style.top = 5;

    const cssClasses = classnames({
      checkerboard: !this.props.image,
    });

    let grid = null;
    if (this.props.grid === true) {
      grid = (
        <GridCanvas width={w} height={h} columns={w / zoom} rows={h / zoom} />
      );
    }

    let onion = null;
    if (this.props.onion === true) {
      let pixels;
      try {
        pixels = this.props.pixels[onionFrameAbsolute];
      } catch (e) {
        pixels = null;
      }

      onion = (
        <div id="StageBoxOnionCanvas" className="Layer">
          <FrameCanvas
            frame={onionFrameAbsolute}
            size={size}
            zoom={zoom}
            pixels={pixels}
          />
        </div>
      );
    }

    return (
      <div
        id="StageBox"
        className={cssClasses}
        style={style}
        onMouseDown={this.mousedown}
        onMouseMove={this.mousemove}
        onMouseOut={this.mouseout}
        onMouseUp={this.mouseup}>
        <StageboxCursorCanvas
          ref={n => (this.cursorCanvas = n)}
          width={w}
          height={h}
          zoom={zoom}
        />
        <StageboxSelectionCanvas
          ref={n => (this.selectionCanvas = n)}
          width={w}
          height={h}
          zoom={zoom}
          selection={this.props.selection}
          tool={tool}
        />
        {grid}

        {this.props.layers.map(function(layer) {
          const pixels = this.getLayerPixels(layer.id);
          return (
            <StageboxLayer
              key={layer.id}
              layer={layer}
              pixels={pixels}
              size={size}
              zoom={zoom}
              ref={n => (this.layers[layer.id] = n)}
            />
          );
        }, this)}

        {onion}
      </div>
    );
  }

  componentDidMount() {
    this.createLayerVisibilityMap();
  }

  componentDidUpdate() {
    this.createLayerVisibilityMap();
  }

  mousedown(e) {
    const point = this.getCoordinatesOnImage(e);

    this.mouse = {
      down: true,
      downStart: point,
    };

    switch (this.props.tool) {
      case "BrushTool":
        this.useBrushTool(point);
        break;
      case "BrightnessTool":
        this.useBrightnessTool(point);
        break;
      case "EraserTool":
        this.useEraserTool(point);
        break;
      case "EyedropperTool":
        this.useEyedropperTool();
        break;
      case "MoveTool":
        this.startMoveTool();
        break;
      case "PaintbucketTool":
        this.usePaintBucketTool(point);
        break;
      case "RectangularSelectionTool":
        this.startRectangularSelection(point);
        break;
      case "ZoomTool":
        this.useZoomTool();
    }
  }

  mousemove(e) {
    const point = this.getCoordinatesOnImage(e);
    this.updateCursor(point);

    if (this.mouse.down) {
      switch (this.props.tool) {
        case "BrushTool":
          this.useBrushTool(point);
          break;
        case "BrightnessTool":
          this.useBrightnessTool(point);
          break;
        case "EraserTool":
          this.useEraserTool(point);
          break;
        case "MoveTool":
          this.previewMoveTool();
          break;
        case "RectangularSelectionTool":
          this.resizeRectangularSelection(point);
          break;
      }
    }
  }

  mouseout() {
    this.cursorCanvas.clear();
    this.finishTool();

    document.getElementById("StatusBarCursorX").innerHTML = "X: 0";
    document.getElementById("StatusBarCursorY").innerHTML = "Y: 0";
  }

  mouseup() {
    this.finishTool();
  }

  updateCursor(point) {
    if (
      point.x > 0 &&
      point.y > 0 &&
      (point.x !== this.cursor.x || point.y !== this.cursor.y)
    ) {
      // update cursor position
      this.cursor = point;
      this.cursorCanvas.drawPixelCursor(point.x, point.y);

      document.getElementById("StatusBarCursorX").innerHTML = `X: ${point.x}`;
      document.getElementById("StatusBarCursorY").innerHTML = `Y: ${point.y}`;

      // update color under cursor
      let cursorColorHex, cursorColorRGB;
      try {
        const currentPixel = this.props.pixels[this.props.frame][
            this.props.layer
          ][point.x][point.y],
          cursorColor = new Color({
            rgb: [currentPixel.r, currentPixel.g, currentPixel.b],
          });
        cursorColorHex = cursorColor.hex();
        cursorColorRGB = cursorColor.rgbHuman();
      } catch (e) {
        cursorColorHex = "transparent";
        cursorColorRGB = "-, -, -";
      }

      this.cursorColor = cursorColorHex;

      document.getElementById(
        "StatusBarColor"
      ).style.backgroundColor = cursorColorHex;
      document.getElementById(
        "StatusBarColorString"
      ).innerHTML = cursorColorHex;

      if (this.props.tool == "EyedropperTool") {
        document.getElementById(
          "EyedropperSwatch"
        ).style.backgroundColor = cursorColorHex;
        document.getElementById("EyedropperHex").innerHTML = cursorColorHex;
        document.getElementById("EyedropperRGB").innerHTML = cursorColorRGB;
      }
    }
  }

  getCoordinatesOnImage({ nativeEvent }) {
    return new Point(
      Math.ceil(nativeEvent.layerX / this.props.zoom),
      Math.ceil(nativeEvent.layerY / this.props.zoom)
    );
  }

  finishTool() {
    if (this.mouse.down) {
      switch (this.props.tool) {
        case "BrushTool":
        case "BrightnessTool":
          this.props.pixelsAdd(this.props.frame, this.props.layer, this.pixels);
          this.pixels = {};
          break;
        case "EraserTool":
          this.props.pixelsDelete(
            this.props.frame,
            this.props.layer,
            this.pixels,
            this.props.pixels
          );
          this.pixels = {};
          break;
        case "MoveTool":
          this.endMoveTool();
          break;
        case "RectangularSelectionTool":
          this.endRectangularSelection(this.cursor); //, distance);
          break;
      }

      this.mouse.down = false;
    }
  }

  useBrushTool(point) {
    if (this.layerIsVisible()) {
      if (
        !selectionIsActive(this.props.selection) ||
        insideBounds(this.props.selection, this.cursor)
      ) {
        const color = new Color({ hex: this.props.color }),
          p = {
            frame: this.props.frame,
            layer: this.props.layer,
            x: point.x,
            y: point.y,
            r: color.r,
            g: color.g,
            b: color.b,
            a: 1,
          };

        _.merge(this.pixels, {
          [point.x]: {
            [point.y]: p,
          },
        });

        const layerCanvas = this.layers[this.props.layer].layerCanvas
          .decoratoredCanvas;
        layerCanvas.paintPixel({
          x: p.x,
          y: p.y,
          layer: this.props.layer,
          color: this.props.color,
        });
      }
    }
  }

  useEyedropperTool() {
    if (this.cursorColor == "transparent") return;
    this.props.toolSelect("BrushTool");
    this.props.brushColor(this.cursorColor);
  }

  useBrightnessTool(point) {
    if (this.layerIsVisible()) {
      if (this.cursorColor == "transparent") return;
      if (
        !selectionIsActive(this.props.selection) ||
        insideBounds(this.props.selection, this.cursor)
      ) {
        const intensity =
            this.props.brightnessTool.mode === "lighten"
              ? this.props.brightnessTool.intensity
              : -this.props.brightnessTool.intensity,
          color = new Color({ hex: this.cursorColor }).changeBrightness(
            intensity
          ),
          p = {
            frame: this.props.frame,
            layer: this.props.layer,
            x: point.x,
            y: point.y,
            r: color.r,
            g: color.g,
            b: color.b,
            a: 1,
          };

        _.merge(this.pixels, {
          [point.x]: {
            [point.y]: p,
          },
        });

        const layerCanvas = this.layers[this.props.layer].layerCanvas
          .decoratoredCanvas;
        layerCanvas.paintPixel({
          x: p.x,
          y: p.y,
          layer: this.props.layer,
          color: color.hex(),
        });
      }
    }
  }

  useEraserTool(point) {
    if (this.layerIsVisible()) {
      if (this.cursorColor == "transparent") return;
      if (
        !selectionIsActive(this.props.selection) ||
        insideBounds(this.props.selection, this.cursor)
      ) {
        const p = {
          frame: this.props.frame,
          layer: this.props.layer,
          x: point.x,
          y: point.y,
        };

        _.merge(this.pixels, {
          [point.x]: {
            [point.y]: p,
          },
        });

        const layerCanvas = this.layers[this.props.layer].layerCanvas
          .decoratoredCanvas;
        layerCanvas.clearPixel({ x: p.x, y: p.y, layer: this.props.layer });
      }
    }
  }

  useZoomTool() {
    this.props.zoomIn();
  }

  startMoveTool() {
    this.layerBackup = document.createElement("canvas");

    const canvas = document
        .getElementById(`StageBoxLayer-${this.props.layer}`)
        .querySelector("canvas"),
      backupCtx = this.layerBackup.getContext("2d");

    this.layerBackup.width = canvas.width;
    this.layerBackup.height = canvas.height;

    // save main canvas contents
    backupCtx.drawImage(canvas, 0, 0);
  }

  previewMoveTool() {
    if (this.layerIsVisible()) {
      const distance = this.getMouseDownDistance(),
        offset = {
          x: distance.x * this.props.zoom,
          y: distance.y * this.props.zoom,
        },
        canvas = document
          .getElementById(`StageBoxLayer-${this.props.layer}`)
          .querySelector("canvas"),
        ctx = canvas.getContext("2d");

      canvas.width = canvas.width;

      if (!selectionIsActive(this.props.selection)) {
        ctx.drawImage(this.layerBackup, offset.x, offset.y);
      } else {
        // draw the whole image
        ctx.drawImage(this.layerBackup, 0, 0);
        // clear out selection
        const selectionX = (this.props.selection.start.x - 1) * this.props.zoom,
          selectionY = (this.props.selection.start.y - 1) * this.props.zoom,
          selectionWidth =
            (this.props.selection.end.x - this.props.selection.start.x + 1) *
            this.props.zoom,
          selectionHeight =
            (this.props.selection.end.y - this.props.selection.start.y + 1) *
            this.props.zoom;

        ctx.clearRect(selectionX, selectionY, selectionWidth, selectionHeight);
        // draw the selection
        ctx.drawImage(
          this.layerBackup,
          selectionX,
          selectionY,
          selectionWidth,
          selectionHeight,
          selectionX + offset.x,
          selectionY + offset.y,
          selectionWidth,
          selectionHeight
        );

        // move the selection canvas
        document.querySelector("#StageBoxSelectionCanvas").style.left = `${
          offset.x
        }px`;
        document.querySelector("#StageBoxSelectionCanvas").style.top = `${
          offset.y
        }px`;
      }
    }
  }

  endMoveTool() {
    const { frame, layer, pixels, selection, size } = this.props,
      distance = this.getMouseDownDistance(),
      // pixels = this.getLayerPixels(this.props.layer);
      scopedPixels = getPixelsInScope(frame, layer, pixels, selection);

    // move pixels
    this.props.pixelsMove(frame, layer, scopedPixels, distance, size);

    // move selection
    if (selectionIsActive(selection)) {
      this.props.selectionMove(distance);
    }

    // reset styles set by MoveTool preview
    document.querySelector("#StageBoxSelectionCanvas").style.left = "";
    document.querySelector("#StageBoxSelectionCanvas").style.top = "";

    this.layerBackup = null;
  }

  usePaintBucketTool(point) {
    if (this.layerIsVisible()) {
      if (
        !selectionIsActive(this.props.selection) ||
        insideBounds(this.props.selection, this.cursor)
      ) {
        document.getElementById("ScreenBlocker").style.display = "block";

        let layerZ;
        this.props.layers.map(layer => {
          if (layer.id === this.props.layer) layerZ = layer.z;
        });

        const fillColor = new Color({ hex: this.props.color }),
          pixels = this.getLayerPixels(this.props.layer);

        let bounds;
        if (selectionIsActive(this.props.selection)) {
          bounds = {
            top: this.props.selection.start.y,
            right: this.props.selection.end.x,
            bottom: this.props.selection.end.y,
            left: this.props.selection.start.x,
          };
        } else {
          bounds = {
            top: 1,
            right: this.props.size.width,
            bottom: this.props.size.height,
            left: 1,
          };
        }

        let data = {
          point,
          frame: this.props.frame,
          layer: this.props.layer,
          layerZ,
          fillColor,
          pixels,
          bounds,
        };

        this.worker.postMessage(data);
      }
    }
  }

  startRectangularSelection(point) {
    this.props.selectionStart(point);
  }

  resizeRectangularSelection(point) {
    this.selectionCanvas.decoratoredCanvas.drawSelection(
      this.props.selection.start,
      point
    );
  }

  endRectangularSelection(point) {
    if (_.isEqual(point, this.mouse.downStart)) {
      this.props.selectionClear();
    } else {
      this.props.selectionEnd(point);
    }
  }

  createLayerVisibilityMap() {
    this.layerVisibilityMap = {};
    this.props.layers.map(
      layer =>
        (this.layerVisibilityMap[layer.id] = layer.visible && layer.opacity > 0)
    );
  }

  layerIsVisible() {
    if (!this.layerVisibilityMap[this.props.layer]) {
      this.props.modalShow("ModalErrorInvisibleLayer");
      return false;
    }
    return true;
  }

  getMouseDownDistance() {
    return {
      x: this.cursor.x - this.mouse.downStart.x,
      y: this.cursor.y - this.mouse.downStart.y,
    };
  }

  getLayerPixels(layerId) {
    let pixels;
    try {
      pixels = this.props.pixels[this.props.frame][layerId];
    } catch (e) {
      pixels = {};
    }
    return pixels;
  }
}

export default Stagebox;
