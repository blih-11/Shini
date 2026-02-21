import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'shini2024'; // Change this to your password
const CATEGORIES = ['jeans', 'tops', 'shirts', 'outerwear', 'bottoms', 'accessories', 'new-arrivals'];
const SIZES_CLOTHING = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SIZES_JEANS = ['28', '30', '32', '34', '36', '38'];
const SIZES_ONE_SIZE = ['One Size'];
const BUCKET = 'product-images';

// ─── EMPTY PRODUCT TEMPLATE ───────────────────────────────────────────────────
const emptyProduct = {
  name: '',
  category: [],
  price: '',
  original_price: '',
  description: '',
  sizes: [],
  colors: '',
  tags: '',
  in_stock: true,
  is_new: false,
  is_sale: false,
  rating: 4.5,
  reviews: 0,
  image: '',
  images: [],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Badge({ label, color = 'gray' }) {
  const colors = {
    red: 'bg-red-100 text-red-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[color]}`}>{label}</span>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#222223] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#222223]">SHiNi</h1>
          <p className="text-gray-500 mt-1 text-sm">Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(''); }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D] mb-3"
            placeholder="Enter admin password"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#B62A2D] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-800 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── IMAGE UPLOADER ───────────────────────────────────────────────────────────
function ImageUploader({ currentImage, onUploaded, label = 'Main Image' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const fileRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    const ext = file.name.split('.').pop();
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      alert('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-[#B62A2D] transition"
        style={{ height: 140 }}
        onClick={() => fileRef.current.click()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-1">
            <span className="text-3xl">📷</span>
            <span>Click to upload</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
            Uploading…
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ─── MULTI IMAGE UPLOADER ─────────────────────────────────────────────────────
function MultiImageUploader({ currentImages = [], onUpdated }) {
  const [images, setImages] = useState(currentImages);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const uploaded = [];

    for (const file of files) {
      const ext = file.name.split('.').pop();
      const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(filename, file, { upsert: false });
      if (!error) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
        uploaded.push(data.publicUrl);
      }
    }

    const updated = [...images, ...uploaded];
    setImages(updated);
    onUpdated(updated);
    setUploading(false);
  };

  const removeImage = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    onUpdated(updated);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Additional Images</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >×</button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-[#B62A2D] hover:text-[#B62A2D] transition text-2xl"
        >
          {uploading ? '…' : '+'}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
    </div>
  );
}

// ─── PRODUCT FORM ─────────────────────────────────────────────────────────────
function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({ ...emptyProduct, ...product });
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleCategory = (cat) => {
    const cats = form.category.includes(cat)
      ? form.category.filter((c) => c !== cat)
      : [...form.category, cat];
    set('category', cats);
  };

  const setSizePreset = (preset) => {
    const map = { clothing: SIZES_CLOTHING, jeans: SIZES_JEANS, onesize: SIZES_ONE_SIZE };
    set('sizes', map[preset] || []);
  };

  const toggleSize = (s) => {
    const sizes = form.sizes.includes(s)
      ? form.sizes.filter((x) => x !== s)
      : [...form.sizes, s];
    set('sizes', sizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert('Name and price are required.');
    setSaving(true);

    const payload = {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      description: form.description,
      sizes: form.sizes,
      colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      in_stock: form.in_stock,
      is_new: form.is_new,
      is_sale: form.is_sale,
      rating: parseFloat(form.rating) || 4.5,
      reviews: parseInt(form.reviews) || 0,
      image: form.image,
      images: form.images,
    };

    let error;
    if (form.id) {
      ({ error } = await supabase.from('products').update(payload).eq('id', form.id));
    } else {
      ({ error } = await supabase.from('products').insert(payload));
    }

    setSaving(false);
    if (error) return alert('Save failed: ' + error.message);
    onSave();
  };

  const allSizes = [...new Set([...SIZES_CLOTHING, ...SIZES_JEANS, ...SIZES_ONE_SIZE])];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Product Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D]"
            placeholder="e.g. Paint Splash Straight Jeans"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Price (£) *</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D]"
            placeholder="84.99"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Original Price (£) — sale only</label>
          <input
            type="number"
            step="0.01"
            value={form.original_price}
            onChange={(e) => set('original_price', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D]"
            placeholder="109.99"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D] resize-none"
          placeholder="Describe the product..."
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Categories</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                form.category.includes(cat)
                  ? 'bg-[#B62A2D] text-white border-[#B62A2D]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[#B62A2D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Sizes</label>
          <div className="flex gap-2">
            {['clothing', 'jeans', 'onesize'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSizePreset(p)}
                className="text-xs text-[#B62A2D] border border-[#B62A2D] rounded px-2 py-0.5 hover:bg-red-50"
              >
                {p === 'onesize' ? 'One Size' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                form.sizes.includes(s)
                  ? 'bg-[#222223] text-white border-[#222223]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colors & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Colors (comma-separated)</label>
          <input
            type="text"
            value={form.colors}
            onChange={(e) => set('colors', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D]"
            placeholder="Black, White, Red"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => set('tags', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D]"
            placeholder="jeans, streetwear, new"
          />
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-6">
        {[
          { key: 'in_stock', label: 'In Stock' },
          { key: 'is_new', label: 'New Arrival' },
          { key: 'is_sale', label: 'On Sale' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => set(key, !form[key])}
              className={`w-10 h-6 rounded-full transition-colors relative ${form[key] ? 'bg-[#B62A2D]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {/* Rating & Reviews */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Rating (0–5)</label>
          <input
            type="number"
            min="0" max="5" step="0.1"
            value={form.rating}
            onChange={(e) => set('rating', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Reviews Count</label>
          <input
            type="number"
            min="0"
            value={form.reviews}
            onChange={(e) => set('reviews', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D]"
          />
        </div>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <ImageUploader
            currentImage={form.image}
            onUploaded={(url) => set('image', url)}
            label="Main Image"
          />
          {form.image && (
            <p className="text-xs text-gray-400 mt-1 truncate">{form.image}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <MultiImageUploader
            currentImages={form.images}
            onUpdated={(imgs) => set('images', imgs)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-[#B62A2D] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-red-800 transition disabled:opacity-60"
        >
          {saving ? 'Saving…' : form.id ? 'Save Changes' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed]);

  const handleDelete = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return alert('Delete failed: ' + error.message);
    setDeleteConfirm(null);
    fetchProducts();
  };

  const handleSaved = () => {
    setView('list');
    setSelected(null);
    fetchProducts();
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || (p.category || []).includes(filterCat);
    return matchSearch && matchCat;
  });

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  // ── FORM VIEW ──────────────────────────────────────────────────────────────
  if (view === 'add' || view === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => { setView('list'); setSelected(null); }}
            className="text-gray-500 hover:text-[#B62A2D] text-sm font-medium flex items-center gap-1"
          >
            ← Back
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <h1 className="font-bold text-lg text-[#222223]">
            {view === 'add' ? 'Add New Product' : `Edit: ${selected?.name}`}
          </h1>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <ProductForm
              product={view === 'edit' ? {
                ...selected,
                colors: (selected.colors || []).join(', '),
                tags: (selected.tags || []).join(', '),
                original_price: selected.original_price || '',
              } : {}}
              onSave={handleSaved}
              onCancel={() => { setView('list'); setSelected(null); }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#222223] tracking-tight">SHiNi Admin</h1>
            <p className="text-xs text-gray-400">{products.length} products total</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-gray-500 hover:text-[#B62A2D]">← View Store</a>
            <button
              onClick={() => setView('add')}
              className="bg-[#B62A2D] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-800 transition"
            >
              + Add Product
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D]"
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B62A2D]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Products', value: products.length },
            { label: 'In Stock', value: products.filter((p) => p.in_stock).length },
            { label: 'On Sale', value: products.filter((p) => p.is_sale).length },
            { label: 'New Arrivals', value: products.filter((p) => p.is_new).length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-2xl font-black text-[#222223]">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Product Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading products…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-semibold">No products found.</p>
            {products.length === 0 && (
              <p className="text-sm mt-1">Add your first product to get started.</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:border-gray-300 transition"
              >
                {/* Image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📷</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-[#222223] truncate">{p.name}</p>
                    {p.is_new && <Badge label="NEW" color="blue" />}
                    {p.is_sale && <Badge label="SALE" color="red" />}
                    {!p.in_stock && <Badge label="OUT OF STOCK" color="gray" />}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-sm font-bold text-[#B62A2D]">
                      £{parseFloat(p.price || 0).toFixed(2)}
                    </span>
                    {p.original_price && (
                      <span className="text-xs text-gray-400 line-through">£{parseFloat(p.original_price).toFixed(2)}</span>
                    )}
                    <span className="text-xs text-gray-400">
                      {(p.category || []).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setSelected(p); setView('edit'); }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(p)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="font-bold text-lg text-[#222223] mb-2">Delete Product?</h2>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 py-2.5 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
