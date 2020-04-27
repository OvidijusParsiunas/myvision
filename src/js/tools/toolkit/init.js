import { assignToolkitButtonHoverEvents } from './buttonHoverEvents/buttonHoverEvents';
import { initiateToolkitButtonsStyling } from './styling/stateMachine';
import assignToolkitButtonEventHandlers from './buttonClickEvents/buttonClickEvents';

function initialiseToolkit() {
  assignToolkitButtonEventHandlers();
  assignToolkitButtonHoverEvents();
  initiateToolkitButtonsStyling();
}

export { initialiseToolkit as default };
