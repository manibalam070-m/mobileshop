import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, ShoppingCart, Heart, Menu, X, ChevronRight, Star,
  Smartphone, ShieldCheck, Truck, CreditCard, Trash2, Plus, Minus,
  SlidersHorizontal, CheckCircle2
} from "lucide-react";
import "./styles.css";

const products = [
  { id:1, brand:"Apple", name:"iPhone 16 Pro", price:109999, oldPrice:119999, rating:4.8, reviews:324, storage:"256 GB", color:"Titanium Black", badge:"Best Seller", image:"https://images.unsplash.com/photo-1592286927505-2fd0b7f7c4f1?auto=format&fit=crop&w=700&q=80" },
  { id:2, brand:"Samsung", name:"Galaxy S25 Ultra", price:129999, oldPrice:139999, rating:4.9, reviews:291, storage:"256 GB", color:"Titanium Gray", badge:"New", image:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80" },
  { id:3, brand:"OnePlus", name:"OnePlus 13", price:69999, oldPrice:74999, rating:4.7, reviews:198, storage:"256 GB", color:"Midnight Ocean", badge:"Hot Deal", image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80" },
  { id:4, brand:"Google", name:"Pixel 9 Pro", price:99999, oldPrice:109999, rating:4.6, reviews:167, storage:"128 GB", color:"Obsidian", badge:"20% OFF", image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80" },
  { id:5, brand:"Xiaomi", name:"Xiaomi 15", price:54999, oldPrice:59999, rating:4.5, reviews:143, storage:"256 GB", color:"Black", badge:"Value Pick", image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80" },
  { id:6, brand:"Nothing", name:"Nothing Phone (3)", price:49999, oldPrice:54999, rating:4.4, reviews:112, storage:"256 GB", color:"White", badge:"Trending", image:"https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=700&q=80" },
  { id:7, brand:"Vivo", name:"Vivo X200 Pro", price:94999, oldPrice:99999, rating:4.6, reviews:94, storage:"512 GB", color:"Titanium", badge:"Premium", image:"https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=80" },
  { id:8, brand:"Realme", name:"Realme GT 7 Pro", price:44999, oldPrice:49999, rating:4.5, reviews:88, storage:"256 GB", color:"Silver", badge:"Limited", image:"https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=700&q=80" }
];

const formatPrice = n => "₹" + n.toLocaleString("en-IN");

function App() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [toast, setToast] = useState("");

  const brands = ["All", ...new Set(products.map(p => p.brand))];

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (brand === "All" || p.brand === brand) &&
      `${p.brand} ${p.name}`.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "low") list.sort((a,b)=>a.price-b.price);
    if (sort === "high") list.sort((a,b)=>b.price-a.price);
    if (sort === "rating") list.sort((a,b)=>b.rating-a.rating);
    return list;
  }, [search, brand, sort]);

  const addToCart = product => {
    setCart(prev => {
      const found = prev.find(x => x.id === product.id);
      return found ? prev.map(x => x.id === product.id ? {...x, qty:x.qty+1} : x) : [...prev, {...product, qty:1}];
    });
    setToast(`${product.name} added to cart`);
    setTimeout(() => setToast(""), 1800);
  };

  const changeQty = (id, delta) => {
    setCart(prev => prev.map(x => x.id === id ? {...x, qty: Math.max(1, x.qty + delta)} : x));
  };

  const removeItem = id => setCart(prev => prev.filter(x => x.id !== id));
  const cartCount = cart.reduce((s,x)=>s+x.qty,0);
  const subtotal = cart.reduce((s,x)=>s+x.price*x.qty,0);
  const delivery = subtotal >= 50000 || subtotal === 0 ? 0 : 199;
  const total = subtotal + delivery;

  return (
    <div>
      <div className="topbar">🚚 Free delivery on orders above ₹50,000 &nbsp; • &nbsp; 7-day easy returns</div>
      <header className="header">
        <div className="container nav">
          <button className="icon-btn mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>
          <div className="logo" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
            <span className="logo-mark"><Smartphone size={21}/></span> Mobile<span>Hub</span>
          </div>
          <nav className={menuOpen ? "nav-links open" : "nav-links"}>
            <a href="#home" onClick={()=>setMenuOpen(false)}>Home</a>
            <a href="#products" onClick={()=>setMenuOpen(false)}>Mobiles</a>
            <a href="#offers" onClick={()=>setMenuOpen(false)}>Offers</a>
            <a href="#why-us" onClick={()=>setMenuOpen(false)}>Why Us</a>
          </nav>
          <div className="header-actions">
            <div className="search">
              <Search size={19}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search mobiles..." />
            </div>
            <button className="icon-btn fav-btn" onClick={()=>setToast(`${favorites.length} item(s) in wishlist`)}><Heart size={21}/><small>{favorites.length}</small></button>
            <button className="cart-btn" onClick={()=>setCartOpen(true)}><ShoppingCart size={20}/> <span>Cart</span>{cartCount>0 && <b>{cartCount}</b>}</button>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">THE SMARTPHONE STORE</span>
              <h1>Find the phone<br/><span>made for you.</span></h1>
              <p>Explore the latest smartphones from Apple, Samsung, OnePlus, Google and more — with great deals and trusted delivery.</p>
              <div className="hero-buttons">
                <a className="primary-btn" href="#products">Shop Mobiles <ChevronRight size={18}/></a>
                <a className="secondary-btn" href="#offers">View Offers</a>
              </div>
              <div className="hero-trust"><span><ShieldCheck/> Secure payments</span><span><Truck/> Fast delivery</span></div>
            </div>
            <div className="hero-phone">
              <div className="circle"></div>
              <img src={products[0].image} alt="iPhone 16 Pro"/>
              <div className="floating-card"><Star fill="currentColor" size={17}/><strong>4.8</strong><span>Top rated</span></div>
            </div>
          </div>
        </section>

        <section className="features" id="why-us">
          <div className="container feature-grid">
            <Feature icon={<Truck/>} title="Fast Delivery" text="Reliable doorstep delivery across India"/>
            <Feature icon={<ShieldCheck/>} title="100% Genuine" text="Authentic products with brand warranty"/>
            <Feature icon={<CreditCard/>} title="Secure Payment" text="Safe UPI, card & cashless payments"/>
            <Feature icon={<CheckCircle2/>} title="Easy Returns" text="Simple 7-day return policy"/>
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="container">
            <div className="section-head">
              <div><span className="eyebrow">OUR COLLECTION</span><h2>Latest Smartphones</h2><p>Choose from our hand-picked collection.</p></div>
              <div className="controls">
                <div className="brand-select"><SlidersHorizontal size={17}/><select value={brand} onChange={e=>setBrand(e.target.value)}>{brands.map(b=><option key={b}>{b}</option>)}</select></div>
                <select className="sort-select" value={sort} onChange={e=>setSort(e.target.value)}>
                  <option value="featured">Sort: Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
            <div className="product-grid">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product}
                  favorite={favorites.includes(product.id)}
                  onFavorite={()=>setFavorites(prev=>prev.includes(product.id)?prev.filter(id=>id!==product.id):[...prev,product.id])}
                  onAdd={()=>addToCart(product)}
                />
              ))}
            </div>
            {filtered.length===0 && <div className="empty">No mobiles found. Try another search or brand.</div>}
          </div>
        </section>

        <section className="offer-banner" id="offers">
          <div className="container offer-content">
            <div><span className="eyebrow">LIMITED TIME OFFER</span><h2>Upgrade today & save up to ₹10,000</h2><p>Selected smartphones • Bank offers • No-cost EMI available</p></div>
            <a href="#products" className="primary-btn">Explore Deals <ChevronRight size={18}/></a>
          </div>
        </section>

        <section className="newsletter">
          <div className="container newsletter-inner">
            <div><h2>Get the latest deals</h2><p>Subscribe for new launches, discounts and tech updates.</p></div>
            <form onSubmit={e=>{e.preventDefault();setToast("Thanks for subscribing!")}}><input type="email" required placeholder="Your email address"/><button className="primary-btn">Subscribe</button></form>
          </div>
        </section>
      </main>

      <footer><div className="container footer-grid"><div><div className="logo">Mobile<span>Hub</span></div><p>Your trusted online destination for smartphones.</p></div><div><h4>Shop</h4><a href="#products">All Mobiles</a><a href="#offers">Offers</a></div><div><h4>Support</h4><a href="#why-us">Why MobileHub</a><a href="#products">Warranty</a></div><div><h4>Contact</h4><p>support@mobilehub.in</p><p>+91 98765 43210</p></div></div><div className="copyright">© 2026 MobileHub. Demo e-commerce project.</div></footer>

      {cartOpen && <div className="overlay" onClick={()=>setCartOpen(false)}><aside className="cart-panel" onClick={e=>e.stopPropagation()}>
        <div className="cart-head"><div><h2>Your Cart</h2><p>{cartCount} item(s)</p></div><button className="icon-btn" onClick={()=>setCartOpen(false)}><X/></button></div>
        {cart.length===0 ? <div className="cart-empty"><ShoppingCart size={45}/><h3>Your cart is empty</h3><p>Add a smartphone to get started.</p><button className="primary-btn" onClick={()=>setCartOpen(false)}>Continue Shopping</button></div> :
        <><div className="cart-items">{cart.map(item=><div className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div className="cart-info"><h4>{item.name}</h4><strong>{formatPrice(item.price)}</strong><div className="qty"><button onClick={()=>changeQty(item.id,-1)}><Minus size={14}/></button><span>{item.qty}</span><button onClick={()=>changeQty(item.id,1)}><Plus size={14}/></button><button className="delete" onClick={()=>removeItem(item.id)}><Trash2 size={15}/></button></div></div></div>)}</div>
        <div className="summary"><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Delivery</span><strong>{delivery===0?"FREE":formatPrice(delivery)}</strong></div><div className="total"><span>Total</span><strong>{formatPrice(total)}</strong></div><button className="primary-btn full" onClick={()=>{setCartOpen(false);setCheckout(true)}}>Proceed to Checkout</button></div></>}
      </aside></div>}

      {checkout && <div className="overlay"><div className="checkout"><button className="icon-btn close-check" onClick={()=>setCheckout(false)}><X/></button><span className="eyebrow">SECURE CHECKOUT</span><h2>Complete your order</h2><div className="checkout-grid"><form onSubmit={e=>{e.preventDefault();setCheckout(false);setCart([]);setToast("Order placed successfully! 🎉")}}><label>Full Name<input required placeholder="Enter your name"/></label><label>Mobile Number<input required pattern="[0-9]{10}" placeholder="10-digit mobile number"/></label><label>Delivery Address<textarea required placeholder="House no., street, city, pincode"></textarea></label><label>Payment Method<select><option>UPI</option><option>Credit / Debit Card</option><option>Cash on Delivery</option></select></label><button className="primary-btn full">Place Order · {formatPrice(total)}</button></form><div className="checkout-summary"><h3>Order Summary</h3>{cart.map(x=><div className="mini-line" key={x.id}><span>{x.name} × {x.qty}</span><b>{formatPrice(x.price*x.qty)}</b></div>)}<hr/><div className="mini-line"><strong>Total</strong><strong>{formatPrice(total)}</strong></div></div></div></div></div>}

      {toast && <div className="toast"><CheckCircle2 size={19}/>{toast}</div>}
    </div>
  );
}

function Feature({icon,title,text}) {
  return <div className="feature"><div className="feature-icon">{icon}</div><div><h3>{title}</h3><p>{text}</p></div></div>
}
function ProductCard({product,favorite,onFavorite,onAdd}) {
  return <article className="product-card"><div className="product-image"><span className="badge">{product.badge}</span><button className={"heart "+(favorite?"active":"")} onClick={onFavorite}><Heart size={19} fill={favorite?"currentColor":"none"}/></button><img src={product.image} alt={product.name}/></div><div className="product-info"><span className="brand">{product.brand}</span><h3>{product.name}</h3><div className="rating"><Star size={15} fill="currentColor"/><b>{product.rating}</b><span>({product.reviews})</span></div><div className="specs"><span>{product.storage}</span><span>{product.color}</span></div><div className="price-row"><div><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.oldPrice)}</del></div><button className="add-btn" onClick={onAdd}><ShoppingCart size={17}/> Add</button></div></div></article>
}

createRoot(document.getElementById("root")).render(<App />);
