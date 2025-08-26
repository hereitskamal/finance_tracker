// ==========================================
// UPDATED TYPES - src/types/index.ts
// ==========================================

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt?: string; // Added for consistency
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  categories?: Category; // Fixed: should be optional and singular based on your API
}

// Next.js 15 Route Handler Types
export interface RouteParams {
  id: string;
}

export interface RouteContext<T = RouteParams> {
  params: Promise<T>; // Updated for Next.js 15 async params
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFailure {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResult<T = unknown> = ApiSuccess<T> | ApiFailure;

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ExpenseListResponse {
  expenses: Expense[];
  pagination: PaginationInfo;
}

export interface MonthlyAnalytics {
  month: number;
  year: number;
  period: {
    startDate: string;
    endDate: string;
    daysInMonth: number;
  };
  totalAmount: number;
  expenseCount: number;
  avgPerDay: number;
  categoriesCount: number;
  categoryBreakdown: Record<
    string,
    {
      total: number;
      count: number;
      color: string;
      name?: string; // Added for better type safety
    }
  >;
  expenses?: Expense[]; // Made optional as it might not always be included
}

export interface CategoryBreakdown {
  [key: string]: {
    total: number;
    count: number;
    color: string;
  };
}

export interface SpendingTrend {
  month: string;
  amount: number;
  year?: number;
}

export interface DashboardSummary {
  totalExpenses: number;
  totalAmount: number;
  thisMonthAmount: number;
  lastMonthAmount: number;
  changePercentage: number;
  avgPerDay: number;
  topCategories: Array<{
    name: string;
    amount: number;
    icon: string;
    color: string;
    count: number;
  }>;
  recentExpenses: Expense[];
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "date" | "amount" | "description";
  sortOrder?: "asc" | "desc";
}

// CRUD Data Types
export interface CreateExpenseData {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}

export interface UpdateExpenseData extends Partial<CreateExpenseData> {
  id: string;
}

export interface CreateCategoryData {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

// Authentication Types
export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: AuthUser;
  expires: string;
  accessToken?: string; // Added for Supabase auth
}

// Supabase Auth Types
export interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
  app_metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: SupabaseUser;
}

// Error Types
export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
  status?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ZodValidationError {
  error: string;
  details: Array<{
    path: (string | number)[];
    message: string;
    code: string;
  }>;
}

// UI Component Types
export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

export type Theme = "light" | "dark" | "system";
export type SortDirection = "asc" | "desc";
export type ExpenseSortField = "date" | "amount" | "description" | "category";

// Component Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// Date Range Types
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AnalyticsDateRange extends DateRange {
  label: string;
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartData extends ChartDataPoint {
  percentage: number;
}

export interface LineChartData {
  x: string | number;
  y: number;
  label?: string;
}

// Settings Types
export interface UserSettings {
  currency: string;
  dateFormat: string;
  theme: Theme;
  notifications: boolean;
  defaultCategory?: string;
  timezone?: string; // Added timezone support
}

// Enhanced Combined Types
export type ExpenseWithCategory = Expense & {
  categories: Category; // Fixed: singular based on your API structure
};

export type CategoryWithExpenseCount = Category & {
  _count: {
    expenses: number;
  };
  totalAmount?: number;
};

export type UserWithStats = User & {
  _count: {
    expenses: number;
    categories: number;
  };
  totalSpent?: number;
};

// Next.js Route Handler Function Types
export type RouteHandler<T = RouteParams> = (
  request: Request,
  context: RouteContext<T>
) => Promise<Response> | Response;

export type GetRouteHandler<T = RouteParams> = RouteHandler<T>;
export type PostRouteHandler<T = RouteParams> = RouteHandler<T>;
export type PutRouteHandler<T = RouteParams> = RouteHandler<T>;
export type DeleteRouteHandler<T = RouteParams> = RouteHandler<T>;
export type PatchRouteHandler<T = RouteParams> = RouteHandler<T>;

// Environment Variables Types
export interface EnvironmentConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
}

// Database Schema Types (matching Supabase structure)
export interface DatabaseUser {
  id: string;
  name: string | null;
  email: string;
  email_verified?: string | null;
  image?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface DatabaseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  is_default: boolean;
  user_id: string | null;
  created_at: string;
  updated_at?: string;
}

export interface DatabaseExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Form Types
export interface ExpenseFormData extends CreateExpenseData {
  id?: string; // Optional for create vs update
}

export interface CategoryFormData extends CreateCategoryData {
  id?: string; // Optional for create vs update
}

// Search and Filter Types
export interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  order?: "asc" | "desc";
  page?: string;
  limit?: string;
}

// Utility Types for Better Type Safety
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Status Types
export type LoadingState = "idle" | "loading" | "success" | "error";
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Hook Return Types
export type UseExpensesReturn = AsyncState<ExpenseListResponse> & {
  refetch: () => Promise<void>;
  createExpense: (data: CreateExpenseData) => Promise<void>;
  updateExpense: (id: string, data: UpdateExpenseData) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
};

export type UseCategoriesReturn = AsyncState<Category[]> & {
  refetch: () => Promise<void>;
  createCategory: (data: CreateCategoryData) => Promise<void>;
  updateCategory: (id: string, data: UpdateCategoryData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};
