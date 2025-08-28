import browser from "webextension-polyfill";
import { addEntry } from "../lib/db";
import { extractReadable } from "../content/extractor";

// save active tab → inject extractor → persist
async function saveActiveTab() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { ok: false, error: "no-tab" };

  const [{ result }] = await browser.scripting.executeScript({
    target: { tabId: tab.id },
    func: extractReadable
  });

  const id = await addEntry(result);
  browser.notifications.create({
    type: "basic",
    iconUrl: browser.runtime.getURL("icons/icon48.png"),
    title: "Saved",
    message: result.title
  });
  return { ok: true, id };
}

browser.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "SAVE_ACTIVE_TAB") return saveActiveTab();
});

export {}; // keep module scope
