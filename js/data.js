/* Site data for Smart IT Solution.
   Edit this file to change laptops, prices or store details.
   Field names match the Phase 2 catalogue (see project pack, section 8).
   All laptops and prices below are SAMPLES for the preview. */
window.SIT_DATA = {
  phone: "919665373829",
  phoneDisplay: "+91 96653 73829",

  laptops: [
    {
      id: 1, slug: "dell-latitude-5420", brand: "Dell", model: "Dell Latitude 5420",
      processor: "Intel Core i5 11th Gen", processor_family: "i5", ram_gb: 16, storage: "512GB SSD",
      screen: '14" Full HD', condition: "open_box", badge: "Bestseller", price_inr: 32999,
      warranty: "Shop warranty (period to be confirmed)", available: true, featured: true,
      colors: { scr: "#1D5FD1", scr2: "#7FB0FF" }
    },
    {
      id: 2, slug: "hp-probook-450-g8", brand: "HP", model: "HP ProBook 450 G8",
      processor: "Intel Core i5 11th Gen", processor_family: "i5", ram_gb: 16, storage: "512GB SSD",
      screen: '15.6" Full HD', condition: "open_box", badge: null, price_inr: 29999,
      warranty: "Shop warranty (period to be confirmed)", available: true, featured: true,
      colors: { scr: "#0F3E9E", scr2: "#3FA0E0" }
    },
    {
      id: 3, slug: "lenovo-thinkpad-e14", brand: "Lenovo", model: "Lenovo ThinkPad E14",
      processor: "Intel Core i5 10th Gen", processor_family: "i5", ram_gb: 8, storage: "512GB SSD",
      screen: '14" Full HD', condition: "refurbished", badge: null, price_inr: 27999,
      warranty: "Shop warranty (period to be confirmed)", available: true, featured: true,
      colors: { scr: "#123A66", scr2: "#E05A47" }
    },
    {
      id: 4, slug: "apple-macbook-air-m1", brand: "Apple", model: "Apple MacBook Air M1",
      processor: "Apple M1", processor_family: "M1", ram_gb: 8, storage: "256GB SSD",
      screen: '13.3" Retina', condition: "refurbished", badge: null, price_inr: 49999,
      warranty: "Shop warranty (period to be confirmed)", available: true, featured: true,
      colors: { scr: "#3B2F6B", scr2: "#F2A65A" }, deck: "#D9DDE3"
    },
    {
      id: 5, slug: "acer-aspire-7", brand: "Acer", model: "Acer Aspire 7",
      processor: "AMD Ryzen 5 5500U", processor_family: "Ryzen 5", ram_gb: 16, storage: "512GB SSD",
      screen: '15.6" Full HD', condition: "new", badge: null, price_inr: 52990,
      warranty: "1 year brand warranty", available: true, featured: true,
      colors: { scr: "#0B4F4A", scr2: "#3CC7B0" }, deck: "#3A4252", deckEdge: "#2A3140"
    },
    {
      id: 6, slug: "asus-vivobook-15", brand: "Asus", model: "Asus Vivobook 15",
      processor: "Intel Core i3 12th Gen", processor_family: "i3", ram_gb: 8, storage: "512GB SSD",
      screen: '15.6" Full HD', condition: "new", badge: null, price_inr: 34990,
      warranty: "1 year brand warranty", available: true, featured: true,
      colors: { scr: "#1D5FD1", scr2: "#9BE3FF" }
    }
  ],

  stores: [
    {
      id: 1, name: "Sector 20, Kharghar",
      address: "Shop No. 9, Suryakiran CHS, Plot No. 11, Sector 20, Kharghar, Navi Mumbai 410210",
      mapQuery: "Smart IT Solution, Shop No. 9, Suryakiran CHS, Plot No. 11, Sector 20, Kharghar, Navi Mumbai 410210",
      phone: "919665373829", phoneDisplay: "+91 96653 73829", hours: "Hours: to be confirmed"
    },
    {
      id: 2, name: "Sector 35, Kharghar",
      address: "Shop No. 10, Fortune Classic, Plot E-27, Sector 35, Kharghar, Navi Mumbai",
      mapQuery: "Fortune Classic, Plot E-27, Sector 35, Kharghar, Navi Mumbai",
      phone: "919665373829", phoneDisplay: "+91 96653 73829", hours: "Hours: to be confirmed"
    }
  ]
};
