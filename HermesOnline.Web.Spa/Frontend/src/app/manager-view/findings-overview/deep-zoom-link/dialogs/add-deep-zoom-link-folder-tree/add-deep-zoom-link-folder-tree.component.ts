// tslint:disable:max-line-length

import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Tree } from '../../../../../../custom_node_modules/ng2-tree/src/tree';
import { TreeModel, FoldingType } from '../../../../../../custom_node_modules/ng2-tree/src/tree.types';
import { NodeEvent } from '../../../../../../custom_node_modules/ng2-tree/src/tree.events';
import { FullPath } from '../../../../../models/manager-view/finding-overview/common/deep-zoom-link/add-deep-zoom-link-folder-tree.model';
import { AddDeepZoomLinkService } from '../../../../../services/data-services/add-deep-zoom-link.service';

@Component({
  selector: 'app-add-deep-zoom-link-folder-tree',
  templateUrl: './add-deep-zoom-link-folder-tree.component.html',
  styleUrls: ['./add-deep-zoom-link-folder-tree.component.scss'],
  providers: [AddDeepZoomLinkService],
  encapsulation: ViewEncapsulation.None
})
export class AddDeepZoomLinkFolderTreeComponent implements OnInit {
  public fullPath: string;
  public tree: TreeModel;


  constructor(
    private addDeepZoomLinksService: AddDeepZoomLinkService,
    private dialogRef: MdDialogRef<AddDeepZoomLinkFolderTreeComponent>) { }

  ngOnInit() {
    this.addDeepZoomLinksService.getRootFolders().subscribe(result => {
      this.tree = {
        value: 'Root',
        fullPath: '',
        foldingType: FoldingType.Expanded,
        hasChildren: true,
        loadChildren: (callback) => {
          result.forEach(item => {
            item.loadChildren = (childCallback) => {
              this.loadChildrenAsync(childCallback, item.fullPath);
            };
          });
          callback(result);
        }
      };
    });
  }

  private loadChildrenAsync(callback, path: string) {
    const fullPath = new FullPath(path);
    this.addDeepZoomLinksService.getChildFolders(fullPath).subscribe(res => {
      res.forEach(item => {
        if (item.hasChildren) {
          item.loadChildren = (childCallback) => {
            this.loadChildrenAsync(childCallback, item.fullPath);
          };
        }
      });
      callback(res);
    });
  }

  chooseFolder() {
    this.dialogRef.close(this.fullPath);
  }

  public selectedFolder(e: NodeEvent): void {
    this.fullPath = e.node.node.fullPath;
  }

  private getFullPath(node: Tree): string {
    return this.getParent(node);
  }

  private getParent(node: Tree): string {
    if (node.parent) {
      return this.getParent(node.parent) + '/' + node.value;
    } else {
      return node.value;
    }
  }
}
