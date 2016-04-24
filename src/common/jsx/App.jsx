var App = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('FileStore', 'UiStore', 'PixelStore')],
  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      ui: flux.store('UiStore').getData(),
      file: flux.store('FileStore').getData(),
      pixels: flux.store('PixelStore').getData(),
    };
  },
  render: function() {
    var tabs = [],
        windowClasses = {};

        if(this.state.ui.tab !== 'start') {
          tabs.push('paint');
          if(this.state.ui.frames.total > 1) tabs.push('animate');
          tabs.push('export');
        }

        windowClasses['window'] = true;
        windowClasses[this.state.ui.tab] = true;
        windowClasses = classNames(windowClasses);

    return (
      <div className="app">
        <nav className="menu" ref="menu">
          {this.state.ui.tab === 'start' ? <label className="version">version @@version</label> :
            tabs.map(function(tab) {
              var label = tab[0].toUpperCase() + tab.substr(1, tab.length),
                  classes = classNames({
                    tab: true,
                    active: this.state.ui.tab === tab ? true : false,
                  });
              return (
                <div className={classes} key={tab} data-target={tab} onClick={this.tabSelect} onTouchStart={this.tabSelect}>{label}</div>
              )
            }, this)}
        </nav>
        <div className={windowClasses}>
          <ScreenStart />
          <ScreenPaint ui={this.state.ui} file={this.state.file} pixels={this.state.pixels} />
          <ScreenAnimate ui={this.state.ui} file={this.state.file} pixels={this.state.pixels} />
          <ScreenExport ui={this.state.ui} file={this.state.file} pixels={this.state.pixels} />
          <ScreenDebug />
          <ScreenHelper ui={this.state.ui} file={this.state.file} pixels={this.state.pixels} />
        </div>
        <Modal ui={this.state.ui} file={this.state.file} />
        <ScreenBlocker />
      </div>
    );
  },
  tabSelect: function(event) {
    var target = event.target.getAttribute('data-target');
    this.getFlux().actions.tabSelect(target);
  },
});
