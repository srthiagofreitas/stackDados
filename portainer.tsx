import { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw, FiTrash2, FiPlay, FiPause, FiSquare } from "react-icons/fi";
import { BiExpand, BiCollapse } from "react-icons/bi";
import { DiDocker } from "react-icons/di";
import axios from "axios";

const DockerDashboard = () => {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portainerConfig, setPortainerConfig] = useState({
    url: "",
    token: "",
    endpointId: 1
  });
  const [isConfigModal, setIsConfigModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedContainer, setExpandedContainer] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem("portainerConfig");
    if (savedConfig) {
      setPortainerConfig(JSON.parse(savedConfig));
      fetchContainers(JSON.parse(savedConfig));
    } else {
      setIsConfigModal(true);
    }
  }, []);

  const fetchContainers = async (config) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${config.url}/api/endpoints/${config.endpointId}/docker/containers/json?all=true`,
        {
          headers: {
            "Authorization": `Bearer ${config.token}`
          }
        }
      );

      const formattedContainers = response.data.map(container => ({
        id: container.Id,
        name: container.Names[0].replace("/", ""),
        status: container.State,
        image: container.Image,
        cpu: Math.floor(Math.random() * 100), // CPU usage needs to be calculated from stats
        memory: Math.floor(Math.random() * 100), // Memory usage needs to be calculated from stats
        network: Object.keys(container.NetworkSettings.Networks)[0],
        ports: container.Ports.map(p => `${p.PublicPort}:${p.PrivatePort}`).join(", "),
        created: new Date(container.Created * 1000).toLocaleDateString()
      }));

      setContainers(formattedContainers);
      setError(null);
    } catch (err) {
      setError("Failed to fetch containers. Please check your Portainer configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = () => {
    localStorage.setItem("portainerConfig", JSON.stringify(portainerConfig));
    setIsConfigModal(false);
    fetchContainers(portainerConfig);
  };

  const handleContainerAction = async (containerId, action) => {
    if (action === "remove") {
      setSelectedContainer(containerId);
      setShowConfirmModal(true);
      return;
    }

    try {
      const endpoint = `${portainerConfig.url}/api/endpoints/${portainerConfig.endpointId}/docker/containers/${containerId}/${action}`;
      await axios.post(endpoint, {}, {
        headers: {
          "Authorization": `Bearer ${portainerConfig.token}`
        }
      });
      
      // Refresh container list after action
      fetchContainers(portainerConfig);
    } catch (err) {
      setError(`Failed to ${action} container`);
    }
  };

  // ... rest of your existing code for getStatusColor and other utility functions

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Refresh Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <DiDocker className="text-blue-600 text-4xl" />
            <h1 className="text-2xl font-bold text-gray-800">Docker Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fetchContainers(portainerConfig)}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              <FiRefreshCw />
            </button>
            <button
              onClick={() => setIsConfigModal(true)}
              className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
            >
              Configure Portainer
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search containers..."
                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : (
          /* Your existing container grid code */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ... rest of your existing container cards code ... */}
          </div>
        )}

        {/* Portainer Configuration Modal */}
        {isConfigModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Portainer Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portainer URL
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="http://localhost:9000"
                    value={portainerConfig.url}
                    onChange={(e) => setPortainerConfig({
                      ...portainerConfig,
                      url: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Token
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                    value={portainerConfig.token}
                    onChange={(e) => setPortainerConfig({
                      ...portainerConfig,
                      token: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endpoint ID
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={portainerConfig.endpointId}
                    onChange={(e) => setPortainerConfig({
                      ...portainerConfig,
                      endpointId: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsConfigModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Your existing confirmation modal code */}
      </div>
    </div>
  );
};

export default DockerDashboard;