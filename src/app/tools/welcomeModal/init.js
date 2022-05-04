import assignWelcomeModalButtonEventHandlers from './buttons/buttonClickEvents';
import { initialiseWelcomeModalStyling } from './style';

function initialiseWelcomeModal() {
  initialiseWelcomeModalStyling();
  assignWelcomeModalButtonEventHandlers();
}

export { initialiseWelcomeModal as default };
