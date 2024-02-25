import React, { useState, useEffect } from "react";
import './UploadForm.css';

function UploadForm() {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [salary, setSalary] = useState(0);
  const [error, setError] = useState(null);
  const [designation, setDesignation] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phoneno, setPhoneno] = useState();
  const [nextpage, setNextpage] = useState(false);

  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:8000/get');
      const data = await res.json();
      setDetails(data);
    };
    fetchData();
  },[details]);

  const updateB = async () => {
    
    
    try {
      const res = await fetch("http://localhost:8000/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          gender,
          dob,
          dept,
          designation,
          salary,
          phoneno,
          
        }),
      });
      const data = await res.json();
      if (data.res !== 'ok') {
        setError(data.res);
        setTimeout(() => {
          setError(null)
        }, 3000);
      } else {
        setDetails([...details, { "emp_id": id, "emp_name": name,"gender":gender, "dob":dob, "department": dept,"designation":designation, "salary": salary }]); 
      }
      setNextpage(false);
         
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
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
          gender,
          dob,
          dept,
          designation,
          salary,
          
        }),
      });
      const data = await res.json();
      if (data.res !== 'ok') {
        setError(data.res);
        setTimeout(() => {
          setError(null)
        }, 3000);
      } 
      setNextpage(true);
         
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
        <div className="gender">
          <label >Gender</label>
          <label>
          <input
            type="radio"
            id="gender"
            name="gender"
            value="male"
            checked={gender==="male"}
            onChange={(e) => setGender(e.target.value)}
            />
            Male
          </label>
          <label>
          <input
            type="radio"
            id="gender"
            name="gender"
            value="female"
            checked={gender==="female"}
            onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>
          <label>
          <input
            type="radio"
            id="gender"
            name="gender"
            value="prefer not to say"
            checked={gender==="prefer not to say"}
            onChange={(e) => setGender(e.target.value)}
            />
            Prefer not to say
            </label>
        </div>
        <div className="dob">
          <label>Date Of Birth</label>
          <input type="date"
            value={dob}
          onChange={(e)=>setDob(e.target.value)} />
        </div>
        <div className="empdept">
          <label for="dept">Department</label>
          <select id='dept' value={dept} onChange={e => setDept(e.target.value)}>
            <option value="">Select...</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
            <option value="advertizement">Advertisement</option>
            <option value="sales">Sales</option>
            <option value="production">Production</option>
          </select>
        </div>
        <div className="emdDesig">
          <label for="desig">Designation</label>
          <input
            type="text"
            id="desig"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
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
        {nextpage ?  <div className="phoneno">
          <label for="phoneno">Phone no</label>
          <input
            type="text"
            id="phoneno"
            value={phoneno}
            onChange={(e) => setPhoneno(e.target.value)}
          /></div> : null}
        
        {nextpage ? <div>
          <button  onClick={()=>updateB()}>Update</button>
        </div>:null}
        {!nextpage?<div>
          <button onClick={(e)=>handleSubmit(e)}>Add more Details</button>
        </div>:null}
        <div>
        {error && <label>{error}</label>}
        </div>
      </form>

      <table>
        <thead>
          <tr>
          
            <td>EmployeeId</td>
            <td>EmployeeName</td>
            <td>Gender</td>
            <td>DOB</td>
            <td>Department</td>
            <td>Designation</td>
            <td>Salary</td>
            <td>Phoneno</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {details.map((detail, index) => {
            return (
              <tr key={index}>
                 {/* { "emp_id": id, "emp_name": name,"gender":gender, "dob":dob, "department": dept,"designation":designation, "salary": salary } */}
                <td>{detail.emp_id}</td>
                <td>{detail.emp_name}</td>
                <td>{detail.gender}</td>
                <td>{detail.dob}</td>
                <td>{detail.department}</td>
                <td>{detail.desigantion}</td>
                <td>{detail.salary}</td>
                <td>{detail.phoneno}</td>
                {/* <td><button onClick={ ()=>handleTask(index)}>Add Task</button></td> */}
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
