// TOKIPICK — datos ejemplos

const PRODUCTS = [
  { id: 1, name: "Black Jean", brand: "Zara", price: 119900, category: "bottom", sizes: ["36", "38", "40", "42"], match: 94, matchItems: 11, quality: 90, rating: 4.5, image: "assets/products/black-jean-zara.jpg", desc: "High-rise black jeans with a straight cut. Goes with almost everything already in your closet." },
  { id: 2, name: "White Shirt", brand: "Mango", price: 40000, category: "top", sizes: ["XS", "S", "M", "L"], match: 78, matchItems: 9, quality: 82, rating: 4, image: "assets/products/white-shirt-mango.jpg", desc: "Classic-cut white cotton shirt. A must-have basic for formal or casual looks." },
  { id: 3, name: "Striped Sweater", brand: "Zara", price: 55900, category: "top", sizes: ["S", "M", "L"], match: 46, matchItems: 4, quality: 75, rating: 3.5, image: "assets/products/striped-sweater-zara.jpg", desc: "Striped sweater in a lightweight knit. Perfect for in-between weather." },
  { id: 4, name: "Rose Coat", brand: "Cider", price: 89900, category: "outerwear", sizes: ["S", "M", "L", "XL"], match: 81, matchItems: 6, quality: 70, rating: 4, image: "assets/products/rose-coat-cider.jpg", desc: "Oversized pink coat, ideal for adding color to a neutral outfit." },
  { id: 5, name: "Dark Jean", brand: "Levis", price: 110000, category: "bottom", sizes: ["36", "38", "40", "42"], match: 88, matchItems: 8, quality: 92, rating: 5, image: "assets/products/dark-jean-levis.jpg", desc: "Dark Levi's jeans, mid rise. Premium denim quality." },
  { id: 6, name: "Tinted Samba", brand: "Adidas", price: 190000, category: "footwear", sizes: ["37", "38", "39", "40", "41"], match: 85, matchItems: 7, quality: 88, rating: 4.5, image: "assets/products/tinted-samba-adidas.jpg", desc: "Samba sneakers with pink details. Non-slip rubber sole." },
  { id: 7, name: "Thin Dress", brand: "Meshki", price: 75000, category: "dress", sizes: ["XS", "S", "M"], match: 70, matchItems: 5, quality: 65, rating: 3.5, image: "assets/products/thin-dress-meshki.jpg", desc: "Lightweight thin-strap dress in a flowy fabric." },
  { id: 8, name: "Yellow Sweater", brand: "Sinsay", price: 24999, category: "top", sizes: ["S", "M", "L"], match: 60, matchItems: 2, quality: 58, rating: 3, image: "assets/products/yellow-sweater-sinsay.jpg", desc: "Yellow chunky-knit sweater: warmth without losing style." },
  { id: 9, name: "Beige Coat", brand: "H&M", price: 99000, category: "outerwear", sizes: ["S", "M", "L"], match: 65, matchItems: 5, quality: 68, rating: 3.5, image: "assets/products/beige-coat-hm.jpg", desc: "Long beige coat with a straight cut and belt." },
  { id: 10, name: "White Shirt", brand: "Pull&Bear", price: 74999, category: "top", sizes: ["XS", "S", "M", "L"], match: 94, matchItems: 6, quality: 88, rating: 4, image: "assets/products/white-shirt-pullandbear.jpg", desc: "Oversized white shirt with a soft drape." },
  { id: 11, name: "Long Coat", brand: "Zara", price: 449000, category: "outerwear", sizes: ["S", "M", "L"], match: 58, matchItems: 3, quality: 91, rating: 4.5, image: "assets/products/long-coat-zara.jpg", desc: "Long wool coat, ideal for winter." },
  { id: 12, name: "Striped Skirt", brand: "Zara", price: 46500, category: "bottom", sizes: ["XS", "S", "M", "L"], match: 52, matchItems: 3, quality: 74, rating: 3.5, image: "assets/products/striped-skirt-zara.jpg", desc: "Striped high-waisted skirt with a side slit." },
  { id: 13, name: "Leather Boots", brand: "Steve Madden", price: 168000, category: "footwear", sizes: ["36", "37", "38", "39"], match: 73, matchItems: 5, quality: 85, rating: 4, image: "assets/products/leather-boots-stevemadden.jpg", desc: "Faux-leather ankle boots." },
  { id: 14, name: "Gold Necklace", brand: "Ale Ale", price: 18500, category: "accessory", sizes: ["One size"], match: 40, matchItems: 1, quality: 60, rating: 3, image: "assets/products/gold-necklace-alealee.jpg", desc: "Fine gold-plated chain with a lobster clasp." },
];

const CATEGORY_LABELS = {
  top: "Top",
  bottom: "Bottom",
  footwear: "Foot wear",
  accessory: "Accessories",
  outerwear: "Outerwear",
  dress: "Dress",
};

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function formatPrice(value) {
  return "$" + value.toLocaleString("es-AR");
}

function starsHtml(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let out = "";
  for (let i = 0; i < full; i++) out += "★";
  if (half) out += "⯨";
  for (let i = full + (half ? 1 : 0); i < 5; i++) out += "☆";
  return out;
}
