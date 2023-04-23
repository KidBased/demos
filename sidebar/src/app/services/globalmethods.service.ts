import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalMethodsService {
  constructor() {}

  deepCopy<T>(obj: T) {
    const deepCopy = JSON.parse(JSON.stringify(obj));
    return deepCopy;
  }
}
