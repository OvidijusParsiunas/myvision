let labelListElement = null;

function findLabelListElement() {
  labelListElement = document.getElementById('labelList');
}

function initialiseLabelListFunctionality() {
  findLabelListElement();
}

function initialiseNewElement() {
  return document.createElement('button');
}

function addLabelToList(labelName) {
  const labelElement = initialiseNewElement();
  labelElement.innerHTML = labelName;
  labelListElement.appendChild(labelElement);
}

// function createSeries() {
//   return `
//     <button>asdasd</button>
//     <button>idjasdasd</button>
//   `;
// }
//
// function initialiseNewElement() {
//   return document.createElement('id');
// }
//
// function addLabelToList(labelName) {
//   const labelElement = initialiseNewElement();
//   labelElement.innerHTML = createSeries();
//   labelListElement.appendChild(labelElement);
// }

export { initialiseLabelListFunctionality, addLabelToList };
