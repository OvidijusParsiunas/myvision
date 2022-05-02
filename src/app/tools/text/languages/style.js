import { getDictionary } from './language';

let welcomeModalDescriptionPar1 = null;
let welcomeModalDescriptionPar2 = null;
let welcomeModalDescriptionPar3 = null;
let welcomeModalDescriptionPar4 = null;
let startText = null;
let labellerModalTitle = null;
let labellerModalSubmitButton = null;
let labellerModalCancelButton = null;
let machineLearningModalTitle = null;

function populateText() {
  const dictionary = getDictionary();
  welcomeModalDescriptionPar1.innerHTML = dictionary.WELCOME_MODAL_DESCRIPTION_PAR_1;
  welcomeModalDescriptionPar2.innerHTML = dictionary.WELCOME_MODAL_DESCRIPTION_PAR_2;
  welcomeModalDescriptionPar3.innerHTML = dictionary.WELCOME_MODAL_DESCRIPTION_PAR_3;
  welcomeModalDescriptionPar4.innerHTML = dictionary.WELCOME_MODAL_DESCRIPTION_PAR_4;
  startText.innerHTML = dictionary.START;
  labellerModalTitle.innerHTML = dictionary.LABEL_NAME;
  labellerModalSubmitButton.innerHTML = dictionary.SUBMIT;
  labellerModalCancelButton.innerHTML = dictionary.CANCEL;
  machineLearningModalTitle.innerHTML = dictionary.MODAL_TITLE;
}

function assignTextElements() {
  welcomeModalDescriptionPar1 = document.getElementById('welcome-modal-description-par-1');
  welcomeModalDescriptionPar2 = document.getElementById('welcome-modal-description-par-2');
  welcomeModalDescriptionPar3 = document.getElementById('welcome-modal-description-par-3');
  welcomeModalDescriptionPar4 = document.getElementById('welcome-modal-description-par-4');
  startText = document.getElementById('start-text');
  labellerModalTitle = document.getElementById('labeller-modal-title');
  labellerModalSubmitButton = document.getElementById('labeller-modal-submit-button');
  labellerModalCancelButton = document.getElementById('labeller-modal-cancel-button');
  machineLearningModalTitle = document.getElementById('machine-learning-modal-title');
}

export {
  populateText, assignTextElements,
};
