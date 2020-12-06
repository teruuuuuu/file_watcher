import { ADD_TAB, DEL_TAB, CHANGE_TAB } from "../actionTypes"

const initialState = {
  ids: [-1],
  activeId: -1,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_TAB:
      return Object.assign({}, state, {
        ids: state.ids.includes(action.id) ? state.ids : state.ids.concat(action.id), activeId: action.id
      })
    case DEL_TAB:
      const index = state.ids.indexOf(action.id)
      return Object.assign({}, state, {
        ids: state.ids.slice(0, index).concat(state.ids.slice(index + 1)),
        activeId: state.activeId == action.id ? -1 : state.activeId
      })
    case CHANGE_TAB:
      return Object.assign({}, state, { activeId: state.ids.includes(action.id) ? action.id : state.activeId })
    default:
      return state
  }
}
