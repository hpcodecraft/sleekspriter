import { connect } from "react-redux";
import Previewbox from "../paint/Previewbox";
import {
  getFilePixels,
  getFileSize,
  getFrameLayers,
  getPaintFrame,
} from "../../state/selectors";

const mapStateToProps = state => ({
  frame: getPaintFrame(state),
  layers: getFrameLayers(state),
  pixels: getFilePixels(state),
  size: getFileSize(state),
});

export default connect(mapStateToProps)(Previewbox);