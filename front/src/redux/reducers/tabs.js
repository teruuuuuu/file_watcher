import { ADD_TAB, DEL_TAB, CHANGE_TAB, SAVE_SETTING } from "../actionTypes";

const initialState = {
  ids: [-1],
  activeId: -1,
};

export default function (state = initialState, action) {
  const open = (settingId) =>
    Object.assign({}, state, {
      ids: state.ids.includes(settingId)
        ? state.ids
        : state.ids.concat(settingId),
      activeId: settingId,
    });
  const del = (settingId) => {
    const index = state.ids.indexOf(settingId);
    return Object.assign({}, state, {
      ids: state.ids.slice(0, index).concat(state.ids.slice(index + 1)),
      activeId: state.activeId == settingId ? -1 : state.activeId,
    });
  };
  const change = (settingId) =>
    Object.assign({}, state, {
      activeId: state.ids.includes(settingId) ? settingId : state.activeId,
    });

  switch (action.type) {
    case ADD_TAB:
      return open(action.id);
    case DEL_TAB:
      return del(action.id);
    case SAVE_SETTING:
      if (action.isOpen) {
        return open(action.setting.id);
      } else {
        return state;
      }
    case CHANGE_TAB:
      return change(action.id);
    default:
      return state;
  }
}
