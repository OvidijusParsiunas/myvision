function enableActiveObjectsAppearInFront(canvas) {
  canvas.preserveObjectStacking = false;
}

function preventActiveObjectsAppearInFront(canvas) {
  if (canvas) {
    canvas.preserveObjectStacking = true;
  }
}

export { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront };
