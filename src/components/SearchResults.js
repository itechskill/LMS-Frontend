// components/SearchResults.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState({
    courses: [],
    videos: [],
    trending: [],
    demoLectures: []
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Extract search query from URL
  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  // Mock search function - replace with actual API calls
  const performSearch = async (searchQuery) => {
    setLoading(true);
    
    // In real app, you would:
    // 1. Call your backend API
    // 2. Search across all collections (courses, videos, etc.)
    // 3. Return unified results
    
    try {
      // Example mock data
      const mockResults = {
        courses: [
          { id: 1, title: 'React Course', type: 'course', category: 'Programming' },
          { id: 2, title: 'JavaScript Mastery', type: 'course', category: 'Web Development' }
        ],
        videos: [
          { id: 1, title: 'React Hooks Tutorial', type: 'video', source: 'YouTube' },
          { id: 2, title: 'CSS Grid Guide', type: 'video', source: 'YouTube' }
        ],
        trending: [
          { id: 1, title: 'AI & Machine Learning', type: 'trending', views: 10000 },
          { id: 2, title: 'Web3 Development', type: 'trending', popularity: 'High' }
        ],
        demoLectures: [
          { id: 1, title: 'React Intro Demo', type: 'demo', course: 'React Course' },
          { id: 2, title: 'Node.js Basics', type: 'demo', course: 'Backend Development' }
        ]
      };

      // Filter mock data based on search query
      const filteredResults = {
        courses: mockResults.courses.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        videos: mockResults.videos.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        trending: mockResults.trending.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        demoLectures: mockResults.demoLectures.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.course.toLowerCase().includes(searchQuery.toLowerCase())
        )
      };

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-results-container">
      <h2>Search Results for "{query}"</h2>
      
      {loading ? (
        <p>Searching...</p>
      ) : (
        <>
          {/* Courses Section */}
          {searchResults.courses.length > 0 && (
            <div className="results-section">
              <h3>Courses ({searchResults.courses.length})</h3>
              {searchResults.courses.map(course => (
                <div key={course.id} className="result-item">
                  <h4>{course.title}</h4>
                  <p>Category: {course.category}</p>
                </div>
              ))}
            </div>
          )}

          {/* Videos Section */}
          {searchResults.videos.length > 0 && (
            <div className="results-section">
              <h3>YouTube Videos ({searchResults.videos.length})</h3>
              {searchResults.videos.map(video => (
                <div key={video.id} className="result-item">
                  <h4>{video.title}</h4>
                  <p>Source: {video.source}</p>
                </div>
              ))}
            </div>
          )}

          {/* Demo Lectures Section */}
          {searchResults.demoLectures.length > 0 && (
            <div className="results-section">
              <h3>Demo Lectures ({searchResults.demoLectures.length})</h3>
              {searchResults.demoLectures.map(lecture => (
                <div key={lecture.id} className="result-item">
                  <h4>{lecture.title}</h4>
                  <p>From: {lecture.course}</p>
                </div>
              ))}
            </div>
          )}

          {/* Trending Courses Section */}
          {searchResults.trending.length > 0 && (
            <div className="results-section">
              <h3>Trending ({searchResults.trending.length})</h3>
              {searchResults.trending.map(trend => (
                <div key={trend.id} className="result-item">
                  <h4>{trend.title}</h4>
                  {trend.views && <p>Views: {trend.views}</p>}
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {Object.values(searchResults).every(arr => arr.length === 0) && (
            <p>No results found for "{query}"</p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;