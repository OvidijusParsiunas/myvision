import { initiateToolkitButtonsStyling } from './styling/state';
import assignToolkitButtonClickEventHandlers from './buttonClickEvents/buttonClickEvents';

function initialiseToolkit() {
  initiateToolkitButtonsStyling();
  assignToolkitButtonClickEventHandlers();
}

export { initialiseToolkit as default };
