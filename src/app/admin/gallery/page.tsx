import CrudManager from "@/components/CrudManager";
export default function Page() {
  return (
    <CrudManager
      table="gallery_images" label="Gallery"
      fields={[
        { name: "title", label: "Photo Title", type: "text", required: true },
        { name: "category", label: "Category (Interior / Exterior / Promotional)", type: "text", default: "Store" },
        { name: "image_url", label: "Photo (upload)", type: "image", required: true },
        { name: "sort_order", label: "Sort Order", type: "number", default: 0 }
      ]}
    />
  );
}
