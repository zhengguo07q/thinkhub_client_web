import { BaseLayout } from './BaseLayout';
import { nonLayeredTidyTreeAlgorithms } from '../algorithms/NonLayeredTidyTreeAlgorithms';

export class LeftLayout extends BaseLayout {
  doLayout () {
    nonLayeredTidyTreeAlgorithms(this.root, true);
    this.root.right2left();
    return this.root;
  }
}

