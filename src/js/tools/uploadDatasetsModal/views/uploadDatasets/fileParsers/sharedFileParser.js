function parseImageData(fileMetaData, event) {
  const image = new Image();
  image.src = event.target.result;
  return { fileFormat: 'image', body: { fileMetaData, imageElement: image } };
}

function parseJSON(fileMetaData, event) {
  try {
    const JSONObject = JSON.parse(event.target.result);
    return { fileFormat: 'annotation', body: { fileMetaData, annotationData: JSONObject } };
  } catch (errorMessage) {
    return {
      fileFormat: 'annotation',
      body: { fileMetaData },
      errorObj: { error: true, message: `Invalid JSON - ${errorMessage}` },
    };
  }
}

function parseCSV(fileMetaData, event) {
  // var reader = new FileReader();

  //           reader.onload = function (e) {
	// 		   processData(reader.result);
  //           }

  //           reader.readAsText(xmlFile);

  //           function processData(csv) {
  //       var allTextLines = csv.split(/\r\n|\n/);
  //       var lines = [];
  //       for (var i=0; i<allTextLines.length; i++) {
  //               var tarr = allTextLines[i].split(',')
  //               lines.push(tarr);
  //       }
  //     console.log(lines);
  //   }

    
    // var allTextLines = event.target.result.split(/\r\n|\n/);
    //     var lines = [];
    //     for (var i=0; i<allTextLines.length; i++) {
    //             var tarr = allTextLines[i].split(',')
    //             lines.push(tarr);
    //     }
    //   console.log(lines);
}

function parseAllFiles(fileMetaData, event) {
  if (fileMetaData.type.startsWith('image/')) {
    return parseImageData(fileMetaData, event);
  }
  if (fileMetaData.name.endsWith('.json')) {
    return parseJSON(fileMetaData, event);
  }
  if (fileMetaData.name.endsWith('.csv')) {
    return parseCSV(fileMetaData, event);
  }
  return {};
}

export { parseAllFiles as default };
