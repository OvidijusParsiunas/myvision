import { initiateToolkitButtonsStyling } from './styling/stateMachine';
import assignToolkitButtonEventHandlers from './buttonClickEvents/buttonClickEvents';

function initialiseToolkit() {
  initiateToolkitButtonsStyling();
  assignToolkitButtonEventHandlers();
}

export { initialiseToolkit as default };
