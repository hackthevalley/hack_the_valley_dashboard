import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { pageTransition, moveHighlight, logoutAction } from '../../redux/actions';
import { SidenavItem } from './';
import '../../scss/components/sidenav/sidenav.scss';

const MAIN_ITEMS = [
  { path: "/profile", text: "Profile" },
  { path: "/app", text: "Applications" }
];

class _Sidenav extends Component {

  constructor(props) {
    super(props);
    const path = window.location.pathname.replace(process.env.PUBLIC_URL, "");
    const index = MAIN_ITEMS.map(({path}) => path).indexOf(path);
    this.props.moveHighlight(index);

    this.state = {
      expanded: false
    }
  }

  handleTouch = el => {
    const { type, timeStamp, changedTouches } = el;
    if (changedTouches.length === 1) {
    if (type === "touchstart") {
      this.touchStart = {
        timeStamp,
        X: changedTouches[0].screenX,
        Y: changedTouches[0].screenY
      }
    } else if (type === "touchend") {
      const { expanded } = this.state;
      const touchEnd = {
        timeStamp,
        X: changedTouches[0].screenX,
        Y: changedTouches[0].screenY
      }
      const X = touchEnd.X - this.touchStart.X;
      const Y = touchEnd.Y - this.touchStart.Y;
      const AX = Math.abs(X);
      const AY = Math.abs(Y);
      const T = touchEnd.timeStamp - this.touchStart.timeStamp;
      const V = Math.sqrt(Math.pow(AX,2) + Math.pow(AY,2)) / T;

      console.log(V, X, Y);

      if (V > 1) {
        if (AX > 100 && AY < 40) {
          if (X < 0 && expanded) {
            this.setState({ expanded: false });
          } else if (X > 0 && !expanded) {
            this.setState({ expanded: true });
          }
        }
      }

    }
    } else {
      console.log("Multi-touch not supported :(");
    }
  }

  componentDidMount() {
    window.addEventListener("touchstart", this.handleTouch, { passive: true });
    window.addEventListener("touchend", this.handleTouch, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener("touchstart", this.handleTouch);
    window.removeEventListener("touchend", this.handleTouch);
  }

  render() {
    const { index, logoutAction } = this.props;
    const { expanded } = this.state;
    const transform = `translate3d(0,calc(${index*100}% + ${index*10}px),0)`;

    return <nav className={`sidenav sidenav--${expanded? "expanded": "collapsed"}`}>
      <div className="sidenav__brand">
        <img src={require('../../assets/logo_white.png')} alt={"logo"} width={70} /><br/>
        <span className="sidenav__header">Hack The Valley</span>
        <span className="sidenav__subheader">Hacker Dashboard</span>
      </div>
      <ul className="sidenav__items sidenav__items--main">
        <div className={`sidenav__highlight${index === -1? "--hide": ""}`} style={{transform}}/>
        {
          MAIN_ITEMS.map(({ path, text }, key) => {
            const active = index === key;
            const click = active? null: this.click.bind(this, key);
            return <SidenavItem path={path} active={active} key={key} onStart={click}>
              { text }
            </SidenavItem>
          })
        }
      </ul>
      <ul className="sidenav__items sidenav__items--bottom">
        <SidenavItem onStart={this.click.bind(this, -1)} onEnd={logoutAction} path="/">Logout</SidenavItem>
      </ul>
      <button type="button" onClick={() => this.setState({expanded: !expanded})} className="sidenav__menu">
        <div className="sidenav__bar sidenav__bar--first"/>
        <div className="sidenav__bar sidenav__bar--second"/>
        <div className="sidenav__bar sidenav__bar--third"/>
      </button>
    </nav>
  }

  click(key) {
    const { moveHighlight, pageTransition } = this.props;
    if (this.state.expanded) {
      this.setState({ expanded: false });
    }
    moveHighlight(key);
    pageTransition();
  }
}

const mapStateToProps = state => ({
  index: state.sidenav.index
})

const mapDispatchToProps = dispatch => bindActionCreators({
  pageTransition,
  moveHighlight,
  logoutAction
}, dispatch)

export const Sidenav = connect(mapStateToProps, mapDispatchToProps)(_Sidenav)
