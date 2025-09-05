import {hashSync} from 'bcrypt-ts-edge'

const sampleData = {
  users:[
    {
      name: 'Deekshitha',
      email:'deekshithapachigolla7271@gmail.com',
      password:hashSync('727106',10),//salt rounds:-salt is random value added to password
      //befor it to make more secure.even if two users have the same password,
      //their hashedoutputs are different.rounds is the computational complexity of hashing process.
      role:'admin'
    },
    {
      name: 'Ravikumar',
      email:'ravikumar@gmail.com',
      password:hashSync('123456',10),//salt rounds:-salt is random value added to password
      //befor it to make more secure.even if two users have the same password,
      //their hashedoutputs are different.rounds is the computational complexity of hashing process.
      role:'user'
    },
  ],
  products: [
    {
      name: 'Navy Blue Ethnic Midi Dress',

slug: 'navy-blue-ethnic-midi-dress',

category:"Women's wear,Fusion",
      description: 'Step into effortless elegance with this navy blue ethnic midi dress. Designed with a sleeveless bodice and flared silhouette, it combines the charm of traditional detailing with modern comfort. The vibrant border at the hem and subtle pocket accents add a unique touch of style. Paired with white sneakers or flats, this dress is perfect for casual outings, festive gatherings, or everyday chic wear.',
      images: [
        '/images/sample-products/Rashmika-1.jpeg',
        '/images/sample-products/Rashmika-2.jpeg',
      ],
      price: 90.99,
      brand: 'IndieThreads',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    
    {
      name: 'Polo Classic Pink Hoodie',
      slug: 'polo-classic-pink-hoodie',
      category: "Men's Sweatshirts",
      description: 'Soft, stylish, and perfect for laid-back days',
      images: [
        '/images/sample-products/p6-1.jpg',
        '/images/sample-products/p6-2.jpg',
      ],
      price: 99.99,
      brand: 'Polo',
      rating: 4.6,
      numReviews: 12,
      stock: 8,
      isFeatured: true,
      banner: null,
    },
    {
      name: 'Brooks Brothers Long Sleeved Shirt',
      slug: 'brooks-brothers-long-sleeved-shirt',
      category: "Men's Dress Shirts",
      description: 'Timeless style and premium comfort',
      images: [
        '/images/sample-products/p2-1.jpg',
        '/images/sample-products/p2-2.jpg',
      ],
      price: 85.9,
      brand: 'Brooks Brothers',
      rating: 4.2,
      numReviews: 8,
      stock: 10,
      isFeatured: true,
      banner: 'banner-2.jpg',
    },
    {
      name: "Orange & Pink Silk Cotton Saree",
      slug: "orange-pink-silk-cotton-saree",
      category: "Traditional Sarees",
      description: "A vibrant silk cotton saree in a radiant orange shade with contrasting pink borders and pallu. The saree features subtle woven motifs, paired beautifully with a matching blouse. Lightweight and elegant, it is perfect for festive occasions, cultural celebrations, and traditional gatherings",
      images: [
        '/images/sample-products/Ananthika Sanilkumar.jpeg',
        '/images/sample-products/download.jpeg',
      ],
      price: 99.95,
      brand: 'Handloom',
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Calvin Klein Slim Fit Stretch Shirt',
      slug: 'calvin-klein-slim-fit-stretch-shirt',
      category: "Men's Dress Shirts",
      description: 'Streamlined design with flexible stretch fabric',
      images: [
        '/images/sample-products/p4-1.jpg',
        '/images/sample-products/p4-2.jpg',
      ],
      price: 39.95,
      brand: 'Calvin Klein',
      rating: 3.6,
      numReviews: 5,
      stock: 10,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Polo Ralph Lauren Oxford Shirt',
      slug: 'polo-ralph-lauren-oxford-shirt',
      category: "Men's Dress Shirts",
      description: 'Iconic Polo design with refined oxford fabric',
      images: [
        '/images/sample-products/p5-1.jpg',
        '/images/sample-products/p5-2.jpg',
      ],
      price: 79.99,
      brand: 'Polo',
      rating: 4.7,
      numReviews: 18,
      stock: 6,
      isFeatured: false,
      banner: null,
    },
        {
      name: 'Tommy Hilfiger Classic Fit Dress Shirt',
      slug: 'tommy-hilfiger-classic-fit-dress-shirt',
      category: "Men's Dress Shirts",
      description: 'A perfect blend of sophistication and comfort',
      images: [
        '/images/sample-products/p3-1.jpg',
        '/images/sample-products/p3-2.jpg',
      ],
      price: 99.95,
      brand: 'Tommy Hilfiger',
      rating: 4.9,
      numReviews: 3,
      stock: 0,
      isFeatured: false,
      banner: null,
    },
    {
      name: 'Polo Sporting Stretch Shirt',
      slug: 'polo-sporting-stretch-shirt',
      category: "Men's Dress Shirts",
      description: 'Classic Polo style with modern comfort',
      images: [
        '/images/sample-products/p1-1.jpg',
        '/images/sample-products/p1-2.jpg',
      ],
      price: 59.99,
      brand: 'Polo',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    
  ],
};

export default sampleData;
