import React from 'react';
import PlanPrice from '../components/PlanPrice';
import CompaniesLogo from '../components/CompaniesLogo';
import Footer from '../components/Footer';
import '../components/Footer.css';
import Review from '../components/Review';

const PricingPlan = () => {
  return (
    <div className="pricing-plan-page">
     <PlanPrice/>
     <CompaniesLogo/>
     <Review/>
      <Footer />
    </div>
  );
};

export default PricingPlan;