import type { ApiResponse, Employee, SearchForm } from '../types/info';

function buildQueryString(form: SearchForm): string {
  const params = new URLSearchParams();

  if (form.empId) params.append('empId', form.empId);
  if (form.empName) params.append('empName', form.empName);
  if (form.leftDate) params.append('leftDate', form.leftDate);
  if (form.rightDate) params.append('rightDate', form.rightDate);
  if (form.genderId) params.append('genderId', form.genderId);
  if (form.deptId) params.append('deptId', form.deptId);

  return params.toString();
}

export async function searchEmployees(form: SearchForm): Promise<Employee[]> {
  const query = buildQueryString(form);
  const url = query
    ? `/mipha/api/info/search?${query}`
    : '/mipha/api/info/search';

  const response = await fetch(url, {
    method: 'GET',
  });

  const json: ApiResponse<Employee[]> = await response.json();

  if (json.status !== 200) {
    throw new Error(`検索失敗: ${json.status}`);
  }

  return json.data;
}

export async function deleteEmployees(empIdList: number[]): Promise<string> {
  const response = await fetch('/mipha/api/info/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(empIdList),
  });

  const json: ApiResponse<null> = await response.json();

  if (json.status !== 200) {
    throw new Error(json.message || '削除失敗');
  }

  return json.message;
}

export async function resetEmployees(): Promise<string> {
  const response = await fetch('/mipha/api/info/reset', {
    method: 'GET',
  });

  const json: ApiResponse<null> = await response.json();

  if (json.status !== 200) {
    throw new Error(json.message || '初期化失敗');
  }

  return json.message;
}