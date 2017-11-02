import { Http, Response, ResponseContentType, } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

export class DownloadHelper {
  public static downloadFileFromResponse(response: Observable<Response>, onComplete: Function = null): Subscription {
    const sub = response.subscribe(data => {
      const blob = new Blob([(<any>data)._body], { type: data.headers.get('content-type') });
      let fileName = data.headers.get('content-disposition').split(';')[1].trim().split('=')[1];
      fileName = this.removeExtraQuotes(fileName);

      if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0
        || navigator.userAgent.indexOf('Edge') !== -1) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        if (onComplete) {
          onComplete();
        }
      }
    });
    return sub;
  }

  public static downloadFileFromUrl(url: string) {
    window.open(url, '_self');
    // Old approach is not working with IE
    // const link = document.createElement('a');
    // link.href = url;
    // link.click();
  }

  // if we have a fileName with extra quotes Ex: '"myFile.jpg"' -> 'myFile.jpg';
  private static removeExtraQuotes(fileName: string): string {
    if (fileName.length > 1 && fileName[0] === `"` && fileName[fileName.length - 1] === `"`) {
      return `${fileName.slice(1, fileName.length - 1)}`;
    }

    return fileName;
  }
}
