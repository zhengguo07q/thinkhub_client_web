import { BaseLayout } from './BaseLayout';
import { nonLayeredTidyTreeAlgorithms } from '../algorithms/NonLayeredTidyTreeAlgorithms';

export class UpwardLayout extends BaseLayout {
  doLayout () {
    nonLayeredTidyTreeAlgorithms(this.root, false);
    this.root.down2up();
    return this.root;
  }
}

