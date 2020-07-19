import { closeWelcomeModal } from './workers';

function assignWelcomeModalButtonEventHandlers() {
  window.closeWelcomeModal = closeWelcomeModal;
}

export { assignWelcomeModalButtonEventHandlers as default };
