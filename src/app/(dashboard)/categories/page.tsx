"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { Category } from "@/types";
import { Plus, Tag, X, Check, Palette, Smile, Star } from "lucide-react";

const PRESET_COLORS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
];

const PRESET_ICONS = [
  "🍕",
  "🚗",
  "🛍️",
  "📋",
  "🎬",
  "🏠",
  "⚡",
  "📱",
  "💊",
  "🎓",
  "🎯",
  "🎨",
  "🎵",
  "✈️",
  "🏃",
  "☕",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: PRESET_COLORS[0],
    icon: PRESET_ICONS[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    setIsSubmitting(true);
    try {
      await apiClient.createCategory(newCategory);
      setNewCategory({
        name: "",
        color: PRESET_COLORS[0],
        icon: PRESET_ICONS[0],
      });
      setIsAddingCategory(false);
      loadCategories();
    } catch (error) {
      console.error("Failed to create category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Responsive Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">
            Categories
          </h1>
          <p className="text-gray-500 mt-1 sm:mt-2 font-light text-sm sm:text-base">
            Organize your expenses with custom categories
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="bg-black hover:bg-gray-800 text-white rounded-full px-6 sm:px-8 py-2 sm:py-3 font-medium w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add Category</span>
          </Button>
        </div>
      </div>

      {/* Responsive Add Category Form */}
      {isAddingCategory && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-blue-50 rounded-xl sm:rounded-2xl">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-medium text-gray-900">
                  Create Category
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Choose a name, icon, and color
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingCategory(false)}
              className="p-2 hover:bg-gray-50 rounded-full self-end sm:self-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-6 sm:space-y-8">
            {/* Category Name */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-900">
                  Category Name
                </label>
              </div>
              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Enter category name"
                required
                className="text-base sm:text-lg border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 h-10 sm:h-12"
              />
            </div>

            {/* Icon Selection */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2">
                <Smile className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-900">
                  Choose Icon
                </label>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 sm:gap-3">
                {PRESET_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`relative p-3 sm:p-4 text-lg sm:text-2xl rounded-xl sm:rounded-2xl border-2 transition-all hover:scale-105 ${
                      newCategory.icon === icon
                        ? "border-gray-900 bg-gray-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setNewCategory({ ...newCategory, icon })}
                  >
                    {icon}
                    {newCategory.icon === icon && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gray-900 rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-gray-500" />
                <label className="text-sm font-medium text-gray-900">
                  Pick Color
                </label>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 sm:gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-4 transition-all hover:scale-105 ${
                      newCategory.color === color
                        ? "border-gray-900"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                  >
                    {newCategory.color === color && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gray-900 rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Preview:
              </p>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-sm"
                  style={{ backgroundColor: newCategory.color }}
                >
                  {newCategory.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    {newCategory.name || "Category Name"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    New category
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2 sm:pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !newCategory.name.trim()}
                className="flex-1 bg-black hover:bg-gray-800 text-white rounded-xl py-2 sm:py-3 order-2 sm:order-1"
              >
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingCategory(false)}
                className="px-6 sm:px-8 rounded-xl border-gray-200 order-1 sm:order-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Responsive Categories Grid */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 pb-3 sm:pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-purple-50 rounded-xl sm:rounded-2xl">
              <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                Your Categories
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"} created
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-xl sm:rounded-2xl animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3 sm:h-4 bg-gray-100 rounded w-20 sm:w-24 mb-2 animate-pulse" />
                    <div className="h-2 sm:h-3 bg-gray-100 rounded w-12 sm:w-16 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                No Categories Yet
              </h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                Create your first category to organize expenses
              </p>
              <Button
                onClick={() => setIsAddingCategory(true)}
                className="bg-black hover:bg-gray-800 text-white rounded-full px-6 sm:px-8"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Category
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group flex items-center space-x-3 sm:space-x-4 p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl hover:shadow-lg hover:border-gray-200 transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {category.name}
                      </h3>
                      {category.isDefault && (
                        <div className="p-1 bg-yellow-50 rounded-full flex-shrink-0">
                          <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-600 fill-current" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {category.isDefault
                        ? "Default category"
                        : "Custom category"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
