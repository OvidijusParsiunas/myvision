import { closeWelcomeModal } from './workers.js';

function assignWelcomeModalButtonEventHandlers() {
  window.closeWelcomeModal = closeWelcomeModal;
}

export { assignWelcomeModalButtonEventHandlers as default };
