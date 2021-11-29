import { closeWelcomeModal as closeWelcomeModalStyle } from '../style.js';
import { drawWatermarkOnCanvasAreaBackground } from '../../../canvas/utils/watermark.js';

function closeWelcomeModal() {
  closeWelcomeModalStyle();
  drawWatermarkOnCanvasAreaBackground();
  // flashUploadImagesButton();
}

function initUserGuide() {
  // clicking the button before modal is displayed
}

export { closeWelcomeModal, initUserGuide };

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
