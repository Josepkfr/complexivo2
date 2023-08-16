import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';
import { PortafoliosModels } from 'src/app/models/portafolio/portafolio.models';
import { CustomFile } from 'src/app/models/portafolio/files/custom-file.interface';
import { DocumentoModels } from 'src/app/models/portafolio/documentos/documento.models';
import { ProyectoParticipanteModels } from 'src/app/models/proyecto/ProjectParticipant/proyecto-participante.moduls';
import { DocumentoHttpService } from 'src/app/service/portafolio/documento/documento-http.service';
import { FileHttpService } from 'src/app/service/portafolio/files/file-http.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthHttpService } from 'src/app/service/auth/auth-http.service';
import { UserAuth } from 'src/app/models/auth/user.interface';

@Component({
  selector: 'app-portafolio-form',
  templateUrl: './portafolio-form.component.html',
  styleUrls: ['./portafolio-form.component.css']
})
export class PortafolioFormComponent implements OnInit, OnDestroy {
  selectedDocumento?: DocumentoModels;
  public briefcaseForm: FormGroup;
  currentPortafolio = {} as PortafoliosModels;
  loading = true;
  selectedFiles: File[] = [];
  documentos: DocumentoModels[] = [];
  project: ProyectoParticipanteModels;
  title = 'Portafolio';
  files: CustomFile[] = [];
  dateFile= new Date();
  info:PortafoliosModels;
  fileStates: { [key: string]: { state: boolean; observation: string } } = {};

  paramsSubscription: Subscription;
  idPortafolio:number;
  filesArray: any;
  customFiles: { document_id: number; file: CustomFile; stateControl: FormControl; observationControl: FormControl }[] = [];
  user: UserAuth;

  constructor(
    private formBuilder: FormBuilder,
    private portafolioHttpService: PortafolioHttpService,
    private documentosHtppService: DocumentoHttpService,
    private fileHttpService: FileHttpService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public authHttpService: AuthHttpService,
  ) {
    this.initForm();
    this.filesArray = this.formBuilder.array([]);
    this.briefcaseForm.addControl('files', this.filesArray);
  }

  ngOnInit(): void {
    this.getDocumentos();
    this.getCurrentUser();
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.title = 'Portafolio';
        this.getBriefcaseId(params['id']);
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }

  initForm(): void {
    this.briefcaseForm = this.formBuilder.group({
      id: [0],
      files: this.formBuilder.array([]),

      created_by: this.formBuilder.group({
        id: [0],
        email: [''],
        person: this.formBuilder.group({
          names: [''],
          identification: [''],
          last_names: [''],
        })
      }),
      project_participant_id: this.formBuilder.group({
        id:[0],
        project_id: this.formBuilder.group({
          id:[0],
          name:[''],
          career_id:  this.formBuilder.group({
            id:[0],
            name:[''],
          }),
          beneficiary_institution_id: this.formBuilder.group({
            id:[0],
            name:['']
          })
        }),
      }),
      observations: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        },
      ],
      state: [
        'false'
      ],
    });

    this.briefcaseForm.valueChanges.subscribe((values) => {
      this.currentPortafolio = values;
    });
  }

  getBriefcaseId(id:number){
    this.portafolioHttpService.getBriefcaseById(id).subscribe((response:any) =>{
      if(response.status === 'success'){
        this.info = response.data.briefcases;
        this.briefcaseForm.patchValue(this.info);
      }
    })
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.briefcaseForm.valid) {
      this.createBriefcase();
    }
  }

  getDocumentos(): void {
    this.loading = true;
    this.authHttpService.getUser().subscribe((user: UserAuth) => {
      this.user = user;
      if (this.user.role === 'Estudiante') {
        this.documentosHtppService.getDocumentsByResponsibleStudent().subscribe((res: any) => {
          if (res.status === 'success') {
            this.documentos = res.data.documents;
          }
          this.loading = false;
        });
      } else {
        this.documentosHtppService.getDocuments().subscribe((res: any) => {
          if (res.status === 'success') {
            this.documentos = res.data.documents;
          }
          this.loading = false;
        });
      }
    });
  }




  createBriefcase(): void {
    if (this.briefcaseForm.valid) {
      const postData = {
        ...this.currentPortafolio,
      };

      this.portafolioHttpService.addPortafolios(postData).subscribe((response: any) => {
        if(response.status === 'success') {
          const id = response.data.briefcase.id;
          this.uploadFiles(id);
        }
      });
    }
  }



  // Función para actualizar la observación en CustomFile
  onObservationChange(observation: string, index: number): void {
    this.files[index].observation = observation;
  }

  // Función para actualizar el estado en CustomFile
  onStateChange(state: boolean, index: number): void {
    this.files[index].state = state;
  }

  // ... Otras funciones ...

  // Función para subir los archivos y guardar observaciones y estados
  uploadFiles(idPortafolio: number): void {
    if (this.selectedDocumento) {
      // Agregar observaciones y estados a cada archivo
      const filesWithInfo = this.files.map(file => ({
        ...file,
        observation: file.observation,
        state: file.state,
      }));
      this.portafolioHttpService.uploadFiles(filesWithInfo, idPortafolio);
    }
  }

  onFileSelected(event: any, documento: DocumentoModels): void {
    this.selectedDocumento = documento;
    const selectedFiles: FileList = event.target.files;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file: File = selectedFiles[i];
      const customFile: CustomFile = {
        file: file,
        document_id: documento.id,
        created_at: new Date(),
        state: true,
        observation: '', // Initialize with an empty observation
      }
      this.files.push(customFile);
    }
    this.updateSelectedFilesList();
  }



  updateSelectedFilesList(): void {
    this.cdr.detectChanges();
  }


  downloadFile(portafolioId: number, documentoId: number, fileId: number, fileName: string) {
    this.fileHttpService.downloadFile(portafolioId, documentoId, fileId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  getCurrentUser() {
    this.authHttpService.getUser().subscribe((user: UserAuth) => (this.user = user));
    console.log(this.user)
  }

}
