import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  Bars3Icon,
  NewspaperIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  roleColors,
  roleNames,
  roleShortForms,
  menuItems,
} from "../../utils/constants";
import Loading from "../LoadingSpinner";
import "./style.css";
import Logo from "../../assets/Logo.png"; // Import Logo

const iconComponents = {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  NewspaperIcon,
};

const Sidebar = ({ setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const user = useMemo(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      FNAME: "Admin User",
      NGO_NAME: "Default NGO",
      ROLE_CODE: 1,
    };
    return {
      ...storedUser,
      shortForm: roleShortForms[storedUser.ROLE_CODE] || "??",
    };
  }, []);

  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleNavigation = useCallback(
    (route) => navigate(route === "/dashboard" ? "/" : route),
    [navigate]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/signin");
  }, [navigate, setIsAuthenticated]);

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user.ROLE_CODE)
  );

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed z-50 p-3 m-3 md:hidden bg-blue-800 rounded-lg text-white shadow-lg hover:bg-blue-700 transition"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-blue-900 text-white transition-all duration-300 z-40 shadow-lg flex flex-col ${
          isOpen ? "w-72" : "-translate-x-full"
        } md:translate-x-0`}
      >
       

        <div className="p-5 flex items-center space-x-4 border-b border-blue-700 z-50 h-24 lg:h-25">
          <div
            className={`w-12 h-12 ${
              roleColors[user.ROLE_CODE] || "bg-gray-600"
            } rounded-full flex items-center justify-center text-xl font-semibold`}
          >
            {user.shortForm}
          </div>
          <div>
            <p className="text-lg font-semibold">
              {[user.FNAME, " ", user.LNAME]}
            </p>
            <p className="text-sm text-blue-300">
              {roleNames[user.ROLE_CODE] || "Unknown Role"}
            </p>
          </div>
        </div>

        <div className="flex-grow p-4 space-y-2 overflow-auto sidebar-content">
          {filteredMenuItems.map((item, index) => {
            const IconComponent = iconComponents[item.icon];
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.route)}
                className="w-full flex items-center p-3 rounded-lg text-lg hover:bg-blue-800 transition-all"
              >
                <div className="flex items-center space-x-3">
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 text-blue-400" />
                  )}
                  <span>{item.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 bg-red-600 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" /> Logout
          </button>
          <p className="text-sm text-blue-300 text-center mt-3">
            © 2025 EMPOWER-NGO v1.0
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
