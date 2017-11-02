import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class DeepZoomLinkPreviewManagerService {
  public fullScreenChanged = new BehaviorSubject<boolean>(null);

  public annotationSelected = new BehaviorSubject<string>(null);
}
