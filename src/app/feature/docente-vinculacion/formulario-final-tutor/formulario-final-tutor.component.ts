import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { ImageConstants } from 'src/app/constanst/ImageConstants';
import { ProyectoModels } from 'src/app/models/proyecto/proyecto.models';
import { ActividadesService } from 'src/app/service/actividades/actividades.service';
import { AvanceCumplimientoService } from 'src/app/service/avanze_cumplimiento/avance-cumplimiento.service';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FormModalComponent } from './modal_form/formmodal.component';
@Component({
  selector: 'app-formulario-final-tutor',
  templateUrl: './formulario-final-tutor.component.html',
  styleUrls: ['./formulario-final-tutor.component.css']
})
export class FormularioFinalTutorComponent implements OnInit {

  public doc: any;
  observacion: any;
  proyectos: any[] = [];
  activities: any[] = [];
  id_proyecto: any;
  projectId: number;
  id_table:number;
  public activitiesData: any = [];

  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<FormModalComponent, any> | undefined;
  constructor(
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,
    public matDialog: MatDialog,
    private httpProvider: AvanceCumplimientoService,
    private actividadesService: ActividadesService,

    private miDatePipe: DatePipe
  ) { }
  ngAfterViewInit(): void {
    document.onclick = (args: any): void => {
      if (args.target.tagName === 'BODY') {
        this.modalDialog?.close()
      }
    }
  }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { orderby: "price" }
        this.projectId = params['id_proyecto'];
        if (this.projectId) {

          this.getAllProyectoById(this.projectId)
        }
        console.log(this.projectId);
      });

      this.getAllActividades();
   
  }

  public save_comend(id:any) {
    console.log(id);
    this.id_table= id;
    
    this.dialogConfig.id = "projects-modal-component";
    this.dialogConfig.height = "400px";
    this.dialogConfig.width = "500px";
    this.modalDialog = this.matDialog.open(FormModalComponent, this.dialogConfig);
    this.modalDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      for (let index = 0; index < this.activitiesData.length; index++) {
        const element = this.activitiesData[index];
        if (element.id == this.id_table) {
          console.log(element);
          this.activitiesData[index]["observacion"]=localStorage.getItem("observacion");
        }
        
        
      }
      this.activitiesData= this.activitiesData
    });
  }
  
  public getAllProyectoById(id: number): void {
    this.httpProvider.getProyectoById(id).subscribe((data: any) => {

      console.log(data);

      this.proyectos = Object.values(data);
      console.log(this.proyectos);
      if (data.data.projects != null && data.data.projects != null) {
        var resultData = data.data.projects;
        if (resultData) {


          this.proyectos = [resultData];
          console.log(this.proyectos);
          // this.getAllActividades(1);

        }
      }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.proyectos = [];
            }
          }
        }
      });
  }
  public getAllActividades() {
    this.actividadesService.getAllActivities().subscribe((data: any) => {

      console.log(data);


      if (data.data.activity != null && data.data.activity != null) {
        var resultData = data.data.activity;
        if (resultData) {
          console.log(resultData);
          for (let index = 0; index < resultData.length; index++) {
            const element = resultData[index];

            resultData[index]["observacion"]=""
          }
          this.activitiesData = resultData;
        }
      }
    },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              // this.activities = [];
            }
          }
        }
      });
  }
  /* pdf proyecto*/
  public Generar_Solicitud() {
    this.doc = new jsPDF('p', 'pt');
    this.doc.addImage(ImageConstants.fondo_pdf, 'JPG', 0, 0, 595, 842);
    this.doc.setFontSize(14);
    // this.doc.setFontStyle('bold');
    this.doc.setFont("Roboto", 'bold');
    this.doc.text('INSTITUTO SUPERIOR TECNOLÓGICO', 175, 140);
    this.doc.text('D E  T U R I S M O   Y  P A T R I M O N I O', 155, 160);
    this.doc.text('“Y A V I R A C”', 250, 175);
    this.doc.setFontSize(12);
    this.doc.text('Informe de seguimiento y/o final de actividades de vinculación con la comunidad', 95, 210);


    this.doc.setFontSize(9);
    this.doc.line(45, 700, 200, 700);
    this.doc.text('TUTOR PROYECTO', 65, 710);
    this.doc.text('$F{Tutor}', 75, 725, { maxWidth: 100, align: 'center' });

    this.doc.line(250, 700, 375, 700);
    this.doc.text('TUTOR ENTIDAD BENEFICIARIA', 240, 710);
    this.doc.text('$F{rector}', 295, 725, { maxWidth: 100, align: 'center' });

    this.doc.line(450, 700, 550, 700);
    this.doc.text('ESTUDIANTE', 470, 710,);
    this.doc.text('$F{rector}', 475, 725, { maxWidth: 100, align: 'center' });
    var elem = document.getElementById('table');
    var data = this.doc.autoTableHtmlToJson(elem);
    // this.doc.autoTable(data.columns, data.rows);
    this.doc.autoTable(data.columns, data.rows, {
      startY: 255,
      margin: { top: 380, right: 60, bottom: 100 },
      styles: {
        cellPadding: 2,
        fontSize: 7,
        valign: 'middle',
        overflow: 'linebreak',
        tableWidth: 'auto',
        lineWidth: 0,
      }
    })
    this.doc.autoTable({
      html: '#table2', startY: 300, margin: { top: 380, right: 60, bottom: 100 },
      styles: {
        cellPadding: 2,
        fontSize: 7,
        valign: 'middle',
        overflow: 'linebreak',
        tableWidth: 'auto',
        lineWidth: 0,
      }
    })
    this.doc.save("Informae_final.pdf");
    // location.reload();
  }


}
