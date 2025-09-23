// src/components/Category.jsx
import React from "react";

function Category({ age }: { age: number }) {
  if (age < 18) return <span className="category-child">child</span>;
  else if (age >= 18 && age <= 60) return <span className="category-young">young</span>;
  else if (age > 150) return <span className="  ">budhe sale nikal yaha se</span>;
  return <span className="category-elder">elder</span>;
}

export default Category;