import { changeImageThumbnailBorderColorToRed, resetImageThumbnailBorderColor } from '../imageList.js';

function initialiseImageListButtonHoverEvents() {
  const removeButtonElement = document.getElementById('remove-images-button');
  removeButtonElement.addEventListener('mouseenter', () => {
    changeImageThumbnailBorderColorToRed();
  });
  removeButtonElement.addEventListener('mouseleave', () => {
    resetImageThumbnailBorderColor();
  });
}

export { initialiseImageListButtonHoverEvents as default };
