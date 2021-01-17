/*global ENV */
import * as React from 'react'
import Header from './components/Header'
import ContentsArea from './components/ContentsArea'
import { connect } from 'react-redux'
import { KeyPressHandler } from './event/keypressHandler'
import { WindowResizeHandler } from './event/WindowResizeHandler'
import { WS } from './Ws/Ws'
import { DbService } from './repository/DbService'

import './style/global.less'

export const keyPressHandler = new KeyPressHandler(window.document)
export const windowResizeHandler = new WindowResizeHandler()
export const env = ENV
export const dbService = new DbService()

export class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100vh", display: "grid", gridTemplateRows: "20px 1fr" }}>
        <Header />
        <ContentsArea />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { state }
}
// export default VisibilityFilters;
export default connect(
  mapStateToProps
)(App)

export const ws = new WS(env.WsUrl, env.hbInterval)
