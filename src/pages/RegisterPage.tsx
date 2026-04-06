import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';
import { getCodeOptions } from '../api/codeApi';
import { initRegister, submitRegister } from '../api/registerApi';
import {
  blankCheck,
  maxLengthCheck,
  dateCheck,
  emailFormatCheck,
} from '../utils/validation';

function RegisterPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<string>('add');
  const [deptOptions, setDeptOptions] = useState<{ value: string; label: string }[]>([]);
  const [form, setForm] = useState({
    empId: '',
    empName: '',
    startDate: '',
    email: '',
    departmentId: '-100',
    genderId: '0',
  });

  const [errors, setErrors] = useState({
    empName: '',
    date: '',
    email: '',
    dept: '',
  });

  useEffect(() => {
    const currentMode = sessionStorage.getItem('mode') || 'add';
    const empId = sessionStorage.getItem('empId');

    setMode(currentMode);
    initialize(currentMode, empId);
  }, []);

  const initialize = async (currentMode: string, empId: string | null) => {
    try {
      const [data, dept] = await Promise.all([
        initRegister(currentMode, empId),
        getCodeOptions('A02'),
      ]);

      setDeptOptions([{ value: '-100', label: '---未選択---' }, ...dept]);

      if (currentMode === 'add') {
        setForm((prev) => ({
          ...prev,
          empId: String(data),
          genderId: '0',
          departmentId: '-100',
        }));
      }

      if (currentMode === 'update') {
        setForm({
          empId: String(data.empId),
          empName: data.empName ?? '',
          startDate: data.startDate ?? '',
          email: data.email ?? '',
          departmentId: String(data.departmentId ?? '-100'),
          genderId: String(data.genderId ?? '0'),
        });
      }
    } catch {
      alert('初期化失敗');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkEmpName = () => {
    const msg =
      blankCheck(form.empName, '名前') ||
      maxLengthCheck(form.empName, '名前', 20);
    setErrors((prev) => ({ ...prev, empName: msg }));
    return msg === '';
  };

  const checkDate = () => {
    const msg =
      blankCheck(form.startDate, '入社年月日') ||
      dateCheck(form.startDate, '入社年月日', '2000-01-01', '2024-12-31');
    setErrors((prev) => ({ ...prev, date: msg }));
    return msg === '';
  };

  const checkEmail = () => {
    if (!form.email.trim()) {
      setErrors((prev) => ({ ...prev, email: '' }));
      return true;
    }

    const msg =
      emailFormatCheck(form.email) ||
      maxLengthCheck(form.email, 'メールアドレス', 20);
    setErrors((prev) => ({ ...prev, email: msg }));
    return msg === '';
  };

  const checkDept = () => {
    if (form.departmentId === '-100') {
      setErrors((prev) => ({ ...prev, dept: '選択してください' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, dept: '' }));
    return true;
  };

  const finalCheck = () => {
    return checkEmpName() && checkDate() && checkEmail() && checkDept();
  };

  const handleSubmit = async () => {
    if (!finalCheck()) return;

    try {
      const result = await submitRegister(mode, {
        ...form,
        empId: Number(form.empId),
      });

      if (result.status === 200) {
        alert('成功');
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        alert(result.message);
      }
    } catch {
      alert('失敗');
    }
  };

  return (
    <div className="register-page">
      <form id="form-register" onSubmit={(e) => e.preventDefault()}>
        <div id="inputButtonContainer">
          <div id="inputContainer">
            <div id="inputGroupLeft">
              <div className="field-block">
                <label htmlFor="empId">社員ID:</label>
                <input type="text" id="empId" value={form.empId} readOnly />
              </div>

              <div className="field-block">
                <label htmlFor="empName">名前:</label>
                <span className="error-message">{errors.empName}</span>
                <input
                  type="text"
                  id="empName"
                  name="empName"
                  value={form.empName}
                  onChange={handleChange}
                  onBlur={checkEmpName}
                />
              </div>

              <div className="field-block">
                <label htmlFor="startDate">入社年月日:</label>
                <span className="error-message">{errors.date}</span>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  onBlur={checkDate}
                />
              </div>

              <div className="field-block">
                <label htmlFor="email">メールアドレス:</label>
                <span className="error-message">{errors.email}</span>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={checkEmail}
                />
              </div>

              <div className="field-block selectContainer">
                <label htmlFor="deptList">所属部門:</label>
                <span className="error-message">{errors.dept}</span>
                <select
                  id="deptList"
                  name="departmentId"
                  value={form.departmentId}
                  onChange={handleChange}
                  onBlur={checkDept}
                >
                  {deptOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div id="radioContainer">
            <label>
              <input
                type="radio"
                id="genderM"
                name="genderId"
                value="0"
                checked={form.genderId === '0'}
                onChange={handleChange}
              />
              男性
            </label>
            <label>
              <input
                type="radio"
                id="genderW"
                name="genderId"
                value="1"
                checked={form.genderId === '1'}
                onChange={handleChange}
              />
              女性
            </label>
          </div>

          <div id="buttonContainer">
            <button type="button" className="btn-primary" onClick={handleSubmit}>
              {mode === 'add' ? '登録' : '更新'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
              閉じる
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;