export const UserStats = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Account Statistics
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-600">Total Rides</p>
          <p className="text-2xl font-semibold text-blue-900">0</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-green-600">Completed Rides</p>
          <p className="text-2xl font-semibold text-green-900">0</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-yellow-600">Average Rating</p>
          <p className="text-2xl font-semibold text-yellow-900">N/A</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-purple-600">Total Distance</p>
          <p className="text-2xl font-semibold text-purple-900">0 km</p>
        </div>
      </div>
    </div>
  );
};
