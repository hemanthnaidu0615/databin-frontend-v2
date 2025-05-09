import InventoryCards from './InventoryCards';
import InventoryOverview from './InventoryOverview';
import InventoryTable from './InventoryTable';

const InventoryPage = () => {
  const filters = {
    selectedRegion: '',
    selectedSource: '',
    selectedLocation: '',
  };

  return (
    <div className="p-4 space-y-6">
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
