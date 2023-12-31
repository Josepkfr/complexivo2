import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Role } from 'src/app/models/auth/role/rol';
import { DocumentoModels } from 'src/app/models/portafolio/documentos/documento.models';
import { DocumentoHttpService } from 'src/app/service/portafolio/documento/documento-http.service';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';

@Component({
  selector: 'app-configuracion-archived',
  templateUrl: './configuracion-archived.component.html',
  styleUrls: ['./configuracion-archived.component.css']
})
export class ConfiguracionArchivedComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  documentos: DocumentoModels[] = [];

  loading: boolean = true;

  constructor(
    private documentoHttpService: DocumentoHttpService,
      private router: Router,
      private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getArchivedDocument();
  }

  getArchivedDocument(): void {
    this.loading = true;
    this.documentoHttpService.getArchivedDocument().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortDocuments();
      }
      this.loading = false;
    });
  }

  searchArchivedDocumentByTerm(term: string): void {
    this.loading = true;
    this.documentoHttpService.searchArchivedDocumentByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
        this.reverse = false;
      }
      this.loading = false;
    });
  }

  reversOrder(): void {
    this.documentos.reverse();
    this.reverse = !this.reverse;
  }

  sortDocuments(): void {
    this.documentos.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }

  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.documentos = res.data.documents;
      this.reverse = false;
    }
    this.loading = false;
  }

  getRoleFromDocumento(documento: DocumentoModels): Role | undefined {
    return typeof documento.responsible_id === 'number' ? this.getRoleById(documento.responsible_id) : documento.responsible_id;
  }
  getRoleById(responsible_id: number): Role | undefined {
    throw new Error('Method not implemented.');
  }


  restaureDocumento(documento: DocumentoModels): void {
    this.documentoHttpService.restoreDocument(documento.id)
        .pipe(
            finalize(() => {
              this.router.navigate(['/system/portafolio/configuracion']);
            })
        )
        .subscribe((res: any) => {
          if (res.status === 'success') {
            this.handleSearchResponse(res);
          }
        });
  }


  openDialogRestaurarDocumento(documento: DocumentoModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de restaurar este documento?',
        message:
          'El documento sera restaura y podrá ser utilizado por los usuarios.',
        dato:['Nombre:', documento.name],
        button: 'Restaurar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restaureDocumento(documento);
      }
    });
  }

  deleteDocument(documento: DocumentoModels): void {
    this.documentoHttpService.deleteDocument(documento.id)
        .pipe(
            finalize(() => {
              this.router.navigate(['/system/portafolio/configuracion']);
            })
        )
        .subscribe((res: any) => {
          if (res.status === 'success') {
            this.handleSearchResponse(res);
          }
        });
  }



  openDialogDeleteDocument(documento: DocumentoModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿ Está seguro de eliminar este documento ?',
        message:
          'El documento sera eliminada del sistema.',
        button: 'eliminar definitivamente',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDocument(documento);
      }
    });
  }

}
