"use client";

import React, { useEffect, useState } from "react";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

const shuffleAndLimit = (array: NewsArticle[], limit: number) => {
  return array.sort(() => Math.random() - 0.5).slice(0, limit);
};

export default function TrendingNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("Failed to load news");

        const data = await response.json();
        console.log("Total articles received:", data.results.length);

        setNews(shuffleAndLimit(data.results || [], 9));
      } catch (err) {
        setError("Failed to fetch news. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="py-10 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 mb-8">📰 Trending Health News</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {news.length > 0 ? (
              news.map((article, index) => (
                <div key={index} className="p-4 bg-gray-100 shadow-md rounded-lg hover:shadow-lg transition">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold text-gray-800">
                    {article.title?.split(" ").slice(0, 10).join(" ")}...
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {article?.description?.split(" ").slice(0, 10).join(" ") || "No description available"}...
                  </p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 inline-block">
                    Read more →
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No news found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
