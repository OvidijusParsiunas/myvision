import { changeImageThumbnailBorderColorToRed, resetImageThumbnailBorderColor } from '../imageList';

function initialiseImageListButtonHoverEvents() {
  window.changeImageThumbnailBorderColorToRed = changeImageThumbnailBorderColorToRed;
  window.resetImageThumbnailBorderColor = resetImageThumbnailBorderColor;
}

export { initialiseImageListButtonHoverEvents as default };
