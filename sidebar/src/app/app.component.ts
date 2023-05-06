// Angular
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// Services
import { ApiService } from './services/api.service';

// RxJS
import { fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("search", {static: true}) query!: ElementRef<HTMLInputElement>;

  tree: INode = {label: "", children: []};
  private _data: IData[] = [];

  constructor(private _apiService: ApiService) {}

  ngOnInit() {
    this._apiService.getData().subscribe(res => {
       this._data = res.map(obj => obj);
       this.setParentFlag();
       this.initTree(this._data);
    });
  }

  ngAfterViewInit() {
    fromEvent(this.query.nativeElement, "keyup")
      .pipe(
        map(() => this.query.nativeElement.value),
        map(query => {
          const queries = this.search(query);
          this.initTree(queries);
        })
      )
      .subscribe(res => res);
  }

  private setParentFlag() {
    for (const obj of this._data) {
      if (obj.parentId == null)
        obj.parent = null;

      for (const child of this._data) {
        if (child.parentId === obj.id)
          child.parent = obj.label;
      }
    }
  }

  private rmDuplicates() {
    const groups = this._data.reduce((acc: string[], curr: IData) => {
      if (acc.indexOf(curr.group) === -1)
        acc.push(curr.group);
      return acc;
    }, []);
    return groups;
  }

  private initTree(data: IData[]) {
    this.tree = {label: "", children: []};
    const groups = this.rmDuplicates();

    this.tree.children = groups.map(group => ({label: group, children: []}));

    for (const group of this.tree.children) {
      const members = data.filter(obj => obj.group === group.label && obj.parentId == null);
      members.forEach(member => {
        group.children.push({label: member.label, children: []});
      });
    }

    for (const group of this.tree.children) {
      for (const member of group.children) {
        const children = data.filter(obj => obj.parent === member.label);
        children.forEach(child => {
          member.children.push({label: child.label, children: []});
        });
      }
    }

    this.tree.children = this.tree.children.filter(node => node.children.length > 0);
  }

  private search(query: string) {
    const input = query.toLowerCase();
    let filteredData = this._data;

    if (input !== "") {
      filteredData = this._data.filter(obj => {
        return obj.group.toLowerCase().startsWith(input) ||
        obj.label.toLowerCase().startsWith(input) ||
        obj.parent?.toLowerCase().startsWith(input)
      });
    }

    filteredData.forEach(obj => {
      const parent = this._data.find(parent => parent.label === obj.parent);
      if (parent && !filteredData.includes(parent))
        filteredData.push(parent);
    });

    return filteredData;
  }
}
