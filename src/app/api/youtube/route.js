import { getYoutubeLink, updateYoutubeLink } from '@/lib/models/youtube';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/youtube
export async function GET() {
  try {
    const videoUrl = await getYoutubeLink();
    return Response.json({ videoUrl });
  } catch (error) {
    console.log(error)
    return Response.json({ error: 'Failed to fetch YouTube video link' }, { status: 500 });
  }
}

// POST /api/youtube
export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { videoUrl } = await request.json();
    if (!videoUrl) {
      return Response.json({ error: 'Video URL is required' }, { status: 400 });
    }

    // Basic URL validation
    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      return Response.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const result = await updateYoutubeLink(videoUrl);
    return Response.json({ success: true, result });
  } catch (error) {
    console.error('Error updating YouTube video link:', error);
    return Response.json({ error: 'Failed to update YouTube video link' }, { status: 500 });
  }
}