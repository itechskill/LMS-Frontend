// src/components/Review.js
import React from 'react';
import './Review.css';

const Review = () => {
  // Review data array
  const reviewsData = [
    {
      id: 1,
      quote: "iTechSkill was rated as one of the most comprehensive and practical online learning platforms for mastering AI, Data Science, and emerging technologies according to our 2025 graduate survey.",
      initials: "IA",
      name: "iTechSkill Alumni",
      role: "45,320 responses collected",
      company: null
    },
    {
      id: 2,
      quote: "iTechSkill completely transformed my career trajectory. After completing the AI Mastery program, I landed a machine learning role with a 60% salary increase. The real-world projects made all the difference!",
      initials: "SZ",
      name: "Sarah Zulfiqar",
      role: "Senior ML Engineer at",
      company: "Microsoft"
    },
    {
      id: 3,
      quote: "The hands-on approach and industry-relevant curriculum at iTechSkill prepared me perfectly for my current role. The instructors are actual practitioners, not just teachers. Best ROI on education I've ever experienced.",
      initials: "JA",
      name: "Jamshaid Ali",
      role: "Cloud Solutions Architect at",
      company: "Amazon Web Services"
    },
    {
      id: 4,
      quote: "With iTechSkill, our team was able to bridge the gap between cutting-edge technology and essential soft skills. The platform has been instrumental in accelerating our digital transformation journey.",
      initials: "BW",
      name: "Bakhtawar Waraich",
      role: "Head of Learning & Development,",
      company: "North America at Deloitte Digital"
    }
  ];

  return (
    <div className="reviews-container">
      <h3 className="reviews-title">Join others transforming their lives through learning</h3>
      
      <div className="reviews-grid">
        {reviewsData.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-quote">&ldquo;</div>
            <p className="review-content">{review.quote}</p>
            <div className="review-footer">
              <div className="reviewer-avatar">
                <span className="avatar-initials">{review.initials}</span>
              </div>
              <div className="reviewer-details">
                <p className="reviewer-name">{review.name}</p>
                <p className="reviewer-role">{review.role}</p>
                {review.company && <p className="reviewer-company">{review.company}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <a href="/success-stories" className="view-all-reviews">
        View all stories →
      </a>
    </div>
  );
};

export default Review;