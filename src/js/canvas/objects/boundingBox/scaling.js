import { setBoundingBoxScalingState, getCurrentZoomState } from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import { getImageProperties } from '../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';
import labelProperies from '../label/properties';

let originalBoundingBoxBottomCoordinate = 0;
let originalBoundingBoxLeftCoordinate = 0;
let originalBoundingBoxTopCoordinate = 0;
let originalBoundingBoxRightCoordinate = 0;

const controlSelected = {
  middleTop: false,
  topRight: false,
  middleRight: false,
  bottomRight: false,
  middleBottom: false,
  bottomLeft: false,
  middleLeft: false,
  topLeft: false,
};

function clearControlSelectedObject() {
  Object.keys(controlSelected).forEach((key) => {
    controlSelected[key] = false;
  });
}

function setInitialBoundingBoxCoordinates(event) {
  setBoundingBoxScalingState(true);
  switch (event.transform.corner) {
    case 'ml':
      originalBoundingBoxRightCoordinate = event.target.left + event.target.width;
      controlSelected.middleLeft = true;
      break;
    case 'mt':
      originalBoundingBoxBottomCoordinate = event.target.top + event.target.height;
      controlSelected.middleTop = true;
      break;
    case 'tl':
      originalBoundingBoxRightCoordinate = event.target.left + event.target.width;
      originalBoundingBoxBottomCoordinate = event.target.top + event.target.height;
      controlSelected.topLeft = true;
      break;
    case 'tr':
      originalBoundingBoxBottomCoordinate = event.target.top + event.target.height;
      originalBoundingBoxLeftCoordinate = event.target.left;
      controlSelected.topRight = true;
      break;
    case 'mr':
      controlSelected.middleRight = true;
      break;
    case 'br':
      originalBoundingBoxLeftCoordinate = event.target.left;
      originalBoundingBoxTopCoordinate = event.target.top;
      controlSelected.bottomRight = true;
      break;
    case 'mb':
      controlSelected.middleBottom = true;
      break;
    case 'bl':
      originalBoundingBoxRightCoordinate = event.target.left + event.target.width;
      originalBoundingBoxTopCoordinate = event.target.top;
      controlSelected.bottomLeft = true;
      break;
    default:
      clearControlSelectedObject();
      break;
  }
}

function setDefaultScales(boundingBox) {
  boundingBox.scaleX = 1;
  boundingBox.scaleY = 1;
}

function setDefaultScalingValues(boundingBox, pointer, labelObject) {
  if (controlSelected.topLeft) {
    if (boundingBox.width <= 0) {
      boundingBox.left = originalBoundingBoxRightCoordinate;
      boundingBox.width = 1;
    } else {
      boundingBox.left = pointer.x;
      boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
    }
    if (boundingBox.height <= 0) {
      boundingBox.top = originalBoundingBoxBottomCoordinate;
      boundingBox.height = 1;
    } else {
      boundingBox.top = pointer.y;
      boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
    }
  } else if (controlSelected.topRight) {
    if (boundingBox.width <= 0) {
      boundingBox.left = originalBoundingBoxLeftCoordinate;
      boundingBox.width = 1;
    } else {
      boundingBox.left = originalBoundingBoxLeftCoordinate;
      boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
    }
    if (boundingBox.height <= 0) {
      boundingBox.top = originalBoundingBoxBottomCoordinate;
      boundingBox.height = 1;
    } else {
      boundingBox.top = pointer.y;
      boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
    }
  } else if (controlSelected.bottomLeft) {
    if (boundingBox.width <= 0) {
      boundingBox.left = originalBoundingBoxRightCoordinate;
      boundingBox.width = 1;
    } else {
      boundingBox.left = pointer.x;
      boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
    }
    if (boundingBox.height <= 0) {
      boundingBox.top = originalBoundingBoxTopCoordinate;
      boundingBox.height = 1;
    } else {
      boundingBox.top = originalBoundingBoxTopCoordinate;
      boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
    }
  } else if (controlSelected.bottomRight) {
    if (boundingBox.width <= 0) {
      boundingBox.left = originalBoundingBoxLeftCoordinate;
      boundingBox.width = 1;
    } else {
      boundingBox.left = originalBoundingBoxLeftCoordinate;
      boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
    }
    if (boundingBox.height <= 0) {
      boundingBox.top = originalBoundingBoxTopCoordinate;
      boundingBox.height = 1;
    } else {
      boundingBox.top = originalBoundingBoxTopCoordinate;
      boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
    }
  } else {
    boundingBox.width *= boundingBox.scaleX;
    boundingBox.height *= boundingBox.scaleY;
  }
  setDefaultScales(boundingBox);
  labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
  labelObject.top = boundingBox.top;
}

