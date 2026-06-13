"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Bell, Camera, Minus, Plus, Save, Trash2 } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  FOOD: "🍪",
  CLOTHING: "👕",
  ACCESSORIES: "⌚",
  OTHER: "📦",
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("food");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [productCategory, setProductCategory] = useState("OTHER");
  const [notFound, setNotFound] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("product_listings")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setProductName(data.title);
          setCategory(data.category.toLowerCase());
          setProductCategory(data.category);
          setPrice(data.price.toFixed(2));
          setQuantity(data.quantity ?? 1);
          setDescription(data.description ?? "");
          setExistingImages(data.images ?? []);
          if (data.images?.[0]) {
            setImagePreview(data.images[0]);
          }
        }
        setLoading(false);
      });
  }, [params.id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let images = existingImages;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);
      if (uploadError) {
        alert("Failed to upload image: " + uploadError.message);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);
      images = [urlData.publicUrl];
    }

    const payload = {
      title: productName,
      category: category.toUpperCase(),
      price: parseFloat(price),
      quantity,
      description,
      images,
    };

    const { error } = await supabase
      .from("product_listings")
      .update(payload)
      .eq("id", params.id);

    setSaving(false);
    if (error) {
      console.error("Save error:", error);
      alert("Failed to save: " + error.message);
    } else {
      window.location.href = "/dashboard";
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const { error } = await supabase
      .from("product_listings")
      .delete()
      .eq("id", params.id);
    if (error) {
      alert("Failed to delete. Please try again.");
    } else {
      window.location.href = "/dashboard/products";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9] items-center justify-center">
        <p className="text-[#44474e]">Loading...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-[#44474e] mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[#002147] text-white font-bold text-sm hover:opacity-90 transition-all"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
      <header className="bg-white sticky top-0 w-full z-50 shadow-sm">
        <div className="flex justify-between items-center px-4 h-16">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="active:scale-95 transition-transform p-2 hover:bg-[#f3f3f4] rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-[#000a1e]" />
            </button>
            <h1 className="font-headline text-headline-sm text-[#000a1e]">
              Edit Product
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <button className="text-[#000a1e] p-2 hover:bg-[#f3f3f4] rounded-full">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto w-full">
        <form className="space-y-6" onSubmit={handleSave}>
          <section className="space-y-2">
            <label className="font-label text-label-md text-on-surface-variant uppercase">
              Product Media
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video w-full rounded-lg bg-[#e8e8e8] overflow-hidden shadow-card group cursor-pointer border-2 border-dashed border-[#c4c6cf] hover:border-[#000a1e] transition-all"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  {CATEGORY_ICONS[productCategory] || "📦"}
                </div>
              )}
              <div className="absolute inset-0 bg-[#000a1e]/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <Camera className="text-white text-4xl mb-1" />
                <p className="text-white font-bold text-sm">
                  {imagePreview ? "Change Image" : "Update Image"}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant italic">
              Recommended size: 1200 x 675 pixels
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-card border border-[#eeeeee]">
            <div className="md:col-span-2 space-y-1">
              <label
                className="font-label text-label-md text-on-surface-variant"
                htmlFor="product_name"
              >
                Product Name
              </label>
              <input
                id="product_name"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full bg-white border border-[#c4c6cf] focus:border-[#000a1e] focus:ring-1 focus:ring-[#000a1e] rounded-lg px-4 py-3 transition-all font-body text-body-md"
              />
            </div>

            <div className="space-y-1">
              <label
                className="font-label text-label-md text-on-surface-variant"
                htmlFor="category"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setProductCategory(e.target.value.toUpperCase());
                }}
                className="w-full bg-white border border-[#c4c6cf] focus:border-[#000a1e] focus:ring-1 focus:ring-[#000a1e] rounded-lg px-4 py-3 transition-all font-body text-body-md appearance-none"
              >
                <option value="food">Food</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label
                className="font-label text-label-md text-on-surface-variant"
                htmlFor="price"
              >
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">
                  RM
                </span>
                <input
                  id="price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full bg-white border border-[#c4c6cf] focus:border-[#000a1e] focus:ring-1 focus:ring-[#000a1e] rounded-lg pl-12 pr-4 py-3 transition-all font-body text-body-md font-bold text-[#715000]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                className="font-label text-label-md text-on-surface-variant"
                htmlFor="quantity"
              >
                Quantity (Stock)
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-[#eeeeee] border border-[#c4c6cf] rounded-lg active:scale-90 transition-transform"
                >
                  <Minus className="w-5 h-5 text-[#1a1c1c]" />
                </button>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="flex-1 bg-white border border-[#c4c6cf] focus:border-[#000a1e] focus:ring-1 focus:ring-[#000a1e] rounded-lg px-4 py-3 text-center font-body text-body-md"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-[#eeeeee] border border-[#c4c6cf] rounded-lg active:scale-90 transition-transform"
                >
                  <Plus className="w-5 h-5 text-[#1a1c1c]" />
                </button>
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label
                className="font-label text-label-md text-on-surface-variant"
                htmlFor="description"
              >
                Product Description
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-[#c4c6cf] focus:border-[#000a1e] focus:ring-1 focus:ring-[#000a1e] rounded-lg px-4 py-3 transition-all font-body text-body-md resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#fdc34d] text-[#715000] font-headline text-headline-sm py-4 rounded-lg shadow-card active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full bg-transparent border-2 border-[#000a1e] text-[#000a1e] font-bold py-3 rounded-lg active:scale-95 transition-transform"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full bg-transparent border-2 border-[#ba1a1a] text-[#ba1a1a] font-bold py-3 rounded-lg hover:bg-[#ffdad6]/20 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete Listing
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
