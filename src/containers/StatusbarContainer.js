import { connect } from "react-redux";
import Statusbar from "../views/paint/Statusbar";

import { gridToggle } from "../state/actions";

const mapStateToProps = (state) => {
  return {
    grid: state.ui.paint.grid,
    zoom: state.ui.paint.zoom
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    gridToggle: () => dispatch(gridToggle())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Statusbar);
