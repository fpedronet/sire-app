import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  loading = new Subject<boolean>();

  constructor() { }

  showLoading(){
    this.loading.next(true);
  }

  hideLoading(){
    this.loading.next(false);
  }

}
