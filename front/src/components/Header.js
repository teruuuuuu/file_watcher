import * as React from 'react'
import { connect } from 'react-redux'
import cx from "classnames"
import { changeTab, delTab } from '../redux/actions'
import pls_icon from '../assets/images/plus_64.png'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  changeTab(id) {
    this.props.changeTab(id)
  }

  delTab(id, e) {
    this.props.delTab(id)
    e.stopPropagation()
  }

  render() {
    const { settings, tabs } = this.props
    return (
      <div className="header">
        {tabs.ids.map(id =>
          <div className={cx("item", id == tabs.activeId && "selected")} key={id} onClick={() => this.changeTab(id)}>
            <div style={{ width: "130px", overflow: "hidden", textOverflow: "ellipsis" }}>{id == -1 ? "設定" : settings.find(setting => setting.id == id).name}</div>
            <img onClick={(e) => this.delTab(id, e)} src={pls_icon} style={{ display: id != -1 ? "block" : "none", height: "20px", verticalAlign: "middle", float: "right", transform: "rotate(45deg)", cursor: "pointer" }}></img>
          </div>)}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { settings, tabs } = state
  return { settings, tabs }
}
// export default VisibilityFilters;
export default connect(
  mapStateToProps,
  { changeTab, delTab }
)(Header)
