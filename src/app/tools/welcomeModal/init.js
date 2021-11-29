import { initialiseWelcomeModalStyling } from './style.js';
import assignWelcomeModalButtonEventHandlers from './buttons/buttonClickEvents.js';

function initialiseWelcomeModal() {
  initialiseWelcomeModalStyling();
  assignWelcomeModalButtonEventHandlers();
}

export { initialiseWelcomeModal as default };
