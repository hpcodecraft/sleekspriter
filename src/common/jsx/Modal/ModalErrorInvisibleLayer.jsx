var ModalErrorInvisibleLayer = React.createClass({
  mixins: [ModalBasicMixin],
  render: function() {
    return (
      <div className="dialog">
        <div className="title">Error</div>
        <div className="text">Cannot change an invisible or completely transparent layer.</div>
        <div className="actions">
          <button onClick={this.hide}>Ok, got it.</button>
        </div>
      </div>
    )
  },
});