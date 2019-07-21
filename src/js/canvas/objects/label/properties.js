const labelProperties = {};

function getLabelProps(coordinates) {
  return {
    fontSize: 10,
    fill: 'yellow',
    left: coordinates.left,
    top: coordinates.top,
    shapeName: 'label',
  };
}

(function setProperties() {
  labelProperties.offsetCoordinates = {
    left: '10',
    top: '12',
  };
  labelProperties.getLabelProps = getLabelProps;
}());
export { labelProperties as default };
