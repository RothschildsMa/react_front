export type SearchForm = {
  empId: string;
  empName: string;
  leftDate: string;
  rightDate: string;
  genderId: string;
  deptId: string;
};

export type OptionItem = {
  value: string;
  label: string;
};

export type Employee = {
  empId: number;
  empName: string;
  genderName: string;
  departmentName: string;
  startDate: string;
  email: string;
};

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};