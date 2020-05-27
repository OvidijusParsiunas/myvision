import { applyNewDimensionsToIndividualElements, applyNewDimensionsToElementClasses } from '../../utils';

function createElementToDimensionsArray() {
  return [
    { id: 'right-side-bar', defaultDimensions: { paddingTop: 8 } },
    { id: 'image-list-title-parent', defaultDimensions: { height: 23 } },
    // { id: 'left-side-bar-top-border', defaultDimensions: { paddingTop: 29 } },
    // {
    //   id: 'left-side-bar',
    //   defaultDimensions: { width: 57 },
    //   calcDimensions: {
    //     maxHeight: {
    //       dimension: 0, additionalCalc: 34, prefix: '100vh - ', postfix: 'px)',
    //     },
    //   },
    // },
    // {
    //   id: 'settings-popup',
    //   defaultDimensions: {
    //     left: 65, bottom: 18, paddingTop: 4, paddingBottom: 1,
    //   },
    // },
  ];
}

function createElementClassToDimensionsArray() {
  return [
    { className: 'right-side-bar-component-title', defaultDimensions: { height: 18, fontSize: 16 } },
    // { className: 'toolkit-popover', defaultDimensions: { marginLeft: 62, marginTop: -38, fontSize: 14.5 } },
    // { className: 'settings-checkbox', defaultDimensions: { marginTop: 3, marginBottom: 3 } },
    // { className: 'settings-table-row-data', defaultDimensions: { fontSize: 14.5, paddingBottom: 3 } },
  ];
}

function applyElementDimensionsToRightSideBar(delta) {
  const elementClassesDimensions = createElementClassToDimensionsArray();
  applyNewDimensionsToElementClasses(elementClassesDimensions, delta);
  const elementsDimensions = createElementToDimensionsArray();
  applyNewDimensionsToIndividualElements(elementsDimensions, delta);
}

export { applyElementDimensionsToRightSideBar as default };
