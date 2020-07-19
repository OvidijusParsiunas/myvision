import { setWelcomeModalDisplayedState } from '../state';
import { lightUpWindow } from '../dimWindow/dimWindowService';
import { SLOW_LIGHTUP_MILLISECONDS } from '../dimWindow/consts';
import { onMouseMoveEvent } from '../../keyEvents/mouse/mouseMove';

let modalParentElement = null;
let modalConntourParentElement = null;
const CONTOUR_DRAWING_DURATION_MILLISECONDS = 800;

function fadeInModal() {
  modalParentElement.style.transitionDuration = `${0.8}s`;
  modalParentElement.style.MozTransitionDuration = `${1}s`;
  modalParentElement.style.opacity = '1';
}

function displayWelcomeModal() {
  setWelcomeModalDisplayedState(true);
  setTimeout(() => {
    fadeInModal();
  }, CONTOUR_DRAWING_DURATION_MILLISECONDS);
}

function closeWelcomeModal() {
  modalParentElement.style.display = 'none';
  modalConntourParentElement.style.display = 'none';
  setWelcomeModalDisplayedState(false);
  lightUpWindow(SLOW_LIGHTUP_MILLISECONDS);
}

function addMouseMoveEventListener() {
  modalParentElement.addEventListener('mousemove', onMouseMoveEvent);
}

function assignWelcomeModalLocalVariables() {
  modalParentElement = document.getElementById('welcome-modal-parent');
  modalConntourParentElement = document.getElementById('welcome-modal-contour-animation-parent');
}

function initialiseWelcomeModalStyling() {
  assignWelcomeModalLocalVariables();
  addMouseMoveEventListener();
  displayWelcomeModal();
}

export { initialiseWelcomeModalStyling, displayWelcomeModal, closeWelcomeModal };
