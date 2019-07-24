import { removeLabel } from '../../label/label';
import { removeLabelFromList } from '../../../../tools/labelList/labelList';

function removePolygonImpl(canvas, polygon) {
  canvas.remove(polygon);
  removeLabel(polygon.id, canvas);
  removeLabelFromList(polygon.id);
}

export { removePolygonImpl as default };
