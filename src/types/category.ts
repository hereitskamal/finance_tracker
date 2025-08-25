export interface CreateCategoryData {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateCategoryData extends CreateCategoryData {
  id: string;
}

export interface CategoryWithExpenseCount extends Category {
  _count: {
    expenses: number;
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
}
