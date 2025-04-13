import axios from 'axios'
import React from 'react'

export default function C1() {
    async function hello(){
        const response= await axios.post('http://localhost:3000/auth/student/signup',{
            sid : "BT23CSA019",
            s_name:"WEGWG" , s_email:"uuu" , s_password :"jjj" , branch:"CSA"  , phone:"1234567890"
        })
        console.log(response)
    }
  return (
    
    <button onClick={hello}>jewbgw</button>
  )
}
