import Mousetrap from "mousetrap";
import { ActionCreators } from "redux-undo";
import { gridToggle, onionToggle, toolSelect } from "../state/actions";

const bindings = {
  paint: [
    // ------- letters -------
    {
      key: "b",
      action: dispatch => dispatch(toolSelect("BrushTool")),
    },
    {
      key: "e",
      action: dispatch => dispatch(toolSelect("EraserTool")),
    },
    {
      key: "i",
      action: dispatch => dispatch(toolSelect("EyedropperTool")),
    },
    {
      key: "m",
      action: dispatch => dispatch(toolSelect("RectangularSelectionTool")),
    },
    {
      key: "p",
      action: dispatch => dispatch(toolSelect("PaintbucketTool")),
    },
    {
      key: "l",
      action: dispatch => dispatch(toolSelect("BrightnessTool")),
    },
    {
      key: "v",
      action: dispatch => dispatch(toolSelect("MoveTool")),
    },
    {
      key: "z",
      action: dispatch => dispatch(toolSelect("ZoomTool")),
    },
    {
      key: "g",
      action: dispatch => dispatch(gridToggle()),
    },
    {
      key: "o",
      action: dispatch => dispatch(onionToggle()),
    },
    {
      key: "meta+z",
      action: dispatch => dispatch(ActionCreators.undo()),
    },
    {
      key: "meta+y",
      action: dispatch => dispatch(ActionCreators.redo()),
    },
  ],
  start: [],
};

class Hotkeys {
  constructor(bindings) {
    this.bindings = bindings;
    this.dispatch = null;
  }

  init(dispatch) {
    console.log("%c HOTKEYS INIT! ", "background: blue; color: white;");

    this.dispatch = dispatch;
  }

  bind(screen) {
    console.log(
      `%c HOTKEYS BIND! ${screen} `,
      "background: blue; color: white;"
    );

    if (this.bindings[screen]) {
      this.bindings[screen].map(function(binding) {
        Mousetrap.bind(binding.key, () => {
          binding.action(this.dispatch);
        });
      }, this);
    }
  }

  unbind(screen) {
    console.log(
      `%c HOTKEYS UNBIND! ${screen} `,
      "background: blue; color: white;"
    );

    if (this.bindings[screen]) {
      this.bindings[screen].map(function(binding) {
        Mousetrap.unbind(binding.key);
      }, this);
    }
  }
}

export default new Hotkeys(bindings);