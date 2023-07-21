import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  public getItem(key: string): any {
    if (navigator.cookieEnabled) {
      return sessionStorage.getItem(key);
    }
    return null;
  }

  public setItem(key: string, data: string): void {
    if (navigator.cookieEnabled) {
      sessionStorage.setItem(key, data);
    }
  }

  public removeItem(key: string): void {
    if (navigator.cookieEnabled) {
      sessionStorage.removeItem(key);
    }
  }

  public clearStorage(session = false): void {
    if (navigator.cookieEnabled) {
      sessionStorage.clear();
    }
  }

  public setObject(storageItemName: string, object: object): void {
    if (navigator.cookieEnabled) {
      sessionStorage.setItem(storageItemName, JSON.stringify(object));
    }
  }

  public getObject(storageItemName: string): any {
    if (navigator.cookieEnabled) {
      const result = JSON.parse(sessionStorage.getItem(storageItemName) ?? '[]');
      return result;
    }
    return undefined;
  }

  public mutateObject(storageItemName: string, key: string, value: any): void {
    if (navigator.cookieEnabled) {
      const savedObject: { [key: string]: any } = JSON.parse(sessionStorage.getItem(storageItemName) ?? '{}');
      savedObject[key] = value;
      sessionStorage.setItem(storageItemName, JSON.stringify(savedObject));
    }
  }

  public getFromObject(storageItemName: string, key: string): any {
    if (navigator.cookieEnabled) {
      const result = JSON.parse(sessionStorage.getItem(storageItemName) ?? '[]');
      return result[key];
    }
    return undefined;
  }
}
