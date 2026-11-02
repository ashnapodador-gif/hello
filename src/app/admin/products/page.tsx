import CrudManager from "@/components/CrudManager";
export default function Page() {
  return (
    <CrudManager
      table="products" label="Products"
      fields={[
        { name: "name", label: "Product Name", type: "text", required: true },
        { name: "category", label: "Category", type: "text", default: "General" },
        { name: "price", label: "Price (editable text)", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image_url", label: "Product Image", type: "image" },
        { name: "featured", label: "Featured on Home", type: "checkbox", default: true },
        { name: "in_stock", label: "In Stock", type: "checkbox", default: true },
        { name: "sort_order", label: "Sort Order", type: "number", default: 0 }
      ]}
    />
  );
}
