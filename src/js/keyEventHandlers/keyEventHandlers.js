import { labelShape } from '../tools/labellerModal/buttonEventHandlers';
import { getLabellerModalDisplayedState } from '../tools/stateMachine';

function keyDownEventHandler(event) {
  if (getLabellerModalDisplayedState() && event.key === 'Enter') {
    labelShape();
  }
}

function registerGlobalKeyEventHandlers() {
  document.addEventListener('keydown', keyDownEventHandler);
}

export { registerGlobalKeyEventHandlers as default };
