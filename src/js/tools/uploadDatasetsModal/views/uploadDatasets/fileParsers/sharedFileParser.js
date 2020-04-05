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

function xmlToJson(xml) {
  let resultJSONobject = {};
  if (xml.nodeType === 1) {
    if (xml.attributes.length > 0) {
      resultJSONobject['@attributes'] = {};
      for (let i = 0; i < xml.attributes.length; i += 1) {
        const attribute = xml.attributes.item(i);
        resultJSONobject['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    resultJSONobject = xml.nodeValue;
  }
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i += 1) {
      const item = xml.childNodes.item(i);
      const { nodeName } = item;
      if (typeof (resultJSONobject[nodeName]) === 'undefined') {
        resultJSONobject[nodeName] = xmlToJson(item);
      } else {
        if (typeof (resultJSONobject[nodeName].push) === 'undefined') {
          const oldObject = resultJSONobject[nodeName];
          resultJSONobject[nodeName] = [];
          resultJSONobject[nodeName].push(oldObject);
        }
        resultJSONobject[nodeName].push(xmlToJson(item));
      }
    }
  }
  return resultJSONobject;
}

function parseXML(fileMetaData, event) {
  try {
    const parser = new DOMParser();
    const JSONObject = xmlToJson(parser.parseFromString(event.target.result, 'application/xml'));
    return { fileFormat: 'annotation', body: { fileMetaData, annotationData: JSONObject } };
  } catch (errorMessage) {
    return {
      fileFormat: 'annotation',
      body: { fileMetaData },
      errorObj: { error: true, message: `Invalid XML - ${errorMessage}` },
    };
  }
}

function txtToJSON(result, fileMetaData) {
  const lines = result.split('\n');
  let fileEmpty = true;
  let isAnnotationsFile = true;
  const linesOfAttributes = [];
  lines.forEach((line) => {
    const attributes = line
      .split(' ')
      .filter(entry => entry.trim() !== '')
      .map((entry) => {
        const number = Number.parseFloat(entry, 10);
        if (!Number.isNaN(number)) { return number; }
        return entry;
      });
    if (attributes.length > 0) {
      fileEmpty = false;
      if (attributes.length !== 5) {
        isAnnotationsFile = false;
      }
      linesOfAttributes.push(attributes);
    }
  });
  if (fileEmpty) {
    return {
      fileFormat: 'annotation',
      body: { fileMetaData },
      errorObj: { error: true, message: 'Text file is empty' },
    };
  }
  const fileFormat = isAnnotationsFile ? 'annotation' : 'classes';
  return { fileFormat, body: { fileMetaData, annotationData: linesOfAttributes } };
}

function parseTXT(fileMetaData, event) {
  try {
    return txtToJSON(event.target.result, fileMetaData);
  } catch (errorMessage) {
    return {
      fileFormat: 'annotation',
      body: { fileMetaData },
      errorObj: { error: true, message: `Invalid text file - ${errorMessage}` },
    };
  }
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
  if (fileMetaData.name.endsWith('.xml')) {
    return parseXML(fileMetaData, event);
  }
  if (fileMetaData.name.endsWith('.txt')) {
    return parseTXT(fileMetaData, event);
  }
  return {};
}

export { parseAllFiles as default };
