import { setWelcomeModalDisplayedState } from '../stateMachine';
import { dimWindow, lightUpWindow } from '../dimWindow/dimWindowService';
import { SLOW_LIGHTUP_MILLISECONDS, SLOW_DIM_SECONDS, THICK_DIM } from '../dimWindow/consts';

let modalParentElement = null;
let modalParentElement2 = null;

function displayWelcomeModal() {
  modalParentElement.classList.add('six');
  modalParentElement2.classList.add('six');
  setTimeout(() => {
    const windowDim = document.getElementById('welcome-modal-parent2');
    windowDim.style.transitionDuration = `${0.8}s`;
    windowDim.style.MozTransitionDuration = `${1}s`;
    windowDim.style.opacity = '1';
  }, 700);
  setWelcomeModalDisplayedState(true);
}

function closeWelcomeModal() {
  modalParentElement.style.display = 'none';
  setWelcomeModalDisplayedState(false);
  lightUpWindow(SLOW_LIGHTUP_MILLISECONDS);
}

function assignWelcomeModalLocalVariables() {
  modalParentElement = document.getElementById('welcome-modal-parent');
  modalParentElement2 = document.getElementById('welcome-modal-parent2');
}

function initialiseWelcomeModalStyling() {
  assignWelcomeModalLocalVariables();
  displayWelcomeModal();
}

export { initialiseWelcomeModalStyling, displayWelcomeModal, closeWelcomeModal };
