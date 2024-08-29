import { Categories } from '@/interface/category.interface';
import React from 'react';

interface CategoryProps {
  onSortChange: (sortConfig: string) => void;
  categories: Categories[];
}

const Category: React.FC<CategoryProps> = ({ onSortChange, categories }) => {
  const handleSort = (sortBy: number) => {
    let category = '';
    switch (sortBy) {
      case 1:
        console.log(category, 'vegetable');
        category = 'fruits';
        break;
      case 2:
        console.log(category, 'meats');
        category = 'vegetables';
        break;
      case 3:
        console.log(category, 'fruits');
        category = 'meat';
        break;
      case 4:
        console.log(category, 'processed ingredients');
        category = 'processed ingredients';
        break;
      default:
        category = '';
        break;
    }
    onSortChange(category);
  };

  return (
    <div className="flex justify-center py-8 gap-9">
      <div className="flex justify-center items-center space-x-12">
        {categories && categories.length > 0 ? (
          categories.map((category, index) => (
            <div key={index} className="hover:font-semibold">
              <div
                className="border py-1 border-gray-900 rounded-2xl inline-flex items-center justify-center cursor-pointer transition duration-300 ease-in-out transform hover:font-semibold w-auto"
                onClick={() => handleSort(category.id)}
              >
                <span className="px-3 py-1 text-black hover:font-semibold">
                  {category.name}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div>No categories found</div>
        )}
      </div>
    </div>
  );
};

export default Category;
