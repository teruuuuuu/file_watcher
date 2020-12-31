// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { App } from './App'
import store from './redux/store'

const rootElement = document.getElementById('app')
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
