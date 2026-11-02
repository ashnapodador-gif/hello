import CrudManager from "@/components/CrudManager";
export default function Page() {
  return (
    <CrudManager
      table="services" label="Services"
      fields={[
        { name: "name", label: "Service Name", type: "text", required: true },
        { name: "category", label: "Category", type: "text", default: "General" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image_url", label: "Service Image", type: "image" },
        { name: "featured", label: "Featured", type: "checkbox" },
        { name: "sort_order", label: "Sort Order", type: "number", default: 0 }
      ]}
    />
  );
}
