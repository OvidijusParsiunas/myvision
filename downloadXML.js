import { fileStatus } from './uploadFile';
import { removeBndBxIfLabelNamePending } from './labelNamePopUp';
import convertJSONToXML from './JSONtoXML';

let canvas = null;

function getImageDetails() {
  return {
    folder: 'Unknown',
    filename: fileStatus.name,
    path: 'Unknown',
    source: {
      database: 'Unknown',
    },
    size: {
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      depth: 1,
    },
    segmented: 0,
  };
}

function getBoundingBoxCoordinates() {
  let shape = {};
  canvas.forEachObject((object) => {
    const rectangleObject = object._objects[0];
    const rectangleText = object._objects[1].text;
    shape = {
      name: rectangleText,
      pose: 'Unspecified',
      truncated: 1,
      difficult: 0,
      bndbox: {
        xmin: rectangleObject.left,
        ymin: rectangleObject.top,
        xmax: rectangleObject.left + rectangleObject.width,
        ymax: rectangleObject.top + rectangleObject.height,
      },
    };
  });
  return shape;
}

function downloadXMLFile(xml) {
  const regexToFindFirstWordBeforeFullStop = new RegExp('^([^.]+)');
  const pom = document.createElement('a');
  const bb = new Blob([xml], { type: 'text/plain' });
  pom.setAttribute('href', window.URL.createObjectURL(bb));
  const fileNameNoTail = `${regexToFindFirstWordBeforeFullStop.exec(fileStatus.name)[0]}.xml`;
  pom.setAttribute('download', fileNameNoTail);
  pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  pom.draggable = true;
  pom.classList.add('dragout');
  pom.click();
}

function generateXML() {
  const annotatedImageJSON = {};
  annotatedImageJSON.annotations = getImageDetails();
  annotatedImageJSON.annotations.object = getBoundingBoxCoordinates();
  return convertJSONToXML(annotatedImageJSON);
}

function downloadXML() {
  removeBndBxIfLabelNamePending();
  if (fileStatus.uploaded) {
    const xml = generateXML();
    downloadXMLFile(xml);
  }
}

function setCanvasDownloadXML(canvasObj) {
  window.downloadXML = downloadXML;
  canvas = canvasObj;
}

export { setCanvasDownloadXML as default };
