const DB_NAME = "meeting-ai";
const STORE_NAME = "models";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function hasModel() {
  const db = await openDB();

  return new Promise<boolean>((resolve) => {
    const tx = db.transaction(
      STORE_NAME,
      "readonly"
    );

    const store = tx.objectStore(STORE_NAME);

    const req = store.get("whisper-model");

    req.onsuccess = () => {
      resolve(!!req.result);
    };

    req.onerror = () => {
      resolve(false);
    };
  });
}

export async function saveModel(
  model: Blob
) {
  const db = await openDB();

  return new Promise<void>((resolve) => {
    const tx = db.transaction(
      STORE_NAME,
      "readwrite"
    );

    tx.objectStore(STORE_NAME)
      .put(model, "whisper-model");

    tx.oncomplete = () => resolve();
  });
}

export async function getModelSize() {
  const db = await openDB();

  return new Promise<number>((resolve) => {
    const tx = db.transaction(
      STORE_NAME,
      "readonly"
    );

    const store =
      tx.objectStore(STORE_NAME);

    const req =
      store.get("whisper-model");

    req.onsuccess = () => {
      const blob =
        req.result as Blob;

      resolve(blob?.size ?? 0);
    };

    req.onerror = () => {
      resolve(0);
    };
  });
}
export async function getModel() {
  const db = await openDB();

  return new Promise<Blob | null>((resolve) => {
    const tx = db.transaction(
      STORE_NAME,
      "readonly"
    );

    const store =
      tx.objectStore(STORE_NAME);

    const req =
      store.get("whisper-model");

    req.onsuccess = () => {
      resolve(req.result ?? null);
    };

    req.onerror = () => {
      resolve(null);
    };
  });
}  
