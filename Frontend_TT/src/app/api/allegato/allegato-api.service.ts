import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiServiceService } from 'src/app/services/api/api-service.service';
import { AllegatoPUTRequest } from 'src/app/interfaces/api/allegato/allegato-request-interface';
import { AllegatoTipologiaResponse } from 'src/app/interfaces/api/allegato/allegato-response-interface';
import { Allegato } from 'src/app/interfaces/primitive/allegato-interface';
import { Tipologia } from 'src/app/interfaces/primitive/tipologia-interface';

import { Directory, Filesystem, Encoding } from '@capacitor/filesystem'
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class AllegatoApiService {

  url = "";

  constructor(private http: HttpClient, private ApiService: ApiServiceService, private platform: Platform) {
    this.url = this.ApiService.url;
  }


  // Modifica nome e/o nota di un allegato relativo ad una tesi.
  modificaAllegatoTesi(id: number, nome: string, idTipologia: number, nota: string): Observable<Allegato> {
    const url = this.url + "/tesi/allegati";
    const req: AllegatoPUTRequest = {
      id,
      nome,
      idTipologia,
      nota
    }
    return this.http.put<Allegato>(url, req);
  }

  // Elimina un allegato relativo ad una tesi.
  eliminaAllegatoTesi(id: number): Observable<any> {
    const url = this.url + `/tesi/allegati/${id}`
    return this.http.delete(url);
  }

  // Modifica nome e/o nota di un allegato relativo ad un tirocinio.
  modificaAllegatoTirocinio(id: number, nome: string, idTipologia: number, nota: string): Observable<any> {
    const url = this.url + "/tirocinio/allegati";
    const req: AllegatoPUTRequest = {
      id,
      nome,
      idTipologia,
      nota
    }
    return this.http.put(url, req);
  }

  // Elimina un allegato relativo ad un tirocinio.
  eliminaAllegatoTirocinio(id: number): Observable<any> {
    const url = this.url + `/tirocinio/allegati/${id}`
    return this.http.delete(url);
  }

  // Restituisce le tipologie di allegati associabili ad un allegato relativo ad una tesi.
  getTipologieAllegatiTesi(): Observable<Tipologia[]> {
    const url = this.url + "/tesi/allegati/tipologie";
    return this.http.get<Tipologia[]>(url);
  }

  // Restituisce le tipologie di allegati associabili ad un allegato relativo ad un tirocinio.
  getTipologieAllegatiTirocinio(): Observable<Tipologia[]> {
    const url = this.url + "/tirocinio/allegati/tipologie";
    return this.http.get<Tipologia[]>(url);
  }

  // Restituisce le informazioni di un allegato relativo ad una tesi.
  getAllegatoTesi(id: number): Observable<Allegato> {
    const url = this.url + `/tesi/allegati/${id}`;
    return this.http.get<Allegato>(url);
  }

  // Restituisce le informazioni di un allegato relativo ad un tirocinio.
  getAllegatoTirocinio(id: number): Observable<Allegato> {
    const url = this.url + `/tirocinio/allegati/${id}`;
    return this.http.get<Allegato>(url);
  }

  // Scarica il file relativo ad un allegato della tesi.
  scaricaAllegatoTesi(id: number): Observable<{ filename: string, data: Blob }> {
    const url = this.url + `/tesi/allegati/scarica/${id}`;
  
    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('Content-Disposition') || '';
        let filename = `file_${id}`;
  
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=(['"]?)([^'";\n]+)\1/.exec(contentDisposition);
          if (matches && matches[2]) {
            filename = matches[2];
          } 
        } 
        return { filename, data: response.body as Blob };
      })
    );
  }
  
  

  // Scarica il file relativo ad un allegato del tirocinio.
  scaricaAllegatoTirocinio(id: number): Observable<{ filename: string, data: Blob }> {
    const url = this.url + `/tirocinio/allegati/scarica/${id}`;

    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('Content-Disposition') || '';
        let filename = `file_${id}`;
  
        if (contentDisposition) {
          const matches = /filename[^;=\n]*=(['"]?)([^'";\n]+)\1/.exec(contentDisposition);
          if (matches && matches[2]) {
            filename = matches[2];
          } else { }
        } else { }
  
        return { filename, data: response.body as Blob };
      })
    );
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  private getFileMimeType(filePath: string): string {
    const ext = filePath.split('.').pop();
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }
  
  async scaricaEApriFile(blob: Blob, fileName: string) {
    
    try {
      const base64Data = await this.convertBlobToBase64(blob) as string;

      if (fileName !== null && fileName !== undefined) {

        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents
        });

        const fileUri = await Filesystem.getUri({
          directory: Directory.Documents,
          path: fileName
        });

        const finalPath = Capacitor.convertFileSrc(fileUri.uri);
        console.log(finalPath)


        const fileOpenerOptions: FileOpenerOptions = {
          filePath: fileUri.uri,
          contentType: this.getFileMimeType(fileUri.uri),
          openWithDefault: true,
        };

        if (this.platform.is('ios') || this.platform.is('android')) {
          console.log('Attempting to open file:', fileUri.uri);
          await FileOpener.open(fileOpenerOptions)
            .then(() => console.log('File is opened'))
            .catch(e => {
              console.log('Error opening file', e);
              if (e.code === 'UNIMPLEMENTED') {
                console.log('The functionality is not implemented on this platform.');
              }
            });
        } else {
          console.log('Opening file in new tab:', finalPath);
          window.open(finalPath, '_blank');
        }
      }
    } catch (error) {
      console.error('Error downloading or opening the file', error);
    }
  }
}
