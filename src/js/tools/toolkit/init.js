import assignToolkitButtonEventHandlers from './buttonClickEvents/buttonClickEvents';
import { initiateToolkitButtonsStyling } from './styling/stateMachine';

function initialiseToolkit() {
  assignToolkitButtonEventHandlers();
  initiateToolkitButtonsStyling();
}

export { initialiseToolkit as default };
