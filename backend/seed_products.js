import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const run = async () => {
  const q = (sql, vals = []) =>
    new Promise((res, rej) => db.query(sql, vals, (e, r) => (e ? rej(e) : res(r))));

  try {
    // Subcategories
    await q(`INSERT IGNORE INTO product_subcategory (category_id, subcategory_name, slug, description, status) VALUES
      (14,'Beds','beds','All types of beds','Active'),
      (14,'Wardrobes','wardrobes','Wardrobes and cabinets','Active'),
      (15,'Sofas','sofas','Living room sofas','Active'),
      (15,'Coffee Tables','coffee-tables','Coffee and center tables','Active'),
      (16,'Desks','desks','Office desks','Active'),
      (17,'Lighting','lighting','Home lighting accessories','Active'),
      (18,'Cookware','cookware','Kitchen cookware','Active')`);

    const [subs] = await q("SELECT subcategory_id, subcategory_name FROM product_subcategory");
    const s = {};
    subs.forEach((r) => (s[r.subcategory_name] = r.subcategory_id));
    console.log("Subcategories:", s);

    // 10 Products
    const products = [
      ['en','Velvet Lounge Sofa','Premium velvet 3-seater sofa with solid wood legs and high-density foam cushions.',15,s['Sofas'],899.00,'SOFA-VL-001',25,18,'["sofa","velvet","lounge"]','active',1,0,0],
      ['en','Nordic Oak Coffee Table','Scandinavian style coffee table crafted from solid oak wood with minimalist design.',15,s['Coffee Tables'],249.00,'CTAB-NO-002',40,18,'["coffee-table","oak","nordic"]','active',1,1,0],
      ['en','King Size Platform Bed','Modern platform bed with upholstered headboard and under-bed storage drawers.',14,s['Beds'],1299.00,'BED-KS-003',15,18,'["bed","king-size","platform"]','active',0,1,0],
      ['en','Rattan Wardrobe','Handcrafted natural rattan wardrobe with 3 doors and adjustable shelves.',14,s['Wardrobes'],699.00,'WARD-RN-004',10,18,'["wardrobe","rattan","natural"]','active',0,0,1],
      ['en','Marble Dining Table','Luxurious marble top dining table with black metal legs, seats 6 comfortably.',15,s['Coffee Tables'],1499.00,'DTAB-ML-005',8,18,'["dining-table","marble","luxury"]','active',1,0,1],
      ['en','Executive Standing Desk','Height-adjustable electric standing desk with memory presets and cable management.',16,s['Desks'],599.00,'DESK-ES-006',20,18,'["desk","standing","electric"]','active',1,1,0],
      ['en','Ergonomic Mesh Chair','Fully adjustable ergonomic office chair with breathable mesh back and lumbar support.',16,s['Office Chairs'],349.00,'OCHR-EM-007',35,18,'["chair","ergonomic","mesh"]','active',1,0,0],
      ['en','Industrial Bookshelf','Rustic industrial bookshelf with metal frame and 5 wooden shelves.',15,s['Coffee Tables'],399.00,'BSHF-IN-008',18,18,'["bookshelf","industrial","rustic"]','active',0,1,1],
      ['en','Pendant Ceiling Light','Modern minimalist pendant light with adjustable height for dining areas.',17,s['Lighting'],179.00,'LIGHT-PC-009',30,18,'["light","pendant","modern"]','active',0,1,0],
      ['en','Non-Stick Cookware Set','10-piece premium non-stick cookware set with glass lids and heat-resistant handles.',18,s['Cookware'],299.00,'COOK-NS-010',22,18,'["cookware","non-stick","kitchen"]','active',0,0,1],
    ];

    for (const p of products) {
      await q(`INSERT INTO products (lang, product_name, description, category_id, sub_category_id, base_price, sku, quantity, vat, tags, main_image, status, is_best_seller, is_new_arrival, is_on_sale) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, p);
    }

    const [count] = await q("SELECT COUNT(*) as total FROM products");
    console.log("Done! Total products:", count[0].total);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    db.end();
  }
};

run();
