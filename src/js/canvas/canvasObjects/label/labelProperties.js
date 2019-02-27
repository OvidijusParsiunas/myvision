function getLabelProps(targetShape) {
  return {
    fontSize: 10,
    fill: 'yellow',
    left: targetShape.left,
    top: targetShape.top,
    width: targetShape.width,
    height: targetShape.height,
  };
}

export { getLabelProps as default };
