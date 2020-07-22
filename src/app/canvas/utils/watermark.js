let watermarkDisplayed = false;

function drawWatermarkOnCanvasAreaBackground() {
  if (watermarkDisplayed) return;
  const canvasWrapperParentElement = document.getElementById('canvas-wrapper-parent');
  canvasWrapperParentElement.style.backgroundImage = 'url(\'assets/svg/watermark 1.svg\')';
  canvasWrapperParentElement.style.backgroundAttachment = 'fixed';
  canvasWrapperParentElement.style.backgroundPosition = 'center';
  canvasWrapperParentElement.style.backgroundPositionX = 'calc((100% - 210px - (59px / var(--screen-size-delta))) / 2 + 70px)';
  canvasWrapperParentElement.style.backgroundSize = '500px 220px';
  canvasWrapperParentElement.style.backgroundRepeat = 'no-repeat';
  watermarkDisplayed = true;
}

function removeWatermarkFromCanvasAreaBackground() {
  if (!watermarkDisplayed) return;
  const canvasWrapperParentElement = document.getElementById('canvas-wrapper-parent');
  canvasWrapperParentElement.style.backgroundImage = '';
  canvasWrapperParentElement.style.backgroundAttachment = '';
  canvasWrapperParentElement.style.backgroundPosition = '';
  canvasWrapperParentElement.style.backgroundPositionX = '';
  canvasWrapperParentElement.style.backgroundSize = '';
  canvasWrapperParentElement.style.backgroundRepeat = '';
  watermarkDisplayed = false;
}

export { drawWatermarkOnCanvasAreaBackground, removeWatermarkFromCanvasAreaBackground };
