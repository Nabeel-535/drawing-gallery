import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

// Helper function to generate URL slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to ensure unique slug
async function ensureUniqueSlug(db, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const query = { url_slug: slug };
    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }
    
    const existingPost = await db.collection('posts').findOne(query);
    if (!existingPost) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Post model functions
export async function getPosts() {
  const client = await clientPromise;
  const db = client.db();
  
  // Get all posts
  const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).toArray();
  
  // Get all categories
  const categories = await db.collection('categories').find({}).toArray();
  
  // Create a category lookup map
  const categoryMap = {};
  categories.forEach(category => {
    categoryMap[category._id.toString()] = category;
  });
  
  // Populate posts with category information
  const populatedPosts = posts.map(post => ({
    ...post,
    category: categoryMap[post.categoryId] || null
  }));
  
  return populatedPosts;
}

export async function getPostsWithCategory() {
  const client = await clientPromise;
  const db = client.db();
  
  // Get all posts
  const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).toArray();
  
  // Get all categories
  const categories = await db.collection('categories').find({}).toArray();
  
  // Create a category lookup map
  const categoryMap = {};
  categories.forEach(category => {
    categoryMap[category._id.toString()] = category;
  });
  
  
  // Populate posts with category information
  const populatedPosts = posts.map(post => ({
    ...post,
    category: categoryMap[post.categoryId] || null
  }));
  
  return populatedPosts;
}

export async function getPostsByCategory(categoryId) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('posts').find({ categoryId: categoryId }).sort({ createdAt: -1 }).toArray();
}

export async function getPostsByCategoryWithCategory(categoryId) {
  const client = await clientPromise;
  const db = client.db();
  
  // Get posts by category
  const posts = await db.collection('posts').find({ categoryId: categoryId }).sort({ createdAt: -1 }).toArray();
  
  // Get the specific category
  const category = await db.collection('categories').findOne({ _id: new ObjectId(categoryId) });
  
  // Populate posts with category information
  const populatedPosts = posts.map(post => ({
    ...post,
    category: category
  }));
  
  return populatedPosts;
}

export async function getPostById(id) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('posts').findOne({ _id: new ObjectId(id) });
}

export async function getPostByIdWithCategory(id) {
  const client = await clientPromise;
  const db = client.db();
  
  // Get the post
  const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
  
  if (!post) {
    return null;
  }
  
  // Get the category if categoryId exists
  let category = null;
  if (post.categoryId) {
    category = await db.collection('categories').findOne({ _id: new ObjectId(post.categoryId) });
  }
  
  // Return post with populated category
  return {
    ...post,
    category: category
  };
}

export async function getPostBySlugWithCategory(slug) {
  const client = await clientPromise;
  const db = client.db();
  
  // Get the post by slug
  const post = await db.collection('posts').findOne({ url_slug: slug });
  
  if (!post) {
    return null;
  }
  
  // Get the category if categoryId exists
  let category = null;
  if (post.categoryId) {
    category = await db.collection('categories').findOne({ _id: new ObjectId(post.categoryId) });
  }
  
  // Return post with populated category
  return {
    ...post,
    category: category
  };
}

export async function createPost(postData) {
  const client = await clientPromise;
  const db = client.db();
  
  // Generate URL slug from title
  const baseSlug = generateSlug(postData.title);
  const url_slug = await ensureUniqueSlug(db, baseSlug);
  
  // Ensure section1_images have proper structure
  if (postData.section1_images) {
    postData.section1_images = postData.section1_images.map((img, index) => ({
      main_image_url: img.main_image_url || '',
      title: img.title || '',
      imageUrl: img.imageUrl || '',
      pdfUrl: img.pdfUrl || '',
      priority: img.priority || index + 1
    }));
  }
  
  // Ensure section2_images have proper structure
  if (postData.section2_images) {
    postData.section2_images = postData.section2_images.map((img, index) => ({
      imageUrl: img.imageUrl || '',
      title: img.title || '',
      description: img.description || '',
      priority: img.priority || index + 1
    }));
  }
  
  const result = await db.collection('posts').insertOne({
    ...postData,
    url_slug,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result;
}

export async function updatePost(id, postData) {
  const client = await clientPromise;
  const db = client.db();
  
  // Generate new URL slug if title has changed
  let updateData = { ...postData };
  if (postData.title) {
    const baseSlug = generateSlug(postData.title);
    const url_slug = await ensureUniqueSlug(db, baseSlug, id);
    updateData.url_slug = url_slug;
  }
  
  // Ensure section1_images have proper structure
  if (updateData.section1_images) {
    updateData.section1_images = updateData.section1_images.map((img, index) => ({
      main_image_url: img.main_image_url || '',
      title: img.title || '',
      imageUrl: img.imageUrl || '',
      pdfUrl: img.pdfUrl || '',
      priority: img.priority || index + 1
    }));
  }
  
  // Ensure section2_images have proper structure
  if (updateData.section2_images) {
    updateData.section2_images = updateData.section2_images.map((img, index) => ({
      imageUrl: img.imageUrl || '',
      title: img.title || '',
      description: img.description || '',
      priority: img.priority || index + 1
    }));
  }
  
  const result = await db.collection('posts').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...updateData,
        updatedAt: new Date()
      } 
    }
  );
  return result;
}

export async function deletePost(id) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
  return result;
}

// Category model functions
export async function getCategories() {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('categories').find({}).sort({ name: 1 }).toArray();
}

export async function getCategoryById(id) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('categories').findOne({ _id: new ObjectId(id) });
}

export async function createCategory(categoryData) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('categories').insertOne({
    ...categoryData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result;
}

export async function updateCategory(id, categoryData) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('categories').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: {
        ...categoryData,
        updatedAt: new Date()
      } 
    }
  );
  return result;
}

export async function deleteCategory(id) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
  return result;
}