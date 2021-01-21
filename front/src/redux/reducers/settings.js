import { SAVE_SETTING, DEL_SETTING } from "../actionTypes";
import { dbService } from "../../App";

const initialState = [];

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_SETTING:
      const curSetting = state.find((a) => a.id == action.setting.id);
      const newSetting = ((curSetting) => {
        if (curSetting) {
          Object.assign(
            state.find((a) => a.id == action.setting.id),
            action.setting
          );
          return state;
        } else {
          return state.concat(action.setting);
        }
      })(curSetting);
      dbService.save(newSetting);

      return newSetting;
    case DEL_SETTING:
      let index = state.findIndex((a) => a.id == action.id);
      dbService.delete([action.id]);
      return state.slice(0, index).concat(state.slice(index + 1));
    default:
      return state;
  }
}
