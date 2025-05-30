import clientPromise from '../mongodb';

// Get the current YouTube video link
async function getYoutubeLink() {
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection('youtube').findOne({});
  return result?.videoUrl || null;
}

// Update the YouTube video link
async function updateYoutubeLink(videoUrl) {
  const client = await clientPromise;
  const db = client.db();
  
  // Upsert the video URL (create if doesn't exist, update if exists)
  const result = await db.collection('youtube').updateOne(
    {}, // empty filter to match any document
    { $set: { videoUrl, updatedAt: new Date() } },
    { upsert: true } // create new document if none exists
  );
  
  return result;
}

export { getYoutubeLink, updateYoutubeLink };