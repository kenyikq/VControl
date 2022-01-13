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
import { PagesModule } from './pages/pages.module';
import { LOCALE_ID } from '@angular/core';//para la fecha en espanol
import localeEs from '@angular/common/locales/es';//para la fecha en espanol
import { registerLocaleData } from '@angular/common';//para la fecha en espanol
registerLocaleData(localeEs, 'es');//para la fecha en espanol

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,  BackenModule, PagesModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFirestoreModule.enablePersistence(),
  BrowserModule, AngularFireStorageModule,
  AngularFireAuthModule,

],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, { provide: LOCALE_ID, useValue: 'es',}], //para la fecha
  bootstrap: [AppComponent],
})
export class AppModule {}
