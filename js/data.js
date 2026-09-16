// ============================================
// TOKIPICK — catálogo compartido
// Datos de ejemplo (mock) que alimentan Home, Search,
// Swipe, Compare, Cart y la pantalla de producto.
// En una versión conectada a backend, esto vendría de la API.
// ============================================

const PRODUCTS = [
  { id: 1, name: "Black Jean", brand: "Zara", price: 119900, category: "bottom", sizes: ["36", "38", "40", "42"], match: 94, matchItems: 11, quality: 90, desc: "Jean negro de tiro alto, corte recto. Combina con casi todo lo que ya tenés en el placard." },
  { id: 2, name: "White Shirt", brand: "Mango", price: 40000, category: "top", sizes: ["XS", "S", "M", "L"], match: 78, matchItems: 9, quality: 82, desc: "Camisa blanca de algodón, corte clásico. Básico infaltable para looks formales o casuales." },
  { id: 3, name: "Striped Sweater", brand: "Zara", price: 55900, category: "top", sizes: ["S", "M", "L"], match: 46, matchItems: 4, quality: 75, desc: "Sweater a rayas, tejido liviano. Ideal para entretiempo." },
  { id: 4, name: "Rose Coat", brand: "Cider", price: 89900, category: "outerwear", sizes: ["S", "M", "L", "XL"], match: 81, matchItems: 6, quality: 70, desc: "Tapado rosa oversize, ideal para sumar color a un outfit neutro." },
  { id: 5, name: "Dark Jean", brand: "Levis", price: 110000, category: "bottom", sizes: ["36", "38", "40", "42"], match: 88, matchItems: 8, quality: 92, desc: "Jean oscuro Levis, tiro medio. Calidad premium en el denim." },
  { id: 6, name: "Tinted Samba", brand: "Adidas", price: 190000, category: "footwear", sizes: ["37", "38", "39", "40", "41"], match: 85, matchItems: 7, quality: 88, desc: "Zapatillas Samba edición con detalles en rosa. Suela de goma antideslizante." },
  { id: 7, name: "Thin Dress", brand: "Meshki", price: 75000, category: "dress", sizes: ["XS", "S", "M"], match: 70, matchItems: 5, quality: 65, desc: "Vestido liviano de tiras finas, tela fluida." },
  { id: 8, name: "Yellow Sweater", brand: "Sinsay", price: 24999, category: "top", sizes: ["S", "M", "L"], match: 60, matchItems: 2, quality: 58, desc: "Sweater amarillo de punto grueso, calidez sin perder estilo." },
  { id: 9, name: "Beige Coat", brand: "H&M", price: 99000, category: "outerwear", sizes: ["S", "M", "L"], match: 65, matchItems: 5, quality: 68, desc: "Tapado beige largo, corte recto con cinturón." },
  { id: 10, name: "White Shirt", brand: "Pull&Bear", price: 74999, category: "top", sizes: ["XS", "S", "M", "L"], match: 94, matchItems: 6, quality: 88, desc: "Camisa blanca oversize, tela con caída suave." },
  { id: 11, name: "Long Coat", brand: "Zara", price: 449000, category: "outerwear", sizes: ["S", "M", "L"], match: 58, matchItems: 3, quality: 91, desc: "Tapado largo de paño, ideal para invierno." },
  { id: 12, name: "Striped Skirt", brand: "Zara", price: 46500, category: "bottom", sizes: ["XS", "S", "M", "L"], match: 52, matchItems: 3, quality: 74, desc: "Pollera a rayas, tiro alto, con abertura lateral." },
  { id: 13, name: "Leather Boots", brand: "Steve Madden", price: 168000, category: "footwear", sizes: ["36", "37", "38", "39"], match: 73, matchItems: 5, quality: 85, desc: "Botas de cuero ecológico, caña corta." },
  { id: 14, name: "Gold Necklace", brand: "Ale Ale", price: 18500, category: "accessory", sizes: ["Único"], match: 40, matchItems: 1, quality: 60, desc: "Cadena fina bañada en oro, cierre de mosquetón." },
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
