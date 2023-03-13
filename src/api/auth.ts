import { v4 as uuid } from "uuid";

const LOCALSTORAGE_KEY = "car.authKey";

let authKey: string | null = null;

export function getAuthKey() {
    if (!authKey) {
        authKey = localStorage.getItem(LOCALSTORAGE_KEY);
    }
    return authKey;
}

export function hasAuthKey() {
    return getAuthKey() != null;
}

export function createAuthKey() {
    const key = uuid();
    setAuthKey(key);
    return key;
}

export function getOrCreateAuthKey() {
    const key = getAuthKey()
    if (key) {
        return key;
    }
    return createAuthKey();
}

export function setAuthKey(key: string) {
    authKey = key;
    localStorage.setItem(LOCALSTORAGE_KEY, authKey);
}