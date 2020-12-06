import { SAVE_SETTING, DEL_SETTING } from "../actionTypes"

const initialState = []

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_SETTING:
      if (action.setting.id == -1) {
        return state.concat(Object.assign({}, action.setting, { id: state.map(a => a.id).concat(-1).reduce((a, b) => Math.max(a, b)) + 1 }))
      } else {
        Object.assign(state.find(a => a.id == action.setting.id), action.setting)
        return state
      }
    case DEL_SETTING:
      let index = state.findIndex(a => a.id == action.id)
      return state.slice(0, index).concat(state.slice(index + 1))
    default:
      return state
  }
}
