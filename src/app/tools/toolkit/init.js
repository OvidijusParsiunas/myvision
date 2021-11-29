import { initiateToolkitButtonsStyling } from './styling/state.js';
import assignToolkitButtonClickEventHandlers from './buttonClickEvents/buttonClickEvents.js';

function initialiseToolkit() {
  initiateToolkitButtonsStyling();
  assignToolkitButtonClickEventHandlers();
}

export { initialiseToolkit as default };
