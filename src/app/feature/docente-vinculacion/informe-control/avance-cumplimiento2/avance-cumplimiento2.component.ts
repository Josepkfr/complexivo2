import { Component, OnInit } from '@angular/core';
import { ModalAlertComponent } from '../../../../../app/shared/material/modal-alert/modal-alert.component';

@Component({
  selector: 'app-avance-cumplimiento2',
  templateUrl: './avance-cumplimiento2.component.html',
  styleUrls: ['./avance-cumplimiento2.component.css']
})
export class AvanceCumplimiento2Component implements OnInit {

  constructor(
    // private avanceCumplimientoHttpService:AvanceCumplimientoHttpService
  ) { }



  showModal = false;
  showModal2 = false;

  toggleModal(){
    this.showModal = !this.showModal;
  }
  toggleModal2(){
    this.showModal2 = !this.showModal2;
  }





  // avance: AvanceCumplimiento = [4];




  ngOnInit(): void {
    // this.findAll();

  }





  save():void{


    // for(let avance1 of this.avance){
    //    if (avance1.avance==''){

    //     this.esvacio=true;
        
    //    }else{
    //     this.avanceCumplimientoHttpService.save(avance1).subscribe()
    //    }

    // }
    }




  // public findAll(): void{
  //   this.avanceCumplimientoHttpService.findAll().subscribe(
  //     (response) => this.avance = response
  //   );
  // }

  // public findByDescription(term:string): void{
  //   if(term.length >= 2){
  //     this.avanceCumplimientoHttpService.findByDescription(term).subscribe(
  //       (response) => this.avance = response
  //     )
  //   }
  //   if(term.length == 0){
  //     this.findAll();
  //   }
  // }
}
