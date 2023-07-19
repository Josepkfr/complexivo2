import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AsistService } from 'src/app/service/asistencia/asist.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css'],
})
export class AsistenciaComponent implements OnInit {
  init: string;
  exit: string;
  activities: string;
  initTs: Date;
  exitTs: Date;
  asists:any[]

  constructor(private asisService: AsistService) {}

  ngOnInit() {
    // this.asisService.findAll().subscribe((response:any)=>{
    //   this.asists = response
    // })
    this.asists=[
      {init:new Date(),exit:moment(new Date()).add("hours",3),activities:"Prueba1"},
      {init:new Date(),exit:moment(new Date()).add("hours",3),activities:"Prueba2"},
      {init:new Date(),exit:moment(new Date()).add("hours",3),activities:"Prueba3"},
      {init:new Date(),exit:moment(new Date()).add("hours",3),activities:"Prueba4"},
      {init:new Date(),exit:moment(new Date()).add("hours",3),activities:"Prueba5"},
      {init:new Date(),exit:moment(new Date()).add("hours",3),activities:"Prueba6"},
      {init:new Date(),exit:moment(new Date()).add("hours",3),activities:"Prueba7"}
    ]
  }

  setInit() {
    this.initTs = new Date();
    this.init = moment(this.initTs).format('HH:mm:ss');
  }

  setExit() {
    this.exitTs = new Date();
    this.exit = moment(this.exitTs).format('HH:mm:ss');
  }

  getDate(item:any){
    return moment(item).format("YYYY-MM-DD")
  }

  getHour(item:any){
    return moment(item).format("HH:mm")
  }

  getDifferenceHours(init:any,exit:any){
    const result = moment(init).diff(exit)
    return moment.duration(result).asHours().toFixed(2)
  }

  create() {
    const data = {
      init: this.initTs,
      exit: this.exitTs,
      activities: this.activities,
    };
    this.asisService.create(data).subscribe((res) => {
      this.asisService.findAll().subscribe((response : any)=>{
        this.init=""
        this.exit=""
        this.activities=""
      this.asists = response
    })
    });
  }
}
