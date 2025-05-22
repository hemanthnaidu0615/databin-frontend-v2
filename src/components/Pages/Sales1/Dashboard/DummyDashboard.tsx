import React from 'react';
import TopSummaryPanel from './TopSummaryPanel';
import CompanySection from './Enterprises';
import KPISection from './KPISection';

const companies: Array<'AWD' | 'AWW'> = ['AWD', 'AWW'];

const DummyDashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="app-section-title">Sales Dashboard</h1>

      <KPISection />

      <TopSummaryPanel />

      {companies.map((company) => (
        <CompanySection key={company} company={company} />
      ))}
    </div>
  );
};

export default DummyDashboard;
