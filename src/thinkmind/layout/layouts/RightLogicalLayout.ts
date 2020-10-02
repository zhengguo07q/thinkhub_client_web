import { BaseLayout } from './BaseLayout';
import { nonLayeredTidyTreeAlgorithms } from '../algorithms/NonLayeredTidyTreeAlgorithms';

export class RightLogicalLayout extends BaseLayout {
  doLayout () {
    return nonLayeredTidyTreeAlgorithms(this.root, true);
  }
}

