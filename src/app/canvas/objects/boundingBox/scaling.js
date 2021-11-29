import { setBoundingBoxScalingState, getCurrentZoomState } from '../../../tools/state.js';
import { getImageProperties } from '../../../tools/imageList/uploadImages/drawImageOnCanvas.js';
import labelProperies from '../label/properties.js';

let originalBoundingBoxBottomCoordinate = 0;
let originalBoundingBoxLeftCoordinate = 0;
let originalBoundingBoxTopCoordinate = 0;
let originalBoundingBoxRightCoordinate = 0;
let rightBoundingBoxDelta = 0;

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

function prepareBoundingBoxToBeEdited(boundingBox) {
  const { height, width } = getImageProperties();
  const currentZoomState = getCurrentZoomState();
  if (boundingBox.top + boundingBox.height > height * currentZoomState - 2) {
    boundingBox.height = (height * currentZoomState - 2) - boundingBox.top;
  } else if (boundingBox.left + boundingBox.width > width * currentZoomState - 2) {
    boundingBox.width = (width * currentZoomState - 2) - boundingBox.left;
  }
}

function setRightBoundingBoxScalingDelta(delta) {
  rightBoundingBoxDelta = delta;
}

function clearControlSelectedObject() {
  Object.keys(controlSelected).forEach((key) => {
    controlSelected[key] = false;
  });
}

