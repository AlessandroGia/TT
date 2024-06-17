import { Injectable } from '@angular/core';
import { Directory, Filesystem, Encoding } from '@capacitor/filesystem'
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  constructor(private platform: Platform) { }


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
