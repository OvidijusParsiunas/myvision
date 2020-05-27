import { applyNewDimensionsToIndividualElements, applyNewDimensionsToElementClasses } from '../utils';

function createElementToDimensionsArray() {
  return [
    { id: 'image-switch-parent', defaultDimensions: { height: 29 } },
  ];
}

function createElementClassToDimensionsArray() {
  return [
    // { className: 'toolkit-button-icon', defaultDimensions: { width: 30, padding: 8 } },
  ];
}

function applyElementDimensionsToImageSwitchPanel(delta) {
  const elementsDimensions = createElementToDimensionsArray();
  applyNewDimensionsToIndividualElements(elementsDimensions, delta);
  const elementClassesDimensions = createElementClassToDimensionsArray();
  applyNewDimensionsToElementClasses(elementClassesDimensions, delta);
}

export { applyElementDimensionsToImageSwitchPanel as default };
