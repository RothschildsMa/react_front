import type { ApiResponse } from '../types/info';

export type RegisterData = {
  empId: number;
  empName: string;
  startDate: string;
  email: string;
  departmentId: string;
  genderId: string;
};

export async function initRegister(
  mode: string,
  empId?: string | null
) {
  const url = `/mipha/api/register/${mode}?empId=${empId ?? ''}`;

  const response = await fetch(url);
  const json: ApiResponse<any> = await response.json();

  if (json.status !== 200) {
    throw new Error('初期化失敗');
  }

  return json.data;
}

export async function submitRegister(
  mode: string,
  form: RegisterData
) {
  const params = new URLSearchParams();

  Object.entries(form).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  const response = await fetch(
    `/mipha/api/register/${mode}/buildinfo`,
    {
      method: 'POST',
      body: params,
    }
  );

  const json: ApiResponse<null> = await response.json();

  return json;
}