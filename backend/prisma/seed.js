const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categories = [
  { name: 'Sneakers', slug: 'sneakers', description: 'Athletic and casual sneakers' },
  { name: 'T-Shirts', slug: 't-shirts', description: 'Casual and graphic tees' },
  { name: 'Hoodies', slug: 'hoodies', description: 'Pullover and zip-up hoodies' },
  { name: 'Watches', slug: 'watches', description: 'Luxury and casual watches' },
  { name: 'Bags', slug: 'bags', description: 'Backpacks, totes and handbags' },
  { name: 'Sunglasses', slug: 'sunglasses', description: 'UV protection eyewear' },
  { name: 'Headphones', slug: 'headphones', description: 'Wireless and wired audio' },
  { name: 'Jackets', slug: 'jackets', description: 'Bomber, denim and leather jackets' },
];

const products = [
  // Sneakers
  { name: 'Air Force 1 Low White', description: 'Classic all-white leather sneaker with Air cushioning. Iconic silhouette that goes with everything.', price: 110.00, stock: 45, category: 'sneakers', images: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80,https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80' },
  { name: 'Ultraboost 22 Black', description: 'Responsive Boost midsole with Primeknit upper. Built for runners who demand performance and style.', price: 189.99, stock: 30, category: 'sneakers', images: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80,https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80' },
  { name: 'Chuck Taylor All Star', description: 'The original canvas sneaker. Timeless high-top design with vulcanized rubber sole.', price: 65.00, stock: 80, category: 'sneakers', images: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&q=80,https://images.unsplash.com/photo-1494496195158-c3bc5b7b5d6e?w=600&q=80' },
  { name: 'New Balance 990v5', description: 'Made in USA. Premium suede and mesh upper with ENCAP midsole technology for superior comfort.', price: 184.99, stock: 25, category: 'sneakers', images: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80,https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80' },
  { name: 'Vans Old Skool Black', description: 'Iconic side stripe skate shoe with durable suede and canvas upper. A streetwear staple.', price: 70.00, stock: 60, category: 'sneakers', images: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80,https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600&q=80' },

  // T-Shirts
  { name: 'Essential Cotton Tee White', description: '100% organic cotton heavyweight tee. Pre-shrunk, relaxed fit with reinforced stitching.', price: 29.99, stock: 120, category: 't-shirts', images: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80,https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80' },
  { name: 'Graphic Print Tee Black', description: 'Bold graphic print on premium cotton. Oversized fit with dropped shoulders for a modern look.', price: 34.99, stock: 90, category: 't-shirts', images: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80,https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80' },
  { name: 'Striped Polo Shirt Navy', description: 'Classic navy and white stripe polo. Pique cotton with ribbed collar and two-button placket.', price: 44.99, stock: 55, category: 't-shirts', images: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&q=80,https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80' },

  // Hoodies
  { name: 'Classic Pullover Hoodie Grey', description: 'Heavyweight 400gsm fleece hoodie. Kangaroo pocket, adjustable drawstring, ribbed cuffs.', price: 79.99, stock: 40, category: 'hoodies', images: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80,https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80' },
  { name: 'Zip-Up Tech Fleece Black', description: 'Slim-fit zip-up with engineered fleece fabric. Tapered fit with zippered pockets.', price: 94.99, stock: 35, category: 'hoodies', images: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80,https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80' },
  { name: 'Oversized Vintage Hoodie Cream', description: 'Washed and distressed for a vintage feel. Boxy oversized fit with raw hem details.', price: 69.99, stock: 50, category: 'hoodies', images: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80,https://images.unsplash.com/photo-1614495640792-0e4e7e5e5e5e?w=600&q=80' },

  // Watches
  { name: 'Minimalist Leather Watch Black', description: 'Swiss quartz movement with genuine leather strap. Sapphire crystal glass, 5ATM water resistant.', price: 249.99, stock: 20, category: 'watches', images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80,https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80' },
  { name: 'Chronograph Steel Watch Silver', description: 'Stainless steel case with chronograph function. Automatic movement, exhibition caseback.', price: 449.99, stock: 12, category: 'watches', images: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600&q=80,https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80' },
  { name: 'Smart Watch Series X', description: 'AMOLED display with health tracking, GPS, and 7-day battery life. Aluminum case with sport band.', price: 329.99, stock: 28, category: 'watches', images: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80,https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80' },

  // Bags
  { name: 'Canvas Backpack Olive', description: '20L waxed canvas backpack with leather accents. Laptop sleeve, multiple compartments, padded straps.', price: 89.99, stock: 35, category: 'bags', images: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80,https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80' },
  { name: 'Leather Tote Bag Tan', description: 'Full-grain leather tote with suede lining. Magnetic closure, interior zip pocket, detachable strap.', price: 159.99, stock: 18, category: 'bags', images: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80,https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
  { name: 'Mini Crossbody Black', description: 'Compact crossbody with adjustable chain strap. Card slots, zip closure, vegan leather.', price: 49.99, stock: 65, category: 'bags', images: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80,https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80' },

  // Sunglasses
  { name: 'Aviator Gold Sunglasses', description: 'Classic aviator with gold metal frame and green gradient lenses. UV400 protection, spring hinges.', price: 159.99, stock: 40, category: 'sunglasses', images: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80,https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80' },
  { name: 'Wayfarer Black Sunglasses', description: 'Iconic wayfarer silhouette in matte black acetate. Polarized lenses with 100% UV protection.', price: 139.99, stock: 55, category: 'sunglasses', images: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=600&q=80,https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80' },

  // Headphones
  { name: 'Wireless Over-Ear Headphones Black', description: '40hr battery, active noise cancellation, Hi-Res audio. Foldable design with premium ear cushions.', price: 299.99, stock: 22, category: 'headphones', images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80,https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80' },
  { name: 'True Wireless Earbuds White', description: 'IPX5 waterproof with 6hr playtime + 24hr case. Adaptive EQ, transparency mode, wireless charging.', price: 199.99, stock: 45, category: 'headphones', images: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&q=80,https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80' },
  { name: 'Studio Monitor Headphones', description: 'Professional-grade 50mm drivers with flat frequency response. Detachable cable, foldable design.', price: 149.99, stock: 18, category: 'headphones', images: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80,https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&q=80' },

  // Jackets
  { name: 'Bomber Jacket Olive', description: 'MA-1 style bomber in nylon with ribbed collar, cuffs and hem. Satin lining, multiple pockets.', price: 129.99, stock: 28, category: 'jackets', images: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80,https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80' },
  { name: 'Denim Jacket Washed Blue', description: 'Classic trucker jacket in 12oz denim. Chest pockets, adjustable waist tabs, vintage wash.', price: 99.99, stock: 38, category: 'jackets', images: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80,https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80' },
  { name: 'Leather Biker Jacket Black', description: 'Genuine cowhide leather with asymmetric zip. Quilted shoulders, snap lapels, YKK zippers.', price: 299.99, stock: 15, category: 'jackets', images: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&q=80,https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=600&q=80' },
];

const reviews = [
  { rating: 5, title: 'Absolutely love it!', content: 'Best purchase I have made this year. Quality is outstanding and delivery was super fast.' },
  { rating: 4, title: 'Great product', content: 'Really happy with this. Fits perfectly and looks exactly like the photos.' },
  { rating: 5, title: 'Exceeded expectations', content: 'The quality is incredible for the price. Will definitely be buying more from ShopSmart.' },
  { rating: 3, title: 'Good but not perfect', content: 'Nice product overall but sizing runs a bit small. Order one size up.' },
  { rating: 5, title: 'Perfect!', content: 'Exactly what I was looking for. Fast shipping and great packaging.' },
  { rating: 4, title: 'Very satisfied', content: 'High quality materials and great attention to detail. Highly recommend.' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create seller user
  const sellerHash = await bcrypt.hash('password123', 10);
  const seller = await prisma.user.upsert({
    where: { email: 'seller@shopsmart.com' },
    update: {},
    create: {
      email: 'seller@shopsmart.com',
      name: 'ShopSmart Store',
      role: 'SELLER',
      passwordHash: sellerHash,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    },
  });

  // Create demo shopper
  const shopperHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'demo@shopsmart.com' },
    update: {},
    create: {
      email: 'demo@shopsmart.com',
      name: 'Demo User',
      role: 'SHOPPER',
      passwordHash: shopperHash,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    },
  });

  // Create admin
  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@shopsmart.com' },
    update: {},
    create: {
      email: 'admin@shopsmart.com',
      name: 'Admin',
      role: 'ADMIN',
      passwordHash: adminHash,
    },
  });

  console.log('✅ Users created');

  // Create categories
  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log('✅ Categories created');

  // Create products
  for (const p of products) {
    const categoryId = categoryMap[p.category];
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        images: p.images,
        categoryId,
        sellerId: seller.id,
      },
    });
  }
  console.log('✅ Products created');

  // Add reviews to first 10 products
  const allProducts = await prisma.product.findMany({ take: 10 });
  const allUsers = await prisma.user.findMany();

  for (let i = 0; i < allProducts.length; i++) {
    const review = reviews[i % reviews.length];
    const user = allUsers[i % allUsers.length];
    await prisma.review.create({
      data: {
        userId: user.id,
        productId: allProducts[i].id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        verified: true,
      },
    });
  }
  console.log('✅ Reviews created');

  console.log('\n🎉 Seed complete!');
  console.log('   Login: demo@shopsmart.com / password123');
  console.log('   Seller: seller@shopsmart.com / password123');
  console.log('   Admin: admin@shopsmart.com / admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
