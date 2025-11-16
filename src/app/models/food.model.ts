export interface FoodCategory {
  id: string;
  name: string;
  icon: string;
  isExpanded: boolean;
  subcategories: FoodSubcategory[];
}

export interface FoodSubcategory {
  id: string;
  name: string;
  route: string;
}