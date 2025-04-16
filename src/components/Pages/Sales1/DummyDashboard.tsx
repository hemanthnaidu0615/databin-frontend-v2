import React, { useState } from 'react';
import TopSummaryPanel from './TopSummaryPanel';
import CompanySection from './CompanySection';

const companies = ['AWD', 'AWW']; // Add more as needed

const DummyDashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Sales Dashboard</h1>

      <TopSummaryPanel />

      {companies.map((company) => (
        <CompanySection key={company} company={company} />
      ))}
    </div>
  );
};

export default DummyDashboard;
