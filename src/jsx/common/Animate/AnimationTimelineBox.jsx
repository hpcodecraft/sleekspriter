var AnimationTimelineBox = React.createClass({
  render: function() {
    return (
      <div id="AnimationTimelineBox">
        <h4>Timeline</h4>
        <div className="scroller">
          <div className="inner">
            <AnimationFrameDropzone />
          </div>
        </div>
      </div>
    );
  }
});