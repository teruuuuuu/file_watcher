console.log("index")
import '../../style/index.less'

import { genState, genStateMethod } from './state'
import { genElement } from './element'
import { genViewSyncMethod } from './viewSync'

class Application {
  constructor(targetDocument) {
    this.targetDocument = targetDocument
    this.state = {}
    this.stateMethod = {}
    this.element = {}
    this.viewSynch = {}
    Object.assign(this.state, genState())
    Object.assign(this.stateMethod, genStateMethod(this.state, this.viewSynch, this.element))
    Object.assign(this.element, genElement(targetDocument))
    Object.assign(this.viewSynch, genViewSyncMethod(targetDocument))
  }

  init() {
    console.log("init")
    const setEvent = () => {
      console.log("set event")
      async function readFile(app, file, dec) {
        const { stateMethod } = app;
        const reader = file.stream().getReader()
        let result = await reader.read()
        let text = dec.decode(result.value)
        const texts = text.replace('\r\n', '\n').split('\n')
        stateMethod.setCashTexts(texts)
      }

      this.element.inputFile.oninput = (e) => {
        console.info(this)
        let dec = new TextDecoder(
          this.element.inputCode.children[this.element.inputCode.selectedIndex].value)
        readFile(this, e.target.files[0], dec)
      }

      this.element.searchButton.onclick = (e) => {
        const { cashTexts } = this.state;
        const bnf = this.element.inputBnf.value.replace('\r\n', '\n').split('\n')

        let result = ""
        let bnfResult = bnfParse(cashTexts, bnf)
        while (bnfResult.length__I() >= 1) {
          result += bnfResult.head__O() + '\r\n'
          bnfResult = bnfResult.tail__O()
        }

        this.element.searchResult.value = result
      }

      this.targetDocument.addEventListener("keydown",
        (e) => {
          if (e.key == "j") {
            this.stateMethod.lineDown()
          } else if (e.key == "k") {
            this.stateMethod.lineUp()
          }
        }
      )


    }

    setEvent()
    this.viewSynch.show(this.state, this.element)
  }

}

const app = new Application(document)
app.init()

console.info(app)
