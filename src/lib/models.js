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

// Helper function to ensure unique category slug
async function ensureUniqueCategorySlug(db, baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const query = { custom_url: slug };
    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) };
    }
    
    const existingCategory = await db.collection('categories').findOne(query);
    if (!existingCategory) {
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
  
  // Get only published posts for public access
  const posts = await db.collection('posts').find({ status: "Published" }).sort({ createdAt: -1 }).toArray();
  
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

// Admin function to get all posts including drafts
export async function getAllPostsWithCategoryAdmin() {
  const client = await clientPromise;
  const db = client.db();
  
  // Get all posts including drafts for admin access
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
  return await db.collection('posts').find({ categoryId: categoryId, status: "Published" }).sort({ createdAt: -1 }).toArray();
}

export async function getPostsByCategoryPaginated(categoryId, page = 1, limit = 20) {
  const client = await clientPromise;
  const db = client.db();
  
  const skip = (page - 1) * limit;
  const query = { categoryId: categoryId, status: "Published" };
  
  // Get total count for pagination
  const totalPosts = await db.collection('posts').countDocuments(query);
  const totalPages = Math.ceil(totalPosts / limit);
  
  // Get posts with pagination
  const posts = await db.collection('posts')
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  
  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }
  };
}

export async function getPostsByCategoryWithCategory(categoryId) {
  const client = await clientPromise;
  const db = client.db();
  
  // Get only published posts by category for public access
  const posts = await db.collection('posts').find({ categoryId: categoryId, status: "Published" }).sort({ createdAt: -1 }).toArray();
  
  // Get the specific category
  const category = await db.collection('categories').findOne({ _id: new ObjectId(categoryId) });
  
  // Populate posts with category information
  const populatedPosts = posts.map(post => ({
    ...post,
    category: category
  }));
  
  return populatedPosts;
}

// Admin function to get all posts by category including drafts
export async function getPostsByCategoryWithCategoryAdmin(categoryId) {
  const client = await clientPromise;
  const db = client.db();
  
  // Get all posts by category including drafts for admin access
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
  
  // Check if id is a valid ObjectId format
  if (!ObjectId.isValid(id)) {
    return null;
  }
  
  return await db.collection('posts').findOne({ _id: new ObjectId(id) });
}

export async function getPostByIdWithCategory(id) {
  const client = await clientPromise;
  const db = client.db();
  
  // Check if id is a valid ObjectId format
  if (!ObjectId.isValid(id)) {
    return null;
  }
  
  // Get the published post for public access
  const post = await db.collection('posts').findOne({ _id: new ObjectId(id), status: "Published" });
  
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

// Admin function to get post by ID including drafts
export async function getPostByIdWithCategoryAdmin(id) {
  const client = await clientPromise;
  const db = client.db();
  
  // Check if id is a valid ObjectId format
  if (!ObjectId.isValid(id)) {
    return null;
  }
  
  // Get the post regardless of status for admin access
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
  
  // Get the published post by slug for public access
  const post = await db.collection('posts').findOne({ url_slug: slug, status: "Published" });
  
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

// Admin function to get post by slug including drafts
export async function getPostBySlugWithCategoryAdmin(slug) {
  const client = await clientPromise;
  const db = client.db();
  
  // Get the post by slug regardless of status for admin access
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
  
  // Use provided url_slug or generate from title
  let url_slug;
  if (postData.url_slug) {
    // If url_slug is provided, ensure it's unique
    url_slug = await ensureUniqueSlug(db, postData.url_slug);
  } else {
    // Generate URL slug from title if no url_slug is provided
    const baseSlug = generateSlug(postData.title);
    url_slug = await ensureUniqueSlug(db, baseSlug);
  }
  
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
  
  let updateData = { ...postData };
  
  // Only generate URL slug from title if no url_slug is provided
  // This allows manual slug editing while maintaining auto-generation for new posts
  if (postData.title && !postData.url_slug) {
    const baseSlug = generateSlug(postData.title);
    const url_slug = await ensureUniqueSlug(db, baseSlug, id);
    updateData.url_slug = url_slug;
  } else if (postData.url_slug) {
    // If url_slug is provided, ensure it's unique (excluding current post)
    const url_slug = await ensureUniqueSlug(db, postData.url_slug, id);
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
  
  // Check if id is a valid ObjectId format (24 character hex string)
  if (!ObjectId.isValid(id)) {
    return null;
  }
  
  return await db.collection('categories').findOne({ _id: new ObjectId(id) });
}

export async function getCategoryByCustomUrl(customUrl) {
  const client = await clientPromise;
  const db = client.db();
  return await db.collection('categories').findOne({ custom_url: customUrl });
}

export async function createCategory(categoryData) {
  const client = await clientPromise;
  const db = client.db();
  
  // Generate custom_url slug from name if not provided
  let custom_url = categoryData.custom_url;
  if (!custom_url && categoryData.name) {
    custom_url = generateSlug(categoryData.name);
  }
  
  // Ensure unique custom_url
  if (custom_url) {
    custom_url = await ensureUniqueCategorySlug(db, custom_url);
  }
  
  const result = await db.collection('categories').insertOne({
    ...categoryData,
    custom_url,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result;
}

export async function updateCategory(id, categoryData) {
  const client = await clientPromise;
  const db = client.db();
  
  let updateData = { ...categoryData };
  
  // Handle custom_url updates
  if (categoryData.name && !categoryData.custom_url) {
    // Generate from name if no custom_url provided
    const baseSlug = generateSlug(categoryData.name);
    updateData.custom_url = await ensureUniqueCategorySlug(db, baseSlug, id);
  } else if (categoryData.custom_url) {
    // Ensure provided custom_url is unique
    updateData.custom_url = await ensureUniqueCategorySlug(db, categoryData.custom_url, id);
  }
  
  const result = await db.collection('categories').updateOne(
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

export async function deleteCategory(id) {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
  return result;
}

// New function for paginated posts with filtering and sorting
export async function getPostsWithCategoryPaginated({
  page = 1,
  limit = 20,
  sort = 'newest',
  category = null,
  search = null
}) {
  const client = await clientPromise;
  const db = client.db();
  
  // Build query filter
  let query = { status: "Published" };
  
  // Add category filter if specified
  if (category && category !== 'all') {
    query.categoryId = category;
  }
  
  // Add search filter if specified
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { tags: { $in: [searchRegex] } }
    ];
  }
  
  // Build sort object
  let sortObj = {};
  switch (sort) {
    case 'newest':
      sortObj = { createdAt: -1 };
      break;
    case 'oldest':
      sortObj = { createdAt: 1 };
      break;
    case 'a-z':
      sortObj = { title: 1 };
      break;
    case 'z-a':
      sortObj = { title: -1 };
      break;
    default:
      sortObj = { createdAt: -1 };
  }
  
  // Calculate pagination
  const skip = (page - 1) * limit;
  
  // Get total count for pagination
  const totalPosts = await db.collection('posts').countDocuments(query);
  const totalPages = Math.ceil(totalPosts / limit);
  
  // Get posts with pagination
  const posts = await db.collection('posts')
    .find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .toArray();
  
  // Get all categories for population
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
  
  return {
    posts: populatedPosts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }
  };
}