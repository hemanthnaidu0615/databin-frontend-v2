import React, { useState } from 'react';
import InventoryCards from './InventoryCards';
import InventoryOverview from './InventoryOverview';
import InventoryTable from './InventoryTable';

const InventoryPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const regionLocations: { [key: string]: string[] } = {
    North: [
      "Chicago, IL", "Minneapolis, MN", "Milwaukee, WI", "Detroit, MI", "Cleveland, OH",
      "Buffalo, NY", "Madison, WI", "Fargo, ND", "Green Bay, WI", "Duluth, MN"
    ],
    South: [
      "Houston, TX", "Atlanta, GA", "Dallas, TX", "Miami, FL", "Charlotte, NC",
      "San Antonio, TX", "Orlando, FL", "Nashville, TN", "New Orleans, LA", "Tampa, FL"
    ],
    East: [
      "New York, NY", "Boston, MA", "Philadelphia, PA", "Newark, NJ", "Baltimore, MD",
      "Washington, DC", "Hartford, CT", "Providence, RI", "Pittsburgh, PA", "Albany, NY"
    ],
    West: [
      "Los Angeles, CA", "San Francisco, CA", "Seattle, WA", "San Diego, CA", "Portland, OR",
      "Phoenix, AZ", "Las Vegas, NV", "Sacramento, CA", "Salt Lake City, UT", "Boise, ID"
    ]
  };

  // Combine all locations from all regions
  const allLocations = Object.values(regionLocations).flat();

  const filters = { selectedRegion, selectedSource, selectedLocation };

  return (
    <div className="p-4 space-y-6">
      {/* Global Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Region Dropdown */}
        <select
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setSelectedLocation('');
          }}
          className="px-4 py-2 text-sm rounded-md bg-gray-800 text-white border border-gray-600"
        >
          <option value="">All Regions</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </select>

        {/* Source Dropdown */}
        <select
          value={selectedSource}
          onChange={(e) => {
            setSelectedSource(e.target.value);
            setSelectedLocation('');
          }}
          className="px-4 py-2 text-sm rounded-md bg-gray-800 text-white border border-gray-600"
        >
          <option value="">All Sources</option>
          <option value="Warehouse">Warehouse</option>
        </select>

        {/* Location Dropdown - shows only when source is Warehouse */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-4 py-2 text-sm rounded-md bg-gray-800 text-white border border-gray-600"
          disabled={selectedSource !== 'Warehouse'}
        >
          <option value="">All Locations</option>
          {selectedSource === 'Warehouse' &&
            allLocations.map((loc, idx) => (
              <option key={idx} value={loc}>{loc}</option>
            ))
          }
        </select>
      </div>

      {/* Section 1: Top Summary Cards */}
      <InventoryCards />

      {/* Section 2: Overview Charts */}
      <InventoryOverview filters={filters} />

      {/* Section 3: Full Inventory Table */}
      <InventoryTable filters={filters} />
    </div>
  );
};

export default InventoryPage;
