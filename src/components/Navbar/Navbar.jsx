/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  CogIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png"; // Import Logo
import Decrypt from "../../Decrypt";
import { useSelector } from "react-redux";

const Navbar = ({ setIsAuthenticated }) => {
  const encryptedUserData = useSelector((state) => state.userData);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(Decrypt(encryptedUserData));

    if (user) {
      const roleCode = user.ROLE_CODE;
      if (roleCode === 1) {
        setUserName([user.FNAME, " ", user.LNAME]);
        setUserRole("Super Admin");
      } else if ([2, 3, 4].includes(roleCode)) {
        setUserName(user.NGO_NAME || "NGO");
        setUserRole(
          roleCode === 2 ? "NGO Admin" : roleCode === 3 ? "NGO Staff" : "NGO CA"
        );
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/signin");
  };

  return (
    <nav className="bg-blue-900 text-white fixed top-0 left-72 right-0 z-50 h-[88px] lg:h-25 flex items-center px-6 lg:px-10 border-b border-blue-700">
      <div className="flex items-center">
        {" "}
        {/* Container for Logo & text */}
        <img
          src={Logo}
          alt="EmpowerNGO Logo"
          className="h-16 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">EmpowerNGO</h1>
          <p className="text-sm text-blue-200">
            Tech-powered Transformation for NGOs
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center space-x-6 lg:space-x-10">
        <div className="relative w-10 h-10 lg:w-12 lg:h-12 cursor-pointer">
          <BellIcon className="w-8 h-8 lg:w-10 lg:h-10 text-gray-300 hover:text-white" />
          <span className="absolute -top-1 -right-2 bg-red-600 text-white text-sm lg:text-base rounded-full px-2 lg:px-3">
            3
          </span>
        </div>
        <div className="relative w-48 lg:w-56">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center w-full h-14 lg:h-16 space-x-3 bg-blue-800 px-5 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <UserCircleIcon className="w-10 h-10 lg:w-12 lg:h-12 text-gray-300" />
            <div className="text-left hidden lg:block">
              <p className="text-base lg:text-lg font-semibold">{userName}</p>
              <p className="text-sm lg:text-base text-blue-300">{userRole}</p>
            </div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-5 w-56 lg:w-64 bg-blue-800 text-white rounded-lg shadow-lg text-lg lg:text-xl">
              <button className="w-full flex items-center px-5 py-4 lg:py-5 hover:bg-blue-700 transition">
                <CogIcon className="w-6 h-6 lg:w-7 lg:h-7 mr-3" /> My Account
              </button>
              <button className="w-full flex items-center px-5 py-4 lg:py-5 hover:bg-blue-700 transition">
                <KeyIcon className="w-6 h-6 lg:w-7 lg:h-7 mr-3" /> Reset
                Password
              </button>
              <button
                className="w-full flex items-center px-5 py-4 lg:py-5 text-red-500 hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6 lg:w-7 lg:h-7 mr-3" />{" "}
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
