
class LocalStorageUtil {
    setItem(key: string, val: any) {
        var storage = window.localStorage;
        if (typeof val === 'string' || typeof val === 'number') {
            storage.setItem(key, val as string);
        } else if (typeof val === 'object') {
            storage.setItem(key, JSON.stringify(val));
        }
    }

    getItem(key: string) {
        var storage = window.localStorage;
        let val = storage.getItem(key);
        if (val == null) {
            return undefined
        }
        return val;
    }

    removeItem(key: string) {
        var storage = window.localStorage;
        storage.removeItem(key)
    }
}

export default new LocalStorageUtil();