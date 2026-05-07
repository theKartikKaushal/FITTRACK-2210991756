import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  function handleInput(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    console.log(formData);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    console.log(data);

    if(data.msg === 'user created'){
      navigate('/login');
    } else {
      alert('User already exists');
    }
  }

  return (
    <>
      <div className="logincontainer">
        <section className='banner loginbg'>
          <div className="loginsection">
            <div className="form-container" id="login-form">
              <h1 className='headlo'>Sign Up</h1>
              <form className='loginfo' onSubmit={handleSubmit}>
                <input type="text" id="new-username" placeholder='Username' className='logininput' name="username" onChange={handleInput} required />
                <input type="email" id="new-email" placeholder='Email' className='logininput' name="email" onChange={handleInput} required />
                <input type="password" id="new-password" placeholder='Password' className='logininput' name="password" onChange={handleInput} required />
                <button className='loginbutton' type="submit">Sign Up</button>
              </form>
              <p className='loginp'>Already have an account? <Link className='logina' to="/login" id="signup-link">Login</Link></p>
            </div>
          </div>
        </section>
      </div>
      <section className='banner footer' style={{padding:"20vh 0"}}></section>
    </>
  );
}

export default Signup;
