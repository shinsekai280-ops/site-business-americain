"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { createUploadUrls, registerFiles } from "@/app/admin/actions";

const BUCKET = "deliverables";

export function Uploader({ orderId, kind, label }: { orderId: string; kind: "concept" | "final"; label: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [notify, setNotify] = useState(true);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function upload() {
    if (!files.length) return;
    setState("uploading");
    setMessage("");
    try {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const slots = await createUploadUrls(orderId, kind, files.map((f) => ({ name: f.name })));
      for (let i = 0; i < files.length; i++) {
        const { error } = await supabase.storage.from(BUCKET).uploadToSignedUrl(slots[i].path, slots[i].token, files[i], { contentType: files[i].type || undefined });
        if (error) throw error;
      }
      await registerFiles(
        orderId,
        kind,
        files.map((f, i) => ({ path: slots[i].path, name: f.name, mime: f.type })),
        notify
      );
      setFiles([]);
      setState("done");
      setMessage(notify ? "Uploaded. The client has been notified by email." : "Uploaded.");
    } catch (e) {
      setState("error");
      setMessage(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <div className="rounded-[22px] border border-dashed border-ink/20 bg-paper p-5">
      <p className="text-[15px] font-medium">{label}</p>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        className="mt-3 block w-full text-[14px] file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-white"
      />
      <label className="mt-4 flex items-center gap-2 text-[14px] text-ink/80">
        <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4 accent-ink" />
        Email the client when the upload is done
      </label>
      <button
        onClick={upload}
        disabled={!files.length || state === "uploading"}
        className="mt-4 rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white shadow-pill disabled:opacity-40"
      >
        {state === "uploading" ? "Uploading…" : `Upload ${files.length || ""} file${files.length > 1 ? "s" : ""}`}
      </button>
      {message && <p className={`mt-3 text-[14px] ${state === "error" ? "text-red-600" : "text-leaf"}`}>{message}</p>}
    </div>
  );
}
