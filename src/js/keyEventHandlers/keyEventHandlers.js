import { labelShape } from '../tools/shapeLabellerModal/buttonEventHandlers';
import { getShapeLabellerModalDisplayedState } from '../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateMachine';

function keyDownEventHandler(event) {
  if (getShapeLabellerModalDisplayedState() && event.key === 'Enter') {
    labelShape();
  }
}

function registerGlobalKeyEventHandlers() {
  document.addEventListener('keydown', keyDownEventHandler);
}

export { registerGlobalKeyEventHandlers as default };
