function applyNewDimensions(newDimensions, element) {
  Object.keys(newDimensions).forEach((key) => {
    element.style[key] = `${newDimensions[key]}px`;
  });
}

function applyNewCalcDimensions(newCalcDimensions, element) {
  Object.keys(newCalcDimensions).forEach((key) => {
    element.style[key] = newCalcDimensions[key];
  });
}

function calculateNewCalcDimensions(calcDimensions, widthDelta) {
  if (!calcDimensions) return {};
  const newDimensions = {};
  Object.keys(calcDimensions).forEach((key) => {
    const newDimension = calcDimensions[key].dimension / widthDelta;
    newDimensions[key] = `calc(${calcDimensions[key].prefix}${newDimension}${calcDimensions[key].postfix}`;
  });
  return newDimensions;
}

function calculateNewDimensions(dimensions, widthDelta) {
  const newDimensions = {};
  Object.keys(dimensions).forEach((key) => {
    newDimensions[key] = dimensions[key] / widthDelta;
  });
  return newDimensions;
}

function applyNewDimensionsToElementClasses(elementClassesDimensions, widthDelta) {
  elementClassesDimensions.forEach((elementClass) => {
    const newDimensions = calculateNewDimensions(
      elementClass.defaultDimensions, widthDelta,
    );
    document.querySelectorAll(`.${elementClass.className}`).forEach((element) => {
      applyNewDimensions(newDimensions, element);
    });
  });
}

function applyNewDimensionsToIndividualElements(elementsDimensions, widthDelta) {
  elementsDimensions.forEach((element) => {
    const newDimensions = calculateNewDimensions(
      element.defaultDimensions, widthDelta,
    );
    const calcDimensions = calculateNewCalcDimensions(
      element.calcDimensions, widthDelta,
    );
    applyNewDimensions(newDimensions, document.getElementById(element.id));
    applyNewCalcDimensions(calcDimensions, document.getElementById(element.id));
  });
}

function createElementToDimensionsArray() {
  return [
    { id: 'separator', defaultDimensions: { width: 37, marginLeft: 10, marginBottom: 7 } },
    { id: 'left-side-bar-top-border', defaultDimensions: { paddingTop: 29 } },
    {
      id: 'left-side-bar',
      defaultDimensions: { width: 57 },
      calcDimensions: {
        maxHeight: { dimension: 39, prefix: '100vh - ', postfix: 'px)' },
      },
    },
    {
      id: 'settings-popup',
      defaultDimensions: {
        left: 65, bottom: 18, paddingTop: 4, paddingBottom: 1,
      },
    },
  ];
}

function createElementClassToDimensionsArray() {
  return [
    { className: 'toolkit-button-icon', defaultDimensions: { width: 30, padding: 8 } },
    { className: 'toolkit-popover', defaultDimensions: { marginLeft: 62, marginTop: -38, fontSize: 14.5 } },
    { className: 'settings-checkbox', defaultDimensions: { marginTop: 3, marginBottom: 3 } },
    { className: 'settings-table-row-data', defaultDimensions: { fontSize: 14.5, paddingBottom: 3 } },
  ];
}

function applyElementDimensions() {
  // check if width detla is ok to be used for top and bottom properties
  const defaultScreenWidth = 1920;
  const currentScreenWidth = window.screen.width;
  const quotient = defaultScreenWidth / currentScreenWidth;
  const widthDelta = quotient > 1.14 ? 1.14 : quotient;
  const elementsDimensions = createElementToDimensionsArray();
  applyNewDimensionsToIndividualElements(elementsDimensions, widthDelta);
  const elementClassesDimensions = createElementClassToDimensionsArray();
  applyNewDimensionsToElementClasses(elementClassesDimensions, widthDelta);
}

export { applyElementDimensions as default };
