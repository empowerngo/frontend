const renderInputField = (
  register,
  errors,
  label,
  name,
  validation,
  type = "text",
  placeholder = "",
  Icon,
  selectProps // Add selectProps for dropdown options
) => {
  const maxLength = validation?.maxLength?.value || undefined;
  const minLength = validation?.minLength?.value || undefined;
  const pattern = validation?.pattern?.value || undefined;

  if (type === "select") {
    return (
      <div>
        <label className="block font-semibold text-gray-800">{label}</label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          )}
          <select
            {...register(name, validation)}
            className="w-full border p-2 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{placeholder}</option>
            {selectProps?.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.displayValue}
              </option>
            ))}
          </select>
        </div>
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
        )}
      </div>
    );
  }

  if (type === "date") {
    return (
      <div>
        <label className="block font-semibold text-gray-800">{label}</label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          )}
          <input
            type="date"
            {...register(name, validation)}
            className="w-full border p-2 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {errors[name] && (
          <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block font-semibold text-gray-800">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        )}
        <input
          type={type}
          {...register(name, validation)}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          // pattern={pattern}
          className="w-full border p-2 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default renderInputField;
