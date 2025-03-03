/* eslint-disable react/prop-types */
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../LoadingSpinner";

const Layout = ({ setIsAuthenticated }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); 
  }, []);

  if (loading) return <Loading />; 

  return (
    <div className="flex">
      <Sidebar setIsAuthenticated={setIsAuthenticated} />
      <div className="flex-grow ml-72">
        <Navbar setIsAuthenticated={setIsAuthenticated} />
        <div className="p-4 mt-20 lg:mt-24 bg-gray-300 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
