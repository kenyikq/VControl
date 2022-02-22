import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { BrowserModule } from '@angular/platform-browser';
import { RegistroComponent } from './registro/registro.component';
import {  RouterModule } from '@angular/router';
import  {ReactiveFormsModule}  from '@angular/forms';









@NgModule({
  declarations: [LoginComponent, RegistroComponent,  EstadisticaComponent, ],



  imports: [
    CommonModule, IonicModule, FormsModule, BrowserModule, RouterModule, ReactiveFormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],

})
export class PagesModule { }

