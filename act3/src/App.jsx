import { useState } from "react";
import { Routes, Route, NavLink, Link, useNavigate, useParams } from "react-router-dom";

function Home() {
  return (
    <div className="card">
      <h1>Mini Student Portal</h1>
      <p>Register students and view their details.</p>
    </div>
  );
}

function NotFound() {
  return <div className="card"><h1>404</h1><p>Page not found.</p></div>;
}

function Register({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", studentId: "", email: "", course: "", year: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Full name is required.";
    if (!form.studentId.trim()) err.studentId = "Student ID is required.";
    else if (!/^\d{4}-\d{4}$/.test(form.studentId)) err.studentId = "Student ID must look like 2024-0001.";
    if (!form.email.trim()) err.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter a valid email.";
    if (!form.course) err.course = "Please select a course.";
    if (!form.year) err.year = "Please select a year level.";
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    onAdd({ id: crypto.randomUUID(), ...form, fullName: form.fullName.trim() });
    navigate("/students");
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h1>Register</h1>

      <div className="field">
        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} />
        {errors.fullName && <p className="error">{errors.fullName}</p>}
      </div>

      <div className="field">
        <label htmlFor="studentId">Student ID</label>
        <input id="studentId" name="studentId" placeholder="2024-0001" value={form.studentId} onChange={handleChange} />
        {errors.studentId && <p className="error">{errors.studentId}</p>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" value={form.email} onChange={handleChange} />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="field">
        <label htmlFor="course">Course</label>
        <select id="course" name="course" value={form.course} onChange={handleChange}>
          <option value="">-- Select course --</option>
          <option>BSIT</option>
          <option>BSCS</option>
          <option>BSIS</option>
          <option>BSEd</option>
        </select>
        {errors.course && <p className="error">{errors.course}</p>}
      </div>

      <div className="field">
        <label>Year Level</label>
        <div className="radios">
          {["1st", "2nd", "3rd", "4th"].map((y) => (
            <label key={y}>
              <input type="radio" name="year" value={y} checked={form.year === y} onChange={handleChange} /> {y}
            </label>
          ))}
        </div>
        {errors.year && <p className="error">{errors.year}</p>}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

function Students({ students }) {
  return (
    <div className="card">
      <h1>Students</h1>
      {students.length === 0 ? (
        <p>No students yet. <Link to="/register">Register one</Link>.</p>
      ) : (
        <ul>
          {students.map((s) => (
            <li key={s.id}><Link to={`/students/${s.id}`}>{s.fullName}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StudentDetails({ students }) {
  const { id } = useParams();
  const student = students.find((s) => s.id === id);

  if (!student) {
    return <div className="card"><p>Student not found.</p><Link to="/students">Back to list</Link></div>;
  }

  return (
    <div className="card">
      <h1>{student.fullName}</h1>
      <p><strong>Student ID:</strong> {student.studentId}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Course:</strong> {student.course}</p>
      <p><strong>Year Level:</strong> {student.year}</p>
      <Link to="/students">← Back to list</Link>
    </div>
  );
}

export default function App() {
  const [students, setStudents] = useState([]);
  const addStudent = (student) => setStudents([...students, student]);

  return (
    <div>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/register">Register</NavLink>
        <NavLink to="/students">Students</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register onAdd={addStudent} />} />
        <Route path="/students" element={<Students students={students} />} />
        <Route path="/students/:id" element={<StudentDetails students={students} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}