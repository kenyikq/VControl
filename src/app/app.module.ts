import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import  {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BackenModule } from './backen/backen.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {  AngularFireAuthModule } from '@angular/fire/compat/auth';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,  BackenModule, IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFirestoreModule.enablePersistence(),
  BrowserModule, AngularFireStorageModule,
  AngularFireAuthModule,

],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
