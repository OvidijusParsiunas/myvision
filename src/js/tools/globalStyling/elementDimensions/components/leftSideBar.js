import { applyNewDimensionsToIndividualElements, applyNewDimensionsToElementClasses } from '../utils';

function createElementToDimensionsArray() {
  return [
    { id: 'separator', defaultDimensions: { width: 37, marginLeft: 10, marginBottom: 7 } },
    { id: 'left-side-bar-top-border', defaultDimensions: { paddingTop: 29 } },
    {
      id: 'left-side-bar',
      defaultDimensions: { width: 57 },
      calcDimensions: {
        maxHeight: {
          dimension: 0, additionalCalc: 34, prefix: '100vh - ', postfix: 'px)',
        },
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
    { className: 'toolkit-button-icon', defaultDimensions: { width: 30, padding: 7.5 } },
    { className: 'toolkit-popover', defaultDimensions: { marginLeft: 62, marginTop: -38, fontSize: 14.5 } },
    { className: 'settings-checkbox', defaultDimensions: { marginTop: 3, marginBottom: 3 } },
    { className: 'settings-table-row-data', defaultDimensions: { fontSize: 14.5, paddingBottom: 3 } },
  ];
}

function applyElementDimensionsToLeftSideBar(delta) {
  const elementsDimensions = createElementToDimensionsArray();
  applyNewDimensionsToIndividualElements(elementsDimensions, delta);
  const elementClassesDimensions = createElementClassToDimensionsArray();
  applyNewDimensionsToElementClasses(elementClassesDimensions, delta);
}

export { applyElementDimensionsToLeftSideBar as default };
