import { describe, it, expect, beforeAll } from "vitest";
import "fake-indexeddb/auto";
import { addEntry, listItems, getContentByItemId, removeById } from "../src/lib/db";

describe("db basic flow", () => {
  let id: number;
  beforeAll(async () => {
    id = await addEntry({
      url: "https://ex.com",
      title: "Example",
      html: "<p>hello</p>",
      text: "hello"
    });
  });

  it("lists items", async () => {
    const list = await listItems();
    expect(list.length).toBeGreaterThan(0);
  });

  it("fetches content by item id", async () => {
    const c = await getContentByItemId(id);
    expect(c?.text).toBe("hello");
  });

  it("deletes item and content", async () => {
    await removeById(id);
    const list = await listItems();
    expect(list.find(x => x.id === id)).toBeUndefined();
  });
});
