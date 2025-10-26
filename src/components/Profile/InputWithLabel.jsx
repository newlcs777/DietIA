const InputWithLabel = ({ label, value, onChange, type = "text", placeholder }) => {
  return (
    <div className="w-full sm:w-64 mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1 tracking-tight">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-[#F5BA45] focus:border-[#F5BA45]
                   text-sm text-gray-800 font-sans placeholder-gray-400 transition-all duration-200
                   hover:shadow-md"
      />
    </div>
  );
};

export default InputWithLabel;
