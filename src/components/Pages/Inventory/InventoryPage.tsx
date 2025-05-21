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
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 overflow-x-hidden">
      <InventoryCards />

      <div className="overflow-x-auto">
        <InventoryOverview filters={filters} />
      </div>

      <div className="overflow-x-auto">
        <InventoryTable filters={filters} />
      </div>
    </div>
  );
};

export default InventoryPage;
