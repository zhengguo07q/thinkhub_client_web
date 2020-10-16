import { BaseLayout } from './BaseLayout';
import { nonLayeredTidyTreeAlgorithms } from '../algorithms/NonLayeredTidyTreeAlgorithms';

export class DownwardLayout extends BaseLayout {
  doLayout () {
    return nonLayeredTidyTreeAlgorithms(this.root, false);
  }
}

