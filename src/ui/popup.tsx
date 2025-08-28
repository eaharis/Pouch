import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import browser from "webextension-polyfill";
import { db, listItems, removeById } from "../lib/db";
import type { Item } from "../lib/types";

function Popup() {
  const [items, setItems] = useState<Item[]>([]);
  const refresh = async () => setItems(await listItems(200));

  useEffect(() => { refresh(); }, []);

  const save = async () => {
    await browser.runtime.sendMessage({ type: "SAVE_ACTIVE_TAB" });
    await refresh();
  };

  const open = (id: number) => {
    const url = browser.runtime.getURL(`reader.html?id=${id}`);
    browser.tabs.create({ url });
  };

  const del = async (id: number) => { await removeById(id); await refresh(); };

  return (
    <div style="width:360px;padding:10px;font-family:system-ui,sans-serif">
      <button onClick={save}>Save current tab</button>
      <hr/>
      <ul style="list-style:none;padding:0;margin:0;max-height:420px;overflow:auto">
        {items.map(it => (
          <li key={it.id} style="margin:6px 0">
            <div style="font-weight:600; cursor:pointer" onClick={() => open(it.id!)}>{it.title}</div>
            <div style="font-size:12px; color:#666">{new URL(it.url).hostname}</div>
            <div style="font-size:12px">
              <button onClick={() => del(it.id!)}>Delete</button>
            </div>
          </li>
        ))}
        {items.length === 0 && <div>No items yet.</div>}
      </ul>
    </div>
  );
}

render(<Popup />, document.getElementById("app")!);