function handleBoundingBoxScalingEvents(event, canvas, labelObject) {
  if (event.target.shapeName !== 'bndBox') return;
  const boundingBox = event.target;
  const { height, width } = getImageProperties();
  const imageHeight = height * getCurrentZoomState();
  const imageWidth = width * getCurrentZoomState();
  boundingBox.setCoords();
  const pointer = canvas.getPointer(canvas.e);
  let changed = false;
  let topBlocking = false;
  let rightBlocking = false;
  let leftBlocking = false;
  // top
  // make sure that the bounding box cannot be reflected when top is 0

  // repeating boolean changes and setDefaultScales call logic due to the object potentially already
  // being at the boundary without having to use any of the conditional controls
  if (boundingBox.top <= 0) {
    // console.log('1');
    topBlocking = true;
    if (controlSelected.topLeft) {
      changed = true;
      boundingBox.top = 0;
      boundingBox.height = originalBoundingBoxBottomCoordinate;
      if (boundingBox.width <= 0) {
        boundingBox.left = originalBoundingBoxRightCoordinate - 1;
        boundingBox.width = 1;
      } else {
        boundingBox.left = pointer.x;
        boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
      }
      labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
      labelObject.top = boundingBox.top;
      setDefaultScales(boundingBox);
    } else if (controlSelected.topRight) {
      changed = true;
      boundingBox.top = 0;
      boundingBox.height = originalBoundingBoxBottomCoordinate;
      if (boundingBox.width <= 0) {
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        boundingBox.width = 1;
      } else {
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
      }
      labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
      labelObject.top = boundingBox.top;
      setDefaultScales(boundingBox);
    } else if (controlSelected.middleTop) {
      changed = true;
      boundingBox.top = 0;
      boundingBox.height = originalBoundingBoxBottomCoordinate;
      setDefaultScales(boundingBox);
    }
  } else if (controlSelected.middleTop) {
    boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
  }
  // left
  if (boundingBox.left <= 0) {
    leftBlocking = true;
    if (controlSelected.topLeft) {
      changed = true;
      if (!topBlocking) {
        if (boundingBox.height <= 0) {
          boundingBox.top = originalBoundingBoxBottomCoordinate - 1;
          boundingBox.height = 1;
        } else {
          boundingBox.top = pointer.y;
          boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
        }
      }
      boundingBox.left = 0;
      boundingBox.width = originalBoundingBoxRightCoordinate;
      labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
      labelObject.top = boundingBox.top;
      setDefaultScales(boundingBox);
    } else if (controlSelected.bottomLeft) {
      changed = true;
      if (boundingBox.height <= 0) {
        boundingBox.top = originalBoundingBoxTopCoordinate;
        boundingBox.height = 1;
      } else {
        boundingBox.top = originalBoundingBoxTopCoordinate;
        boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
      }
      boundingBox.left = 0;
      boundingBox.width = originalBoundingBoxRightCoordinate;
      labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
      labelObject.top = boundingBox.top;
      setDefaultScales(boundingBox);
    } else if (controlSelected.middleLeft) {
      changed = true;
      boundingBox.left = 0;
      setDefaultScales(boundingBox);
      boundingBox.width = originalBoundingBoxRightCoordinate;
    }
  } else if (controlSelected.middleLeft) {
    boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
  }
  if (getCurrentZoomState() > 1.00001) {
    // right
    // console.log('3');
    if ((boundingBox.width + boundingBox.left) > imageWidth / getCurrentZoomState()) {
      rightBlocking = true;
      if (controlSelected.topRight) {
        changed = true;
        if (!topBlocking) {
          if (boundingBox.height <= 0) {
            boundingBox.top = originalBoundingBoxBottomCoordinate - 1;
            boundingBox.height = 1;
          } else {
            boundingBox.top = pointer.y;
            boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
          }
        }
        boundingBox.width = imageWidth / getCurrentZoomState() - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomRight) {
        changed = true;
        if (boundingBox.height <= 0) {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = 1;
        } else {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
        }
        boundingBox.width = imageWidth / getCurrentZoomState() - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.width = imageWidth / getCurrentZoomState() - boundingBox.left - 2;
      }
    }
    // bottom
    if ((boundingBox.height + boundingBox.top) > imageHeight / getCurrentZoomState()) {
    //   console.log('4');
      if (controlSelected.bottomRight) {
        changed = true;
        if (!rightBlocking) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = 1;
          } else {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
          }
        }
        boundingBox.height = imageHeight / getCurrentZoomState() - boundingBox.top - 2;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomLeft) {
        changed = true;
        if (!leftBlocking) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxRightCoordinate - 1;
            boundingBox.width = 1;
          } else {
            boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
            boundingBox.left = pointer.x;
          }
        }
        boundingBox.height = imageHeight / getCurrentZoomState() - boundingBox.top - 2;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.height = imageHeight / getCurrentZoomState() - boundingBox.top - 2;
      }
    }
  } else {
    // right
    // console.log('5');
    if ((boundingBox.width + boundingBox.left) > canvas.width) {
      rightBlocking = true;
      if (controlSelected.topRight) {
        changed = true;
        if (!topBlocking) {
          if (boundingBox.height <= 0) {
            boundingBox.top = originalBoundingBoxBottomCoordinate - 1;
            boundingBox.height = 1;
          } else {
            boundingBox.top = pointer.y;
            boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
          }
        }
        boundingBox.width = canvas.width - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomRight) {
        changed = true;
        if (boundingBox.height <= 0) {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = 1;
        } else {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
        }
        boundingBox.width = canvas.width - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.width = canvas.width - boundingBox.left - 2;
      }
    }
    // bottom
    if ((boundingBox.height + boundingBox.top) > canvas.height) {
    //   console.log('6');
      if (controlSelected.bottomRight) {
        changed = true;
        if (!rightBlocking) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = 1;
          } else {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
          }
        }
        boundingBox.height = canvas.height - boundingBox.top;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomLeft) {
        changed = true;
        if (!leftBlocking) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxRightCoordinate - 1;
            boundingBox.width = 1;
          } else {
            boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
            boundingBox.left = pointer.x;
          }
        }
        boundingBox.height = canvas.height - boundingBox.top - 2;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.height = canvas.height - boundingBox.top - 2;
      }
    }
  }
  if (!changed) {
    // console.log('7');
    setDefaultScalingValues(boundingBox, pointer, labelObject);
  }
}

export {
  setInitialBoundingBoxCoordinates, handleBoundingBoxScalingEvents, clearControlSelectedObject,
};
