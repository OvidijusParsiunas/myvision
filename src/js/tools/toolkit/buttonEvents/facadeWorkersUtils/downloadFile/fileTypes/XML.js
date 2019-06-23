import { fileStatus } from '../../uploadFile/uploadImage';
import convertJSONToXML from '../fileTypeConverters/JSONtoXML';
import buildAnnotationsObject from '../fileStructureGenerators/generateStandardAnnotationsObject';

let canvas = null;

function getFileName() {
  const regexToFindFirstWordBeforeFullStop = new RegExp('^([^.]+)');
  return `${regexToFindFirstWordBeforeFullStop.exec(fileStatus.name)[0]}.json`;
}

function generateTempDownloadableElement(xml) {
  const pom = document.createElement('a');
  const bb = new Blob([xml], { type: 'text/plain' });
  pom.setAttribute('href', window.URL.createObjectURL(bb));
  pom.setAttribute('download', getFileName());
  pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  pom.draggable = true;
  pom.classList.add('dragout');
  return pom;
}

function generateXML() {
  const downloadableObject = buildAnnotationsObject(canvas, fileStatus);
  return convertJSONToXML(downloadableObject);
}

function downloadXML() {
  const xml = generateXML();
  const downloadableElement = generateTempDownloadableElement(xml);
  downloadableElement.click();
}


function getPolygonPointsCoordinates(polygon) {
  const coordinatesObj = {
    all_points_x: [],
    all_points_y: [],
  };
  polygon.points.forEach((point) => {
    coordinatesObj.all_points_x.push(point.x / fileStatus.scaleX);
    coordinatesObj.all_points_y.push(point.y / fileStatus.scaleY);
  });
  coordinatesObj.all_points_x.push(polygon.points[0].x / fileStatus.scaleX);
  coordinatesObj.all_points_y.push(polygon.points[0].y / fileStatus.scaleY);
  return coordinatesObj;
}

// should they be rounded?
function getShapeCoordinates() {
  let shapeIndex = 0;
  const shapesCoordinates = {};
  canvas.forEachObject((object) => {
    if (object.shapeName === 'polygon') {
      const coordinatesObj = getPolygonPointsCoordinates(object);
      shapesCoordinates[shapeIndex] = {
        shape_attributes: {
          name: object.shapeName,
          all_points_x: coordinatesObj.all_points_x,
          all_points_y: coordinatesObj.all_points_y,
        },
        region_attributes: {},
      };
      shapeIndex += 1;
    } else if (object.shapeName === 'bndBox') {
      shapesCoordinates[shapeIndex] = {
        shape_attributes: {
          name: 'rect',
          x: object.left / fileStatus.scaleX,
          y: object.top / fileStatus.scaleY,
          width: object.width / fileStatus.scaleX,
          height: object.height / fileStatus.scaleY,
        },
      };
      shapeIndex += 1;
    }
  });
  return shapesCoordinates;
}

function getFinalCoordinatesObj() {
  const coordinatesObj = {
    fileref: '',
    size: 76744,
    filename: fileStatus.name,
    base64_img_data: '',
    file_attributes: {},
  };
  coordinatesObj.regions = getShapeCoordinates();
  const finalObject = {};
  finalObject[fileStatus.name] = coordinatesObj;
  return finalObject;
}


function downloadJSON() {
  const downloadableElement = generateTempDownloadableElement(
    JSON.stringify(getFinalCoordinatesObj()),
  );
  downloadableElement.click();
}

function assignCanvasForDownloadingAnnotationsXML(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForDownloadingAnnotationsXML, downloadXML, downloadJSON };
