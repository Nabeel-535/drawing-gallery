const { MongoClient } = require('mongodb');

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
      query._id = { $ne: excludeId };
    }
    
    const existingPost = await db.collection('posts').findOne(query);
    if (!existingPost) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function addSlugsToExistingPosts() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/drawing-gallery';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Get all posts that don't have url_slug
    const posts = await db.collection('posts').find({ 
      $or: [
        { url_slug: { $exists: false } },
        { url_slug: null },
        { url_slug: '' }
      ]
    }).toArray();

    console.log(`Found ${posts.length} posts without slugs`);

    for (const post of posts) {
      if (!post.title) {
        console.log(`Skipping post ${post._id} - no title`);
        continue;
      }

      const baseSlug = generateSlug(post.title);
      const uniqueSlug = await ensureUniqueSlug(db, baseSlug, post._id);

      await db.collection('posts').updateOne(
        { _id: post._id },
        { $set: { url_slug: uniqueSlug } }
      );

      console.log(`Updated post "${post.title}" with slug: ${uniqueSlug}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

// Run the migration
addSlugsToExistingPosts(); 