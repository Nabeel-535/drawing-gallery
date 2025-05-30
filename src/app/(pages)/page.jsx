"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import YouTubeVideo from '@/components/youtube/YouTubeVideo';

export default function HomePage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest posts
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        
        if (data.success && data.posts) {
          // Get the latest 10 posts
          setLatestPosts(data.posts.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  const getMainImage = (post) => {
    return post.featuredImage || "/placeholder-image.jpg";
  };
  return (
    <div className="mainbg">
      {/* SEO Meta Tags would be in layout or head */}
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-red-600/10 to-orange-600/10 overflow-hidden">
          {/* <div className="absolute -z-1 inset-0 "></div> */}
          <div className="container mx-auto px-4 py-20 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Drawing Gallery
                  </span>
                  <br />
                  <span className="text-3xl md:text-4xl lg:text-5xl text-gray-700">
                    YouTube Channel
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
                  Welcome to Drawing Gallery - your ultimate YouTube destination for free printable coloring pages, 
                  step-by-step drawing tutorials, and creative art resources. Subscribe to our channel for weekly 
                  drawing lessons and download thousands of free coloring sheets!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="https://youtube.com/@Drawing-Gallery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-8 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>Subscribe to Channel</span>
                  </a>
                  <Link
                    href="/gallery"
                    className="px-8 py-4 border-2 border-red-300 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200 text-red-700"
                  >
                    View All Coloring Pages
                  </Link>
                </div>
              </div>
              
              {/* YouTube Video Component */}
              <YouTubeVideo />
            </div>
          </div>
        </section>

        
        {/* Latest Posts Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Drawing Tutorials & Coloring Pages
              </h2>
              
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading latest posts...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                  {latestPosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/post/${post.url_slug}`}
                      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={getMainImage(post)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        />
                      

                        {/* Category Badge */}
                        {post.category && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {post.category.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 text-center transition-colors">
                          {post.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                  <Link
                    href="/gallery"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    <span>View All Coloring Pages</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* AdSense Ad Space */}
        {/* <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Advertisement Space</p>
              <div className="h-24 bg-gray-100 rounded mt-2"></div>
            </div>
          </div>
        </section> */}


        {/* YouTube Channel Features */}
        <section className="py-20 bg-white/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What You'll Find on Our YouTube Channel
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Subscribe to Drawing Gallery for weekly tutorials, free printable resources, and step-by-step drawing guides perfect for all skill levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <article className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Coloring Pages</h3>
                <p className="text-gray-600">
                  Download thousands of free printable coloring pages for kids and adults. New designs added weekly with our YouTube tutorials.
                </p>
              </article>

              {/* Feature 2 */}
              <article className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Drawing Tutorials</h3>
                <p className="text-gray-600">
                  Step-by-step video tutorials on YouTube teaching you how to draw characters, animals, and objects from basic shapes.
                </p>
              </article>

              {/* Feature 3 */}
              <article className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tracing Worksheets</h3>
                <p className="text-gray-600">
                  Printable tracing sheets designed to help beginners practice drawing with clear outlines and guided exercises.
                </p>
              </article>

              {/* Feature 4 */}
              <article className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Art Tips & Techniques</h3>
                <p className="text-gray-600">
                  Learn professional drawing techniques, coloring tips, and creative ideas through our comprehensive YouTube video series.
                </p>
              </article>
            </div>
          </div>
        </section>


        {/* AdSense Ad Space */}
        {/* <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Advertisement Space</p>
              <div className="h-32 bg-gray-100 rounded mt-2"></div>
            </div>
          </div>
        </section> */}

        {/* YouTube CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Request Your Custom Drawing!
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Have a specific drawing in mind? We can create custom artwork just for you! 
              Whether it's a portrait, landscape, or any creative concept - we're here to bring your ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('request-drawing-btn').click()}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-white text-green-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Request Now</span>
              </button>
              <Link
                href="/gallery"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-200"
              >
                View Our Gallery
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section id="about" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                About Drawing Gallery YouTube Channel
              </h2>
              <div className="prose prose-lg mx-auto">
                <p className="text-gray-600 mb-4">
                  Drawing Gallery is a popular YouTube channel dedicated to teaching drawing and providing free printable coloring pages 
                  for artists of all ages. Our channel features step-by-step drawing tutorials, coloring page showcases, and creative 
                  art techniques that help viewers improve their artistic skills.
                </p>
                <p className="text-gray-600 mb-4">
                  Whether you're a beginner looking to learn basic drawing techniques or an experienced artist seeking new inspiration, 
                  our YouTube videos provide clear, easy-to-follow instructions. We cover a wide range of subjects including cartoon 
                  characters, animals, landscapes, and abstract designs.
                </p>
                <p className="text-gray-600">
                  All our coloring pages and tracing worksheets are available for free download, making Drawing Gallery your go-to 
                  resource for printable art activities. Subscribe to our YouTube channel and join our growing community of artists!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">1000+</div>
                <div className="text-gray-600">Free Coloring Pages</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">500+</div>
                <div className="text-gray-600">YouTube Videos</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">150K+</div>
                <div className="text-gray-600">YouTube Subscribers</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10M+</div>
                <div className="text-gray-600">Views</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}