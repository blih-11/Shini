import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const WHATSAPP_NUMBER = '2348012345678';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const shipping = cartTotal >= 150 ? 0 : 15;
  const grandTotal = cartTotal + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    const itemsText = cartItems.map(item => `• ${item.name} (${item.size}, ${item.color}) x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    const message = encodeURIComponent(
      `🛍️ *New SHiNi Order*\n\n${itemsText}\n\n*Subtotal:* $${cartTotal.toFixed(2)}\n*Shipping:* ${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}\n*Total:* $${grandTotal.toFixed(2)}\n\nPlease confirm my order and provide delivery & payment details. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">Review</span>
          <h1 className="text-brand-cream text-3xl md:text-4xl font-bold mt-1">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <div>
              <h3 className="text-brand-cream font-bold text-xl mb-1">Your cart is empty</h3>
              <p className="text-brand-muted text-sm">Start exploring our collection</p>
            </div>
            <button onClick={() => navigate('/products')} className="bg-brand-accent text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            {/* Items */}
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.key} className="flex gap-4 p-4 bg-white/3 border border-white/7 rounded-2xl">
                  <img src={item.image} alt={item.name} onClick={() => navigate(`/products/${item.id}`)}
                    className="w-20 h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-brand-cream font-medium text-sm leading-snug cursor-pointer hover:text-brand-accent transition-colors" onClick={() => navigate(`/products/${item.id}`)}>
                      {item.name}
                    </h4>
                    <p className="text-brand-muted text-xs mt-0.5">{item.size} · {item.color}</p>
                    <p className="text-brand-cream font-bold mt-1">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-brand-cream hover:border-brand-accent text-sm">−</button>
                      <span className="text-brand-cream text-sm w-5 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-brand-cream hover:border-brand-accent text-sm">+</button>
                      <button onClick={() => removeFromCart(item.key)} className="ml-auto text-brand-muted hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <p className="text-brand-cream font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && <p className="text-brand-muted text-xs">${item.price.toFixed(2)} each</p>}
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="flex items-center gap-1.5 text-brand-muted hover:text-red-400 transition-colors text-xs mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7M4 7h16" /></svg>
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div className="self-start lg:sticky lg:top-24">
              <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
                <h2 className="text-brand-cream font-bold text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between">
                    <span className="text-brand-muted text-sm">Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="text-brand-cream font-medium text-sm">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted text-sm">Shipping</span>
                    <span className={`text-sm font-medium ${shipping === 0 ? 'text-green-400' : 'text-brand-cream'}`}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-brand-muted text-xs bg-white/5 px-3 py-2 rounded-lg">Add ${(150 - cartTotal).toFixed(2)} more for free shipping</p>
                  )}
                </div>
                <div className="border-t border-white/8 pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-cream font-semibold">Total</span>
                    <span className="text-brand-cream font-black text-2xl">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="w-full bg-[#25D366] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity mb-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Checkout via WhatsApp
                </button>
                <p className="text-brand-muted text-xs text-center mb-4">You'll be redirected to WhatsApp to confirm your order and payment.</p>
                <button onClick={() => navigate('/products')} className="w-full border border-white/12 text-brand-muted text-sm py-3 rounded-xl hover:border-brand-accent hover:text-brand-accent transition-all">
                  Continue Shopping
                </button>
              </div>
              <div className="mt-4 space-y-2.5">
                {[['🔒', 'Secure Checkout', 'Your data is protected'], ['📦', 'Fast Delivery', '3–7 business days'], ['↩️', 'Easy Returns', '30-day return policy']].map(([icon, label, sub]) => (
                  <div key={label} className="flex items-center gap-3 text-brand-muted">
                    <span className="text-lg">{icon}</span>
                    <div><p className="text-brand-cream text-xs font-medium">{label}</p><p className="text-xs">{sub}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
