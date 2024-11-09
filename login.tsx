import { useState } from "react";
import { FiSearch, FiRefreshCw, FiTrash2, FiPlay, FiPause, FiSquare, FiGithub, FiMail } from "react-icons/fi";
import { BiExpand, BiCollapse } from "react-icons/bi";
import { DiDocker } from "react-icons/di";
import { FcGoogle } from "react-icons/fc";

const DockerDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("login"); // login, signup, dashboard
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [containers, setContainers] = useState([
    {
      id: "c1",
      name: "nginx-server",
      status: "running",
      image: "nginx:latest",
      cpu: 25,
      memory: 40,
      network: "bridge",
      ports: "80:80",
      created: "2 days ago"
    },
    {
      id: "c2",
      name: "mongodb",
      status: "stopped",
      image: "mongo:latest",
      cpu: 0,
      memory: 0,
      network: "host",
      ports: "27017:27017",
      created: "5 days ago"
    },
    {
      id: "c3",
      name: "redis-cache",
      status: "paused",
      image: "redis:latest",
      cpu: 15,
      memory: 30,
      network: "bridge",
      ports: "6379:6379",
      created: "1 week ago"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedContainer, setExpandedContainer] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your authentication logic here
    setIsLoggedIn(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("login");
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // Add your social authentication logic here
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "running":
        return "bg-green-500";
      case "stopped":
        return "bg-red-500";
      case "paused":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAction = (containerId, action) => {
    if (action === "remove") {
      setSelectedContainer(containerId);
      setShowConfirmModal(true);
      return;
    }
    console.log(`${action} container ${containerId}`);
  };

  const confirmRemove = () => {
    setContainers(containers.filter(c => c.id !== selectedContainer));
    setShowConfirmModal(false);
    setSelectedContainer(null);
  };

  const filteredContainers = containers.filter(container =>
    container.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderAuthForm = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center mb-8">
            <DiDocker className="text-blue-600 text-6xl" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-8">
            {currentView === "login" ? "Login to Docker Dashboard" : "Create Account"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            {currentView === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {currentView === "login" ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <FiGithub className="mr-2" />
                GitHub
              </button>
              <button
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <FcGoogle className="mr-2" />
                Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView(currentView === "login" ? "signup" : "login")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {currentView === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return renderAuthForm();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <DiDocker className="text-blue-600 text-4xl" />
            <h1 className="text-2xl font-bold text-gray-800">Docker Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search containers..."
                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search containers"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContainers.map((container) => (
            <div
              key={container.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              role="article"
              aria-label={`Container ${container.name}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        container.status
                      )}`}
                      title={`Status: ${container.status}`}
                    />
                    <h2 className="font-semibold text-lg">{container.name}</h2>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedContainer(
                        expandedContainer === container.id ? null : container.id
                      )
                    }
                    className="text-gray-500 hover:text-gray-700"
                    aria-label={`Toggle details for ${container.name}`}
                  >
                    {expandedContainer === container.id ? (
                      <BiCollapse size={20} />
                    ) : (
                      <BiExpand size={20} />
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">CPU</span>
                      <span className="text-sm text-gray-600">
                        {container.cpu}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${container.cpu}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Memory</span>
                      <span className="text-sm text-gray-600">
                        {container.memory}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 rounded-full h-2 transition-all duration-300"
                        style={{ width: `${container.memory}%` }}
                      />
                    </div>
                  </div>
                </div>

                {expandedContainer === container.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Image:</span> {container.image}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Network:</span>{" "}
                      {container.network}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Ports:</span> {container.ports}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Created:</span>{" "}
                      {container.created}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleAction(container.id, "start")}
                    className="p-2 rounded-full hover:bg-gray-100 text-green-500"
                    aria-label="Start container"
                  >
                    <FiPlay />
                  </button>
                  <button
                    onClick={() => handleAction(container.id, "pause")}
                    className="p-2 rounded-full hover:bg-gray-100 text-yellow-500"
                    aria-label="Pause container"
                  >
                    <FiPause />
                  </button>
                  <button
                    onClick={() => handleAction(container.id, "stop")}
                    className="p-2 rounded-full hover:bg-gray-100 text-red-500"
                    aria-label="Stop container"
                  >
                    <FiSquare />
                  </button>
                  <button
                    onClick={() => handleAction(container.id, "restart")}
                    className="p-2 rounded-full hover:bg-gray-100 text-blue-500"
                    aria-label="Restart container"
                  >
                    <FiRefreshCw />
                  </button>
                  <button
                    onClick={() => handleAction(container.id, "remove")}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                    aria-label="Remove container"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Confirm Container Removal
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove this container? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DockerDashboard;
