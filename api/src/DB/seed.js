import { sequelize, connectDB, syncDB } from "./DBConnection.js";
import {
    User,
    Address,
    Category,
    Product,
    Cart,
} from "./models/associactions.js";

export const seedDatabase = async () => {
    try {
        console.log("Connecting and syncing database for seeding...");
        await connectDB();
        await syncDB();

        // 1. Create or Find Admin
        let admin = await User.findOne({ where: { email: "admin@shopsy.com" } });
        if (!admin) {
            admin = await User.create({
                name: "Shopsy Admin",
                email: "admin@shopsy.com",
                password: "Admin123!",
                role: "admin",
                phone: "+201000000001",
            });
            console.log("Admin user created: admin@shopsy.com");
        }

        // 2. Create or Find Customer
        let customer = await User.findOne({ where: { email: "user@shopsy.com" } });
        if (!customer) {
            customer = await User.create({
                name: "John Doe",
                email: "user@shopsy.com",
                password: "User123!",
                role: "user",
                phone: "+201000000002",
            });
            console.log("Customer user created: user@shopsy.com");
        }

        // Create default address for customer
        const addressCount = await Address.count({ where: { userId: customer.id } });
        if (addressCount === 0) {
            await Address.create({
                userId: customer.id,
                fullName: "John Doe",
                phone: "+201000000002",
                street: "123 El-Tahrir Street",
                city: "Cairo",
                state: "Cairo",
                postalCode: "11511",
                country: "Egypt",
                isDefault: true,
            });
            console.log("Default address created for customer.");
        }

        // Ensure carts exist
        await Cart.findOrCreate({ where: { userId: customer.id } });
        await Cart.findOrCreate({ where: { userId: admin.id } });

        // 3. Clothing Categories
        const categoriesData = [
            {
                name: "Women's Wear",
                slug: "women-wear",
                description: "Effortless elegance, seasonal coats, evening dresses, and modern everyday essentials.",
                image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
            },
            {
                name: "Men's Collection",
                slug: "men-wear",
                description: "Tailored blazers, premium cotton oxford shirts, denim, and refined streetwear.",
                image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            },
            {
                name: "Kids & Teens",
                slug: "kids-wear",
                description: "Soft organic cotton knits, playful outdoor apparel, and warm winter layers.",
                image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80",
            },
            {
                name: "Shoes & Footwear",
                slug: "footwear",
                description: "Handcrafted Italian leather boots, minimalist sneakers, and formal shoes.",
                image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
            },
            {
                name: "Accessories & Bags",
                slug: "accessories",
                description: "Genuine leather totes, luxury scarves, sunglasses, and timeless wristwatches.",
                image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
            },
        ];

        const categoryMap = {};
        for (const catData of categoriesData) {
            let [cat] = await Category.findOrCreate({
                where: { slug: catData.slug },
                defaults: catData,
            });
            await cat.update(catData);
            categoryMap[catData.slug] = cat.id;
        }
        console.log("Categories updated.");

        // 4. Curated High-Fashion Clothing Products
        const productsData = [
            // Women's Collection
            {
                name: "Double-Breasted Wool Blend Trench Coat",
                slug: "double-breasted-wool-blend-trench-coat",
                categoryId: categoryMap["women-wear"],
                description: "An iconic tailored trench coat crafted from a luxurious heavy wool-blend with storm flaps, horn buttons, and a belted waist for a timeless feminine silhouette.",
                price: 189.00,
                discountPrice: 149.00,
                stock: 35,
                rating: 4.9,
                numReviews: 68,
                isFeatured: true,
                isTrending: true,
                isTopRated: true,
                colors: ["Camel", "Obsidian Black", "Sage Olive"],
                sizes: ["XS", "S", "M", "L", "XL"],
                images: [
                    "https://images.unsplash.com/photo-1539533018447-63fcce667883?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
                ],
            },
            {
                name: "Floral Silk Chiffon Evening Dress",
                slug: "floral-silk-chiffon-evening-dress",
                categoryId: categoryMap["women-wear"],
                description: "Breezy romantic midi dress cut from featherlight printed silk chiffon. Features delicate flutter sleeves, a cinched bodice, and fluid tiered skirt.",
                price: 119.00,
                discountPrice: 89.00,
                stock: 28,
                rating: 4.8,
                numReviews: 42,
                isFeatured: true,
                isTrending: true,
                isTopRated: false,
                colors: ["Emerald Floral", "Blush Pink", "Midnight Navy"],
                sizes: ["XS", "S", "M", "L"],
                images: [
                    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80",
                ],
            },
            {
                name: "Oversized Cashmere Turtleneck Sweater",
                slug: "oversized-cashmere-turtleneck-sweater",
                categoryId: categoryMap["women-wear"],
                description: "Spun from ultra-soft Grade-A Mongolian cashmere with ribbed cuffs and hem. Delivers unmatched warmth and laid-back sophistication for cooler months.",
                price: 145.00,
                discountPrice: 115.00,
                stock: 40,
                rating: 5.0,
                numReviews: 89,
                isFeatured: true,
                isTrending: false,
                isTopRated: true,
                colors: ["Cream Oat", "Heather Grey", "Warm Mocha"],
                sizes: ["S", "M", "L", "XL"],
                images: [
                    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80",
                ],
            },
            {
                name: "Pleated High-Waist Linen Trousers",
                slug: "pleated-high-waist-linen-trousers",
                categoryId: categoryMap["women-wear"],
                description: "Tailored wide-leg trousers woven from breathable European flax linen. Detailed with front pleats, slant pockets, and a neat button fly.",
                price: 85.00,
                discountPrice: 68.00,
                stock: 32,
                rating: 4.7,
                numReviews: 31,
                isFeatured: false,
                isTrending: true,
                isTopRated: false,
                colors: ["Pure White", "Desert Sand", "Terracotta"],
                sizes: ["XS", "S", "M", "L"],
                images: [
                    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80",
                ],
            },

            // Men's Collection
            {
                name: "Slim-Fit Italian Wool Blazer",
                slug: "slim-fit-italian-wool-blazer",
                categoryId: categoryMap["men-wear"],
                description: "Expertly structured single-breasted blazer woven from fine Italian wool. Features notch lapels, pick-stitching, and dual rear vents for modern dapper tailoring.",
                price: 220.00,
                discountPrice: 175.00,
                stock: 24,
                rating: 4.9,
                numReviews: 76,
                isFeatured: true,
                isTrending: true,
                isTopRated: true,
                colors: ["Navy Blue", "Charcoal Melange", "Warm Tan"],
                sizes: ["38R", "40R", "42R", "44R"],
                images: [
                    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
                ],
            },
            {
                name: "Classic Organic Cotton Oxford Shirt",
                slug: "classic-organic-cotton-oxford-shirt",
                categoryId: categoryMap["men-wear"],
                description: "The quintessential wardrobe staple. Pure organic combed cotton oxford cloth with a button-down collar, chest pocket, and garment-washed finish.",
                price: 65.00,
                discountPrice: 49.00,
                stock: 65,
                rating: 4.8,
                numReviews: 114,
                isFeatured: true,
                isTrending: false,
                isTopRated: true,
                colors: ["Sky Blue", "Crisp White", "Stripe Blue", "Soft Pink"],
                sizes: ["S", "M", "L", "XL", "XXL"],
                images: [
                    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
                ],
            },
            {
                name: "Heavyweight 450GSM Loopback Hoodie",
                slug: "heavyweight-450gsm-loopback-hoodie",
                categoryId: categoryMap["men-wear"],
                description: "Premium streetwear essential built from 450GSM French terry cotton. Generous double-lined hood, dropped shoulders, and ribbed side ribbing.",
                price: 95.00,
                discountPrice: 79.00,
                stock: 50,
                rating: 4.7,
                numReviews: 53,
                isFeatured: false,
                isTrending: true,
                isTopRated: false,
                colors: ["Washed Black", "Heather Grey", "Forest Green"],
                sizes: ["S", "M", "L", "XL", "XXL"],
                images: [
                    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
                ],
            },
            {
                name: "Vintage Washed Selvedge Denim Jacket",
                slug: "vintage-washed-selvedge-denim-jacket",
                categoryId: categoryMap["men-wear"],
                description: "Crafted on shuttle looms from 13.5oz Japanese selvedge denim. Hand-distressed with vintage faded whiskering and antique brass hardware.",
                price: 135.00,
                discountPrice: 105.00,
                stock: 30,
                rating: 4.8,
                numReviews: 39,
                isFeatured: true,
                isTrending: true,
                isTopRated: false,
                colors: ["Vintage Indigo", "Faded Black"],
                sizes: ["S", "M", "L", "XL"],
                images: [
                    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800&auto=format&fit=crop&q=80",
                ],
            },

            // Shoes & Footwear
            {
                name: "Handmade Suede Chelsea Boots",
                slug: "handmade-suede-chelsea-boots",
                categoryId: categoryMap["footwear"],
                description: "Handcrafted from Italian calf suede with Goodyear welt construction, flexible elastic side gussets, and durable crepe rubber soles.",
                price: 175.00,
                discountPrice: 139.00,
                stock: 22,
                rating: 4.9,
                numReviews: 61,
                isFeatured: true,
                isTrending: true,
                isTopRated: true,
                colors: ["Tobacco Suede", "Midnight Black", "Sand"],
                sizes: ["40 EU", "41 EU", "42 EU", "43 EU", "44 EU", "45 EU"],
                images: [
                    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80",
                ],
            },
            {
                name: "Minimalist Nappa Leather Court Sneakers",
                slug: "minimalist-nappa-leather-court-sneakers",
                categoryId: categoryMap["footwear"],
                description: "Buttery full-grain Nappa leather sneakers lined with calfskin. Clean low-profile silhouette with stitched Margom rubber cupsoles.",
                price: 130.00,
                discountPrice: 99.00,
                stock: 45,
                rating: 4.8,
                numReviews: 94,
                isFeatured: true,
                isTrending: false,
                isTopRated: true,
                colors: ["Triple White", "White / Navy Heel", "White / Gum"],
                sizes: ["40 EU", "41 EU", "42 EU", "43 EU", "44 EU"],
                images: [
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80",
                ],
            },

            // Accessories & Bags
            {
                name: "Full-Grain Leather Everyday Tote Bag",
                slug: "full-grain-leather-everyday-tote-bag",
                categoryId: categoryMap["accessories"],
                description: "Generously sized tote handmade from vegetable-tanned full-grain cowhide. Accommodates 15-inch laptops, with interior brass zip pouch and reinforced straps.",
                price: 160.00,
                discountPrice: 125.00,
                stock: 25,
                rating: 4.9,
                numReviews: 47,
                isFeatured: true,
                isTrending: true,
                isTopRated: true,
                colors: ["Cognac Tan", "Rich Black", "Burgundy"],
                sizes: ["One Size"],
                images: [
                    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80",
                ],
            },
            {
                name: "Handcrafted Acetate Sunglasses",
                slug: "handcrafted-acetate-sunglasses",
                categoryId: categoryMap["accessories"],
                description: "Hand-polished Italian cellulose acetate frames with polarized category 3 UV400 lenses and 5-barrel custom barrel hinges.",
                price: 65.00,
                discountPrice: 48.00,
                stock: 55,
                rating: 4.7,
                numReviews: 38,
                isFeatured: false,
                isTrending: true,
                isTopRated: true,
                colors: ["Havana Tortoise", "Gloss Black", "Champagne Crystal"],
                sizes: ["Standard"],
                images: [
                    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
                ],
            },

            // Kids & Toddlers
            {
                name: "Kids Warm Sherpa Fleece Zip Jacket",
                slug: "kids-warm-sherpa-fleece-zip-jacket",
                categoryId: categoryMap["kids-wear"],
                description: "Cozy teddy sherpa fleece jacket with a high mock neck, contrast nylon zip pocket, and soft stretch bindings to seal in warmth.",
                price: 45.00,
                discountPrice: 34.00,
                stock: 40,
                rating: 4.8,
                numReviews: 29,
                isFeatured: false,
                isTrending: false,
                isTopRated: true,
                colors: ["Mustard Yellow", "Navy / Red", "Cream Oatmeal"],
                sizes: ["3-4 Y", "5-6 Y", "7-8 Y", "9-10 Y", "11-12 Y"],
                images: [
                    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80",
                ],
            },
            {
                name: "Kids 100% Organic Cotton Play Romper",
                slug: "kids-100-organic-cotton-play-romper",
                categoryId: categoryMap["kids-wear"],
                description: "Ultra-gentle GOTS certified organic ribbed cotton romper with wooden front buttons and easy snap fasteners for quick changes.",
                price: 32.00,
                discountPrice: 25.00,
                stock: 35,
                rating: 4.9,
                numReviews: 24,
                isFeatured: true,
                isTrending: false,
                isTopRated: false,
                colors: ["Sage Green", "Soft Terracotta", "Sky Blue"],
                sizes: ["0-6 M", "6-12 M", "12-18 M", "18-24 M"],
                images: [
                    "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80",
                ],
            },
        ];

        for (const prodData of productsData) {
            let existingProd = await Product.findOne({ where: { slug: prodData.slug } });
            if (!existingProd) {
                await Product.create(prodData);
            } else {
                await existingProd.update(prodData);
            }
        }
        console.log("High-fashion apparel products seeded successfully.");

        console.log("Database successfully populated with luxury clothing catalog!");
    } catch (error) {
        console.error("Seeding failed:", error);
        throw error;
    }
};

// If run directly via node
if (process.argv[1]?.endsWith("seed.js")) {
    seedDatabase()
        .then(() => {
            console.log("Seed completed. Exiting.");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Seed error:", err);
            process.exit(1);
        });
}
