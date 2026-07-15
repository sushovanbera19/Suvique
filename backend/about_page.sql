CREATE TABLE IF NOT EXISTS about_page (
  id INT PRIMARY KEY DEFAULT 1,
  heading VARCHAR(255) NOT NULL DEFAULT 'Who We Are',
  description TEXT,
  stat1_value INT DEFAULT 12000,
  stat1_label VARCHAR(255) DEFAULT 'Premium Products',
  stat2_value INT DEFAULT 25000,
  stat2_label VARCHAR(255) DEFAULT 'Years Experience',
  stat3_value INT DEFAULT 20000,
  stat3_label VARCHAR(255) DEFAULT 'Happy Customers',
  experience_title VARCHAR(255) DEFAULT 'Our Experience',
  experience_text TEXT,
  feature1 VARCHAR(255) DEFAULT 'User Friendly',
  feature2 VARCHAR(255) DEFAULT 'Fast Shipping',
  feature3 VARCHAR(255) DEFAULT '24/7 Customer Support',
  feature4 VARCHAR(255) DEFAULT 'High Quality Products',
  feature5 VARCHAR(255) DEFAULT 'Easy Returns'
);

-- Insert default row
INSERT INTO about_page (id, heading, description, experience_text)
VALUES (1,
  'Who We Are',
  'Welcome to Furnisy, your premier destination for high-quality furniture that transforms houses into homes.',
  'Discover our journey of crafting exceptional living spaces with premium furniture designed for modern lifestyles.'
)
ON DUPLICATE KEY UPDATE id = id;
