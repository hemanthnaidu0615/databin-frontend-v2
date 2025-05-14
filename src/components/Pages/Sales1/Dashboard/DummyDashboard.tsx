import React, { useState } from 'react';
import TopSummaryPanel from './TopSummaryPanel';
import CompanySection from './CompanySection';
import KPISection from './KPISection';

const DummyDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<string[]>(['AWD', 'AWW']);

  const addCompany = () => {
    const newCompany = prompt('Enter new company name:');
    if (newCompany && !companies.includes(newCompany)) {
      setCompanies([...companies, newCompany]);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Sales Dashboard</h1>
        <button
          onClick={addCompany}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Company
        </button>
      </div>

      <KPISection />

      <TopSummaryPanel />

      {companies.map((company) => (
        <CompanySection key={company} company={company} />
      ))}
    </div>
  );
};

export default DummyDashboard;
