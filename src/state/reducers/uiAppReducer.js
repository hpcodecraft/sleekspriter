import initialState from "../initialState";

function uiAppReducer(state = initialState.ui.app, action) {
  switch(action.type) {
  case "MODAL_HIDE":
    return { ...state, modal: { visible: false, dialog: null }};
  case "MODAL_SHOW":
    return { ...state, modal: { visible: true, dialog: action.dialog  }};
  case "SCREEN_SELECT":
    return { ...state, screen: action.screen };
  default:
    return state;
  }
}

export default uiAppReducer;
