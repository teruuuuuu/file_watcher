export function genElement(document) {
  const inputFile = document.getElementById("input_file")
  const inputCode = document.getElementById("input_code")
  const watchTextArea = document.getElementById("watch_textarea")
  const inputBnf = document.getElementById("input_bnf")
  const searchButton = document.getElementById("search_button")
  const searchResult = document.getElementById("search_result")


  return {
    "inputFile": inputFile,
    "inputCode": inputCode,
    "watchTextArea": watchTextArea,
    "inputBnf": inputBnf,
    "searchButton": searchButton,
    "searchResult": searchResult
  };
}
