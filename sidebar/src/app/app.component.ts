// Angular
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// Services
import { GlobalMethodsService } from './services/globalmethods.service';
import { ApiService } from './services/api.service';

// RxJS
import { fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("search", {static: true}) searchInput!: ElementRef<HTMLInputElement>;

  tree: INode = {label: "", children: []};
  data: IData[] = [];

  private _treeDeepCopy: INode = {label: "", children: []};

  constructor
  (
    private _apiService: ApiService,
    private _globalMethodsService: GlobalMethodsService
  ) {}

  ngOnInit() {
    this._apiService.getData().subscribe(res => {
       this.data = res.map(obj => obj);
       this.setParentFlag();
       this.initTree();
       this._treeDeepCopy = this._globalMethodsService.deepCopy(this.tree);
    });
  }

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, "keyup")
      .pipe(
        map(() => this.searchInput.nativeElement.value),
        map(searchInput => {
          this.tree.children = this._treeDeepCopy.children.filter(node => this.search(node, searchInput));
        })
      )
      .subscribe(res => res);
  }

  private setParentFlag() {
    for (const obj of this.data) {
      if (obj.parentId == null)
        obj.parent = null;

      for (const child of this.data) {
        if (child.parentId === obj.id)
          child.parent = obj.name;
      }
    }
  }

  private rmDuplicates() {
    const groups = this.data.reduce((acc: string[], curr: IData) => {
      if (acc.indexOf(curr.group) === -1)
        acc.push(curr.group);
      return acc;
    }, []);
    return groups;
  }

  private initTree() {
    const groups = this.rmDuplicates();

    this.tree.children = groups.map(group => ({label: group, children: []}));

    for (const group of this.tree.children) {
      const members = this.data.filter(obj => obj.group === group.label && obj.parentId == null);
      members.forEach(member => {
        group.children.push({label: member.name, children: []});
      });
    }

    for (const group of this.tree.children) {
      for (const member of group.children) {
        const children = this.data.filter(obj => obj.parent === member.label);
        children.forEach(child => {
          member.children.push({label: child.name, children: []});
        });
      }
    }
  }

  private search(node: INode, searchInput: string): boolean {
    const input = searchInput.toLowerCase();
    return (
      node.label.toLowerCase().startsWith(input) ||
      node.children.some(child => this.search(child, input))
    );
  }
}
