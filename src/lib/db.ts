import Dexie, { type Table } from "dexie";
import type { Item, Content } from "./types";

class RLDB extends Dexie {
  items!: Table<Item, number>;
  contents!: Table<Content, number>;
  constructor() {
    super("offline-readlater");
    this.version(1).stores({
      items: "++id, url, title, addedAt",
      contents: "++id, itemId"
    });
  }
}

export const db = new RLDB();

export async function addEntry(data: {
  url: string; title: string; html: string; text: string;
}) {
  const itemId = await db.items.add({
    url: data.url, title: data.title || data.url, addedAt: Date.now()
  });
  await db.contents.add({ itemId, html: data.html, text: data.text });
  return itemId;
}

export async function listItems(limit = 100) {
  return db.items.orderBy("addedAt").reverse().limit(limit).toArray();
}

export async function getContentByItemId(itemId: number) {
  return db.contents.where("itemId").equals(itemId).first();
}

export async function removeById(itemId: number) {
  await db.contents.where("itemId").equals(itemId).delete();
  await db.items.delete(itemId);
}
