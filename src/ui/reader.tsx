import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import { getContentByItemId, db } from "../lib/db";

function useQueryId(): number | null {
  const p = new URLSearchParams(location.search);
  const s = p.get("id");
  return s ? Number(s) : null;
}

function Reader() {
  const id = useQueryId();
  const [title, setTitle] = useState<string>("");
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (id == null) return;
      const item = await db.items.get(id);
      const content = await getContentByItemId(id);
      setTitle(item?.title || "");
      setHtml(content?.html || "<p>No content.</p>");
    })();
  }, [id]);

  return (
    <div style="max-width:740px;margin:24px auto;padding:0 16px;font-family:system-ui,sans-serif;line-height:1.6">
      <h1>{title}</h1>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

render(<Reader />, document.getElementById("app")!);
