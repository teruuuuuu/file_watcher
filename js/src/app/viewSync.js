

export function genViewSyncMethod(document) {
  const createTag = (tagName) => document.createElement(tagName)

  function createTextElement(rowStartNum, viewTexts) {
    const outerTag = createTag("div")
    const createRow = (row, text) => {
      const rowTag = createTag("div")
      rowTag.classList.add("textLine")
      const lineNumberTag = createTag("div")
      const textTag = createTag("div")
      lineNumberTag.innerText = row.toString() + ":"
      textTag.innerText = text
      rowTag.append(lineNumberTag)
      rowTag.append(textTag)
      return rowTag
    }
    for (const [i, value] of viewTexts.entries()) {
      outerTag.append(createRow(i + rowStartNum, value))
    }
    return outerTag
  }

  return {
    show: (state, element) => {
      const { lineNumber, catchStartIndex, cashTexts } = state;
      const { watchTextArea } = element;
      watchTextArea.innerHTML =
        createTextElement(lineNumber,
          cashTexts.slice(lineNumber - catchStartIndex)).innerHTML
    }
  }
}
