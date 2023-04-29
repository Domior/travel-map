export class SessionStorageService {
  static setItem(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static getItem(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  static removeItem(key) {
    sessionStorage.removeItem(key);
  }

  static clear() {
    sessionStorage.clear();
  }
}
