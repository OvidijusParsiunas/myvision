import { drawWatermarkOnCanvasAreaBackground } from '../../../canvas/utils/watermark';
import { closeWelcomeModal as closeWelcomeModalStyle } from '../style';
import initialiseLanguageBoundComponents from '../initAfterModalClose';
import { setActiveLanguage } from '../../text/languages/language';
import { populateText } from '../../text/languages/style';

function closeWelcomeModal() {
  closeWelcomeModalStyle();
  drawWatermarkOnCanvasAreaBackground();
  // the reason why this is initialised here is because when the modal closes - the language
  // is finalised, hence we the static text in js files can be initialised
  initialiseLanguageBoundComponents();
  // flashUploadImagesButton();
}

function switchLanguage(language) {
  setActiveLanguage(language);
  populateText();
}

function initUserGuide() {
  // clicking the button before modal is displayed
}

export { closeWelcomeModal, initUserGuide, switchLanguage };

// Gradient fade animation for imagelist header
// function setBackground(titleContainerElement, uploadImagesButtonContainerElement) {
//   titleContainerElement.style.backgroundColor = 'rgb(210, 210, 210)';
//   // uploadImagesButtonContainerElement.style.backgroundColor = 'rgb(241, 228, 190)';
// }

// function unsetBackground(titleContainerElement, uploadImagesButtonContainerElement) {
//   titleContainerElement.style.backgroundColor = 'transparent';
//   // uploadImagesButtonContainerElement.style.backgroundColor = 'transparent';
// }

// function flashUploadImagesButton() {
//   const titleContainerElement = document.getElementById('image-list-title-parent');
//   const uploadImagesButtonContainerElement = document.getElementById('upload-images-button');
//   unsetBackground(titleContainerElement, uploadImagesButtonContainerElement);
//   setTimeout(() => {
//     titleContainerElement.style.transitionDuration = `${1}s`;
//     titleContainerElement.style.MozTransitionDuration = `${1}s`;
//     uploadImagesButtonContainerElement.style.transitionDuration = `${1}s`;
//     uploadImagesButtonContainerElement.style.MozTransitionDuration = `${1}s`;
//     setBackground(titleContainerElement, uploadImagesButtonContainerElement);
//   }, 600);
//   setTimeout(() => {
//     unsetBackground(titleContainerElement, uploadImagesButtonContainerElement);
//   }, 1200);
//   setTimeout(() => {
//     setBackground(titleContainerElement, uploadImagesButtonContainerElement);
//   }, 1800);
//   setTimeout(() => {
//     unsetBackground(titleContainerElement, uploadImagesButtonContainerElement);
//   }, 2400);
//   setTimeout(() => {
//     setBackground(titleContainerElement, uploadImagesButtonContainerElement);
//   }, 3000);
// }

// add css
/* @keyframes gradient {
0% {
  background-position: 100% 50%;
}
50% {
  background-position: 20% 50%;
}
100% {
  background-position: 0% 50%;
}
} */
