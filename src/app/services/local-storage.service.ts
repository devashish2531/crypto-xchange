import { Injectable } from '@angular/core';

const prefix = 'cryptoxchange';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  // Get a string value from local storage by key
  getItem(key: string): string | null {
    const mappedKey = this.prefixedKey(key);
    return localStorage.getItem(mappedKey);
  }

  // Set a string value in local storage
  setItem(key: string, value: string): void {
    const mappedKey = this.prefixedKey(key);
    localStorage.setItem(mappedKey, value);
  }

  // Remove an item from local storage by key
  removeItem(key: string): void {
    const mappedKey = this.prefixedKey(key);
    localStorage.removeItem(mappedKey);
  }

  // Clear all local storage
  clear(): void {
    localStorage.clear();
  }

  // Prefix key
  private prefixedKey(key: string): string {
    return `${prefix}-${key}`;
  }
}
