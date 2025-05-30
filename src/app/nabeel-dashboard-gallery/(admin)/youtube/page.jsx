'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function YouTubeSettings() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update video URL');
      }

      toast.success('YouTube video link updated successfully');
      setVideoUrl('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Update YouTube Video
          </h3>
        </div>
        <div className="p-6.5">
          <form onSubmit={handleSubmit}>
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                YouTube Video URL
                <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Video'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}