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

function calculateNewCalcDimensions(calcDimensions, delta) {
  if (!calcDimensions) return {};
  const newDimensions = {};
  Object.keys(calcDimensions).forEach((key) => {
    const calcDimension = calcDimensions[key];
    let newDimension = calcDimension.dimension / delta;
    if (calcDimension.additionalCalc) newDimension += calcDimension.additionalCalc;
    newDimensions[key] = `calc(${calcDimension.prefix}${newDimension}${calcDimension.postfix}`;
  });
  return newDimensions;
}

function calculateNewDimensions(dimensions, delta) {
  const newDimensions = {};
  Object.keys(dimensions).forEach((key) => {
    newDimensions[key] = dimensions[key] / delta;
  });
  return newDimensions;
}

function applyNewDimensionsToElementClasses(elementClassesDimensions, delta) {
  elementClassesDimensions.forEach((elementClass) => {
    const newDimensions = calculateNewDimensions(elementClass.defaultDimensions, delta);
    const calcDimensions = calculateNewCalcDimensions(elementClass.calcDimensions, delta);
    document.querySelectorAll(`.${elementClass.className}`).forEach((element) => {
      applyNewDimensions(newDimensions, element);
      applyNewCalcDimensions(calcDimensions, document.getElementById(element.id));
    });
  });
}

function applyNewDimensionsToIndividualElements(elementsDimensions, delta) {
  elementsDimensions.forEach((element) => {
    const newDimensions = calculateNewDimensions(element.defaultDimensions, delta);
    const calcDimensions = calculateNewCalcDimensions(element.calcDimensions, delta);
    applyNewDimensions(newDimensions, document.getElementById(element.id));
    applyNewCalcDimensions(calcDimensions, document.getElementById(element.id));
  });
}

export { applyNewDimensionsToElementClasses, applyNewDimensionsToIndividualElements };
