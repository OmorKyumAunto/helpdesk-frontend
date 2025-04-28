import { Checkbox } from "antd";
import { useState } from "react";
import { useGetTaskCategoryQuery } from "../../taskConfiguration/api/taskCategoryEndPoint";

const ListCheckbox = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { data } = useGetTaskCategoryQuery();
  console.log(data);
  console.log(selectedItems);
  const checkboxItems = data?.data || [];

  const handleCheckboxChange = (itemId: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-2xl rounded-lg">
      <div className="space-y-4">
        {checkboxItems.map((item) => (
          <label
            key={item.id}
            className="flex gap-2 w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
          >
            <Checkbox onChange={() => handleCheckboxChange(item.id)} />
            <span className="text-gray-700 font-medium group-hover:text-blue-600">
              {item.title}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ListCheckbox;
