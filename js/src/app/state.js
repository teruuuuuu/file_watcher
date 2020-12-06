export function genState() {
  return {
    "searchFile": "",
    "lineNumber": 1,
    "catchStartIndex": 1,
    "cashTexts": [],
  };
}

export function genStateMethod(state, viewSynch, element) {

  return {
    setCashTexts: (texts) => {
      state.cashTexts = texts
      state.lineNumber = 1
      state.catchStartIndex = 1

      viewSynch.show(state, element)
    },
    lineUp: () => {
      if (state.lineNumber > 1) {
        state.lineNumber -= 1
        viewSynch.show(state, element)
      }
    },
    lineDown: () => {
      if (state.lineNumber < state.catchStartIndex + state.cashTexts.length - 1) {
        state.lineNumber += 1
        viewSynch.show(state, element)
      }
    }
  }
}
