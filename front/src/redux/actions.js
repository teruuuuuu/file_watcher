import { SAVE_SETTING, DEL_SETTING, ADD_TAB, DEL_TAB, CHANGE_TAB } from "./actionTypes"

export const saveSetting = setting => ({
  type: SAVE_SETTING,
  setting: setting
})

export const delSetting = settingId => ({
  type: DEL_SETTING,
  id: settingId
})

export const addTab = settingId => ({
  type: ADD_TAB,
  id: settingId
})

export const delTab = settingId => ({
  type: DEL_TAB,
  id: settingId
})

export const changeTab = settingId => ({
  type: CHANGE_TAB,
  id: settingId
})

