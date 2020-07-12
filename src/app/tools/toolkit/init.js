import { initiateToolkitButtonsStyling } from './styling/state';
import assignToolkitButtonEventHandlers from './buttonClickEvents/buttonClickEvents';

function initialiseToolkit() {
  initiateToolkitButtonsStyling();
  assignToolkitButtonEventHandlers();
}

export { initialiseToolkit as default };
