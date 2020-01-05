import { labelShape } from '../tools/labellerPopUp/buttonEventHandlers';
import { getLabellingPopUpDisplayedState } from '../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';

function keyDownEventHandler(event) {
  if (getLabellingPopUpDisplayedState() && event.key === 'Enter') {
    labelShape();
  }
}

function registerGlobalKeyEventHandlers() {
  document.addEventListener('keydown', keyDownEventHandler);
}

export { registerGlobalKeyEventHandlers as default };
