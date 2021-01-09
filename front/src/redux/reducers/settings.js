import { SAVE_SETTING, DEL_SETTING } from "../actionTypes"

const initialState = [
]

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_SETTING:
      const setting = state.find(a => a.id == action.setting.id)
      if (setting) {
        Object.assign(state.find(a => a.id == action.setting.id), action.setting)
        return state
      } else {
        return state.concat(action.setting)
      }
    case DEL_SETTING:
      let index = state.findIndex(a => a.id == action.id)
      return state.slice(0, index).concat(state.slice(index + 1))
    default:
      return state
  }
}
