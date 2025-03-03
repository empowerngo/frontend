const CustomButton = ({ children, onClick, className = "", type = "button" }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-10 rounded-lg hover:opacity-90 text-xl font-bold shadow-md ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default CustomButton;
  