import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import '../styles/info.css';
import { getCodeOptions } from '../api/codeApi';
import {
  deleteEmployees,
  resetEmployees,
  searchEmployees,
} from '../api/infoApi';
import type { Employee, OptionItem, SearchForm } from '../types/info';

const ROW_SIZE = 7;

function InfoPage() {
  const [form, setForm] = useState<SearchForm>({
    empId: '',
    empName: '',
    leftDate: '',
    rightDate: '',
    genderId: '',
    deptId: '',
  });

  const [genderOptions, setGenderOptions] = useState<OptionItem[]>([]);
  const [deptOptions, setDeptOptions] = useState<OptionItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(employees.length / ROW_SIZE));

  const pagedEmployees = useMemo(() => {
    const start = (currentPage - 1) * ROW_SIZE;
    const end = start + ROW_SIZE;
    return employees.slice(start, end);
  }, [employees, currentPage]);

  const initialize = async () => {
    try {
      const [empList, genders, departments] = await Promise.all([
        searchEmployees({
          empId: '',
          empName: '',
          leftDate: '',
          rightDate: '',
          genderId: '',
          deptId: '',
        }),
        getCodeOptions('A01'),
        getCodeOptions('A02'),
      ]);

      setEmployees(empList);
      setGenderOptions([{ value: '100', label: '-- ALL --' }, ...genders]);
      setDeptOptions([{ value: '100', label: '-- ALL --' }, ...departments]);
      setCurrentPage(1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '初期表示に失敗しました';
      alert(message);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      void initialize();
    });
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckChange = (empId: number) => {
    setCheckedIds((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  const handleSearch = async () => {
    try {
      const searched = await searchEmployees({
        ...form,
        genderId: form.genderId === '100' ? '' : form.genderId,
        deptId: form.deptId === '100' ? '' : form.deptId
      });
      setEmployees(searched);
      setCheckedIds([]);
      setCurrentPage(1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '検索に失敗しました';
      alert(message);
    }
  };

  const handleDelete = async () => {
    if (checkedIds.length === 0) {
      alert('社員情報を選択してください。');
      return;
    }

    if (!window.confirm('選択した状態を削除してもいいですか')) {
      return;
    }

    try {
      const message = await deleteEmployees(checkedIds);
      alert(message);

      const refreshed = await searchEmployees(form);
      setEmployees(refreshed);
      setCheckedIds([]);
      setCurrentPage(1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '削除に失敗しました';
      alert(message);
    }
  };

  const handleReset = async () => {
    try {
      const message = await resetEmployees();
      alert(message);

      setForm({
        empId: '',
        empName: '',
        leftDate: '',
        rightDate: '',
        genderId: '',
        deptId: '',
      });

      await initialize();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'リセットに失敗しました';
      alert(message);
    }
  };

  const moveToRegister = (mode: 'add' | 'update', empId?: number) => {
    sessionStorage.removeItem('mode');
    sessionStorage.removeItem('empId');

    sessionStorage.setItem('mode', mode);
    if (empId !== undefined) {
      sessionStorage.setItem('empId', String(empId));
    }

    window.location.href = '/register';
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="info-page">
      <form id="form-info" onSubmit={(e) => e.preventDefault()}>
        <div id="inputButtonContainer">
          <div id="inputContainer">
            <div id="inputGroupLeft">
              <div>
                <label htmlFor="empId">ユーザーID:</label>
                <input
                  type="text"
                  id="empId"
                  name="empId"
                  value={form.empId}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="leftDate">入社日left</label>
                <input
                  type="date"
                  id="leftDate"
                  name="leftDate"
                  value={form.leftDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div id="inputGroupRight">
              <div>
                <label htmlFor="empName">名前:</label>
                <input
                  type="text"
                  id="empName"
                  name="empName"
                  value={form.empName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="rightDate">入社日right</label>
                <input
                  type="date"
                  id="rightDate"
                  name="rightDate"
                  value={form.rightDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="selectContainer">
              <label htmlFor="genderList">性別</label>
              <select
                id="genderList"
                name="genderId"
                value={form.genderId || '100'}
                onChange={handleInputChange}
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="selectContainer">
              <label htmlFor="deptList">所属部門</label>
              <select
                id="deptList"
                name="deptId"
                value={form.deptId || '100'}
                onChange={handleInputChange}
              >
                {deptOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>

      <div id="pagination">
        <div id="indexButtons">
          <button type="button" id="prevBtn" onClick={handlePrev}>
            {'<<'}
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <button
                type="button"
                key={page}
                id={currentPage === page ? 'active' : undefined}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button type="button" id="nextBtn" onClick={handleNext}>
            {'>>'}
          </button>
        </div>

        <div id="buttonContainer">
          <button type="button" id="addButton" onClick={() => moveToRegister('add')}>
            Add
          </button>
          <button type="button" id="searchButton" onClick={handleSearch}>
            Search
          </button>
          <button type="button" id="deleteButton" onClick={handleDelete}>
            Delete
          </button>
          <button type="button" id="resetButton" onClick={handleReset}>
            reset
          </button>
        </div>
      </div>

      <div id="tableContainer">
        <table id="mainTable">
          <thead>
            <tr>
              <th className="col-check">選択</th>
              <th className="col-id">社員ID</th>
              <th className="col-name">名前</th>
              <th className="col-gender">性別</th>
              <th className="col-dep">所属部門</th>
              <th className="col-phone">入社年月日</th>
              <th className="col-email">メールアドレス</th>
            </tr>
          </thead>

          <tbody id="info-list">
            {pagedEmployees.map((emp) => (
              <tr key={emp.empId}>
                <td>
                  <input
                    type="checkbox"
                    value={emp.empId}
                    checked={checkedIds.includes(emp.empId)}
                    onChange={() => handleCheckChange(emp.empId)}
                  />
                </td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      moveToRegister('update', emp.empId);
                    }}
                  >
                    {emp.empId}
                  </a>
                </td>
                <td>{emp.empName}</td>
                <td>{emp.genderName}</td>
                <td>{emp.departmentName}</td>
                <td>{emp.startDate}</td>
                <td>{emp.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InfoPage;