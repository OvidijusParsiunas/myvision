import { removeLabel } from '../../label/label';
import { removeLabelFromList } from '../../../../tools/labelList/labelList';
import { removeShape } from '../../allShapes/allShapes';

function removePolygonImpl(canvas, polygon) {
  const polygonId = polygon.id;
  removeShape(polygonId);
  removeLabel(polygonId, canvas);
  removeLabelFromList(polygonId);
}

export { removePolygonImpl as default };
