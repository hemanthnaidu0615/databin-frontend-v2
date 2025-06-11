import React, { useEffect } from 'react';
import TopSummaryPanel from './TopSummaryPanel';
import CompanySection from './Enterprises';
import KPISection from './KPISection';

const companies: Array<'AWD' | 'AWW'> = ['AWD', 'AWW'];

const DummyDashboard: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);  
  }, []);

  return (
    <div className="space-y-6">
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
