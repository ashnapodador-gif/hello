import CrudManager from "@/components/CrudManager";
export default function Page() {
  return (
    <CrudManager
      table="announcements" label="Announcements"
      orderBy={{ column: "created_at", ascending: false }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "body", label: "Message", type: "textarea" },
        { name: "active", label: "Show on website", type: "checkbox", default: true }
      ]}
    />
  );
}