function setInitialBoundingBoxCoordinates(event) {
  setBoundingBoxScalingState(true);
  prepareBoundingBoxToBeEdited(event.target);
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
      // fix for when uploading dataset to a second canvas that has not been viewed and dragging
      // top right of a bbox that is on the right side of an image, thus going out of canvas
      // note that this does cause an initial scaling twitch but it is acceptable for now
      event.target.left = originalBoundingBoxLeftCoordinate + event.target.width;
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

function setDefaultScalingValues(boundingBox, labelObject, labelLeftOffset, pointer) {
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
  labelObject.left = boundingBox.left + labelLeftOffset;
  labelObject.top = boundingBox.top;
}

function handleBoundingBoxScalingEvents(event, labelObject, canvas) {
  if (event.target.shapeName !== 'bndBox') return;
  const labelLeftOffset = labelProperies.boundingBoxOffsetProperties().left;
  const { height, width } = getImageProperties();
  const currentZoomState = getCurrentZoomState();
  const pointer = canvas.getPointer(canvas.e);
  const imageHeight = height * currentZoomState;
  const imageWidth = width * currentZoomState;
  const boundingBox = event.target;
  boundingBox.setCoords();
  let blocking = false;
  let blockingTop = false;
  let blockingRight = false;
  let blockingLeft = false;
  // repeating changes variable and setDefaultScales function logic as the object could already
  // be at the boundary without having to use any of the conditional controls
  // top
  if (boundingBox.top <= 0) {
    // console.log('1');
    blockingTop = true;
    if (controlSelected.topLeft) {
      blocking = true;
      boundingBox.top = 0;
      boundingBox.height = originalBoundingBoxBottomCoordinate;
      if (boundingBox.width <= 0) {
        boundingBox.left = originalBoundingBoxRightCoordinate - 1;
        boundingBox.width = 1;
      } else {
        boundingBox.left = pointer.x;
        boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
      }
      labelObject.left = boundingBox.left + labelLeftOffset;
      labelObject.top = boundingBox.top;
      setDefaultScales(boundingBox);
    } else if (controlSelected.topRight) {
      blocking = true;
      boundingBox.height = originalBoundingBoxBottomCoordinate;
      boundingBox.top = 0;
      if (boundingBox.width <= 0) {
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        boundingBox.width = 1;
      } else {
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
      }
      labelObject.left = boundingBox.left + labelLeftOffset;
      labelObject.top = boundingBox.top;
      setDefaultScales(boundingBox);
    } else if (controlSelected.middleTop) {
      blocking = true;
      boundingBox.top = 0;
      boundingBox.height = originalBoundingBoxBottomCoordinate;
      setDefaultScales(boundingBox);
    }
  } else if (controlSelected.middleTop) {
    boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
  }
  // left
  if (boundingBox.left <= 0) {
    blockingLeft = true;
    if (controlSelected.topLeft) {
      blocking = true;
      if (!blockingTop) {
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
      labelObject.left = boundingBox.left + labelLeftOffset;
      labelObject.top = boundingBox.top;
      setDefaultScales(boundingBox);
    } else if (controlSelected.bottomLeft) {
      blocking = true;
      if (boundingBox.height <= 0) {
        boundingBox.top = originalBoundingBoxTopCoordinate;
        boundingBox.height = 1;
      } else {
        boundingBox.top = originalBoundingBoxTopCoordinate;
        boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
      }
      boundingBox.left = 0;
      boundingBox.width = originalBoundingBoxRightCoordinate;
      labelObject.left = boundingBox.left + labelLeftOffset;
      labelObject.top = boundingBox.top;
      setDefaultScales(boundingBox);
    } else if (controlSelected.middleLeft) {
      blocking = true;
      boundingBox.left = 0;
      setDefaultScales(boundingBox);
      boundingBox.width = originalBoundingBoxRightCoordinate;
    }
  } else if (controlSelected.middleLeft) {
    boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
  }
  if (currentZoomState > 1.00001) {
    // right
    if ((boundingBox.width + boundingBox.left) > imageWidth / currentZoomState - 1) {
      // console.log('3');
      blockingRight = true;
      if (controlSelected.topRight) {
        blocking = true;
        if (!blockingTop) {
          if (boundingBox.height <= 0) {
            boundingBox.top = originalBoundingBoxBottomCoordinate - 1;
            boundingBox.height = 1;
          } else {
            boundingBox.top = pointer.y;
            boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
          }
        }
        boundingBox.width = imageWidth / currentZoomState - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelLeftOffset;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomRight) {
        blocking = true;
        if (boundingBox.height <= 0) {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = 1;
        } else {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
        }
        boundingBox.width = imageWidth / currentZoomState - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelLeftOffset;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.width = imageWidth / currentZoomState - boundingBox.left - 2;
      }
    }
    // bottom
    if ((boundingBox.height + boundingBox.top) > imageHeight / currentZoomState - 2) {
    //   console.log('4');
      if (controlSelected.bottomRight) {
        blocking = true;
        if (!blockingRight) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = 1;
          } else {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
          }
        }
        boundingBox.height = imageHeight / currentZoomState - boundingBox.top - 2;
        labelObject.left = boundingBox.left + labelLeftOffset;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomLeft) {
        blocking = true;
        if (!blockingLeft) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxRightCoordinate - 1;
            boundingBox.width = 1;
          } else {
            boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
            boundingBox.left = pointer.x;
          }
        }
        boundingBox.height = imageHeight / currentZoomState - boundingBox.top - 2;
        labelObject.left = boundingBox.left + labelLeftOffset;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.height = imageHeight / currentZoomState - boundingBox.top - 2;
      }
    }
  } else {
    // right
    if ((boundingBox.width + boundingBox.left) > canvas.width - rightBoundingBoxDelta) {
      // console.log('5');
      blockingRight = true;
      if (controlSelected.topRight) {
        blocking = true;
        if (!blockingTop) {
          if (boundingBox.height <= 0) {
            boundingBox.top = originalBoundingBoxBottomCoordinate - 1;
            boundingBox.height = 1;
          } else {
            boundingBox.top = pointer.y;
            boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
          }
        }
        boundingBox.width = Math.floor(canvas.width - boundingBox.left - rightBoundingBoxDelta);
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelLeftOffset;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomRight) {
        blocking = true;
        if (boundingBox.height <= 0) {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = 1;
        } else {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
        }
        boundingBox.width = Math.floor(canvas.width - boundingBox.left - rightBoundingBoxDelta);
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelLeftOffset;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.width = Math.floor(canvas.width - boundingBox.left - rightBoundingBoxDelta);
      }
    }
    // bottom
    if ((boundingBox.height + boundingBox.top) > canvas.height - 2) {
      // console.log('6');
      if (controlSelected.bottomRight) {
        blocking = true;
        if (!blockingRight) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = 1;
          } else {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
          }
        }
        boundingBox.height = Math.floor(canvas.height - boundingBox.top - 2);
        labelObject.left = boundingBox.left + labelLeftOffset;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomLeft) {
        blocking = true;
        if (!blockingLeft) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxRightCoordinate - 1;
            boundingBox.width = 1;
          } else {
            boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
            boundingBox.left = pointer.x;
          }
        }
        boundingBox.height = Math.floor(canvas.height - boundingBox.top - 2);
        labelObject.left = boundingBox.left + labelLeftOffset;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.height = canvas.height - boundingBox.top - 2;
      }
    }
  }
  if (!blocking) {
    // console.log('7');
    setDefaultScalingValues(boundingBox, labelObject, labelLeftOffset, pointer);
  }
}

export {
  setRightBoundingBoxScalingDelta, clearControlSelectedObject,
  setInitialBoundingBoxCoordinates, handleBoundingBoxScalingEvents,
};
