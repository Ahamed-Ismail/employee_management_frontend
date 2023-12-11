import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './UploadForm.css';

function UploadForm() {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [salary, setSalary] = useState(0);
  const [error, setError] = useState(null);

  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8000/get');
      const data = await res.json();
      setDetails(data);
    };
    fetchData();
  },[details]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          dept,
          salary,
        }),
      });
      const data = await res.json();
      if (data !== 'ok') {
        setError(data.error);
        setTimeout(() => {
          setError(null)
        }, 2000);
      } else {
        setDetails([...details, { "emp_id": id, "emp_name": name, "department": dept, "salary": salary }]); 
      }
         
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async(index) => {
    try {
      const element = details[index];
      await fetch('http://localhost:8000/delete', {
        method: "DELETE",
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          id:element.emp_id
        })
      });
      const updatedDetails = details.filter((ele, i) => i !== index);
      setDetails(updatedDetails);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="empid">
          <label for="id">Employee ID</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div className="empname">
          <label for="name">Employee Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="empdept">
          <label for="dept">Department</label>
          <input
            type="text"
            id="dept"
            value={dept}
            onChange={(e) => setDept(e.target.value)}
          />
        </div>
        <div className="empsalary">
          <label for="salary">Employee Salary</label>
          <input
            type="text"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Add Details</button>
        </div>
        <div>
        {error && <label>{error}</label>}
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <td>EmployeeId</td>
            <td>EmployeeName</td>
            <td>Department</td>
            <td>Salary</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {details.map((detail, index) => {
            return (
              <tr key={index}>
                <td>{detail.emp_id}</td>
                <td>{detail.emp_name}</td>
                <td>{detail.department}</td>
                <td>{detail.salary}</td>
                <td><button onClick={()=>handleDelete(index)}>Delete</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default UploadForm;
