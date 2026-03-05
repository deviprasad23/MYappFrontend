import axios from "axios";
import { useState } from "react";

// Use environment variable for API URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function Reg() {
    const [data, setdata] = useState(
        {
            username: "",
            email: "",
            password: ""
        }
    )
    const changeName=(e) => {
        setdata({ ...data,[e.target.name]: e.target.value })
    }
  const regSubmit = async () =>
  {
   // Validate fields
   if (!data.username || !data.email || !data.password) {
     alert("Please fill in all fields")
     return
   }
   
   try
   {
     const res= await axios.post(`${API_URL}/register`,data)
    alert(res.data)
   }
   catch(xyz)
   {
         // More detailed error handling
         if (xyz.response) {
           // Server responded with an error status
           alert(`Error: ${xyz.response.data || xyz.response.statusText || 'Server error'}`)
         } else if (xyz.request) {
           // Request was made but no response received
           alert("Error: Cannot connect to server. Please make sure the backend is running on http://localhost:8080")
         } else {
           // Something else happened
           alert(`Error: ${xyz.message || 'An unexpected error occurred'}`)
         }
         console.error("Registration error:", xyz)
   }

  }


  return(
    <>
    <h1>Register Here</h1>
    <input onChange={changeName} name="username" placeholder="Username" />
    <br />
    <input onChange={changeName} name="email" placeholder="Email" />
    <br />
    <input onChange={changeName} name="password" placeholder="Password" />
    <br />
    <button onClick={regSubmit}>Register</button>
    </>
  )
}
export default Reg;