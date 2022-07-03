import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sire-app';
  constructor(
    private update: SwPush
  ){

  }
  ngOnInit(): void {
    
  }
  
  // updateClient(){
  //   if(!this.update.isEnabled){
  //     console.log('Not Enabled');
  //     return;
  //   }

  //   this.update.available.
  // }
}