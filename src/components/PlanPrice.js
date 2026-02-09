// components/PlanPrice.js
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import './PlanPrice.css';

const PlanPrice = () => {

  const handleContactClick = () => {
    // Navigate to contact page
    window.location.href = '/Contact'; // or your actual contact page route
  };
  const deploymentPlans = [
    {
      id: 1,
      name: "Team Plan",
      targetAudience: "2 to 50 people - For your team",
      pricing: "$30.00 a month per user",
      billingNote: "Billed annually. Cancel anytime.",
      features: [
        "Access to 13,000+ top courses",
        "Certification prep",
        "Goal-focused recommendations",
        "AI-powered coaching",
        "Analytics and adoption reports"
      ],
      buttonText: "Try it free",
      buttonAction: () => console.log("Try Team Plan"),
      color: "#5624d0"
    },
    {
      id: 2,
      name: "Enterprise Plan",
      targetAudience: "More than 20 people - For your whole organization",
      pricing: "Contact sales for pricing",
      billingNote: null,
      features: [
        "Access to 30,000+ top courses",
        "Certification prep",
        "Goal-focused recommendations",
        "AI-powered coaching",
        "Advanced analytics and insights",
        "Dedicated customer success team",
        "Customizable content",
        "Hands-on tech training with add-on",
        "Strategic implementation services with add-on"
      ],
      buttonText: "Request a demo",
      buttonAction: () => console.log("Request Enterprise Demo"),
      color: "#5624d0"
    },
    {
      id: 3,
      name: "AI Fluency",
      targetAudience: "From AI foundations to Enterprise transformation",
      pricing: null,
      billingNote: null,
      sections: [
        {
          title: "AI Readiness Collection",
          audience: "More than 100 people",
          description: "Build org-wide AI fluency fast with 50 curated courses + AI Assistant to accelerate learning."
        },
        {
          title: "AI Growth Collection",
          audience: "More than 20 people",
          description: "Scale AI and technical expertise with 800+ specialized courses and 30+ role-specific learning paths in multiple languages."
        }
      ],
      buttonText: "Contact Us",
      buttonAction: handleContactClick, // Changed to use the navigation function
      color: "#5624d0"
    }
  ];
  return (
    <div className="deployment-strategies-section">
      <div className="deployment-container">
        <div className="deployment-header">
          <h2 className="deployment-main-title">
            Grow your team's skills and your business
          </h2>
          <p className="deployment-subtitle">
            Reach goals faster with one of our plans or programs. Try one free today or contact sales to learn more.
          </p>
        </div>

        <div className="deployment-plans-grid">
          {deploymentPlans.map((plan) => (
            <div key={plan.id} className="deployment-plan-card">
              <div className="plan-header">
                <div className="plan-icon-container" style={{ backgroundColor: plan.color }}>
                  {/* Icon can be added here if needed */}
                </div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-audience">{plan.targetAudience}</p>
              </div>

              <div className="plan-cta-container">
                <button 
                  className="plan-cta-button"
                  onClick={plan.buttonAction}
                >
                  {plan.buttonText}
                </button>
              </div>
              
              <div className="plan-body">
                {plan.pricing && (
                  <div className="plan-pricing">
                    <p className="pricing-amount">{plan.pricing}</p>
                    {plan.billingNote && (
                      <p className="billing-note">{plan.billingNote}</p>
                    )}
                  </div>
                )}

                {plan.features && (
                  <ul className="plan-features-list">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="plan-feature-item">
                        <FaCheck className="plan-feature-check-icon" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {plan.sections && (
                  <div className="plan-sections">
                    {plan.sections.map((section, index) => (
                      <div key={index} className="plan-section">
                        <h4 className="plan-section-title">
                          {section.title}
                        </h4>
                        <p className="plan-section-audience">
                          {section.audience}
                        </p>
                        <p className="section-description">{section.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanPrice;