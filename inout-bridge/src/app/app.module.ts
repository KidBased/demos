import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ParentComponent } from './parent/parent.component';
import { BridgeComponent } from './parent/bridge/bridge.component';
import { ChildComponent } from './parent/bridge/child/child.component';

@NgModule({
  declarations: [
    AppComponent,
    ParentComponent,
    BridgeComponent,
    ChildComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
