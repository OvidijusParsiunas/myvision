function getTempBndBoxProps(bndBoxProps, pointer) {
  return {
    left: bndBoxProps.origX,
    top: bndBoxProps.origY,
    width: pointer.x - bndBoxProps.origX,
    height: pointer.y - bndBoxProps.origY,
    stroke: 'rgba(255,0,0)',
    strokeWidth: 2,
    fill: 'rgba(255,0,0,0)',
    shapeName: 'bndBoxTemp',
  };
}

function getFinalBndBoxProps(targetShape) {
  return {
    left: targetShape.left,
    top: targetShape.top,
    width: targetShape.width,
    height: targetShape.height,
    stroke: 'rgba(255,0,0)',
    strokeWidth: 2,
    fill: 'rgba(255,0,0,0.1)',
    shapeName: 'bndBox',
  };
}

export { getTempBndBoxProps, getFinalBndBoxProps };
