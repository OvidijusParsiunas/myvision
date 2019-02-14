function downloadXML(){
  removeBndBxIfLabelNamePending();
  if(imageUploaded){
    let xml = generateXML();
    downloadXMLFile(xml);
  }
}

function generateXML() {
  let annotatedImageJSON = {};
  annotatedImageJSON.annotations = getImageDetails();
  annotatedImageJSON.annotations.object = getBoundingBoxCoordinates();
  return convertJSONToXML(annotatedImageJSON);
}

function getImageDetails(){
  return {
    folder: 'sadasd',
    filename: imageName,
    path: 'sadasds',
    source: {
      database: 'Unknown'
    },
    size: {
      width: canvas.getWidth(),
      height: canvas.getHeight(),
      depth: 1,
    },
    segmented: 0
  };
}
function getBoundingBoxCoordinates(){
  let shape = {};
  canvas.forEachObject(function(object){
    let rectangleObject = object._objects[0];
    let rectangleText = object._objects[1].text;
    shape = {
      name: rectangleText,
      pose: 'Unspecified',
      truncated: 1,
      difficult: 0,
      bndbox: {
        xmin: rectangleObject.left,
        ymin: rectangleObject.top,
        xmax: rectangleObject.left + rectangleObject.width,
        ymax: rectangleObject.top + rectangleObject.height
      }
    };
  });
  return shape;
}

function downloadXMLFile(xml){
  let regexToFindFirstWordBeforeFullStop = new RegExp("^([^.]+)");
  var pom = document.createElement('a');
  var filename = imageName + ".xml";
  var bb = new Blob([xml], {type: 'text/plain'});
  pom.setAttribute('href', window.URL.createObjectURL(bb));
  pom.setAttribute('download', regexToFindFirstWordBeforeFullStop.exec(imageName)[0] + ".xml");
  pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  pom.draggable = true;
  pom.classList.add('dragout');
  pom.click();
}
