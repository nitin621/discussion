import React, {useState, useEffect} from 'react'
import swal from 'sweetalert'
import Img from './logo.png'
import './index.css'
import Content from './content'
import './captcha'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { Helmet } from 'react-helmet';

const Index = () => {
    const navigate = useNavigate()

    //if user already login then it will not redirect to auth page
    useEffect (()=>{
        const auth = sessionStorage.getItem('username')
        if(auth)
        {
          navigate('/')
        }
      })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [register, setRegister] = useState(false)
    const [user, setUSer] = useState({
        name:'',email:'',division:'',password:'',cpassword:''
    })
    let name, value 
    const handleInput = (e)=>{
       
        name =e.target.name
        value =e.target.value

        setUSer({...user, [name]:value})
    }

    function validateEmail(email) {
        const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(email) === false || !(email.split('@')[1] === 'icar.gov.in')) {
          return false;
        } else return true;
      }
/// Registration button function call here
       const handleRegister= async (e)=>{
       const status=0
        e.preventDefault()
        setLoading(true)
        const {name, email, division, password, cpassword} = user
        console.log(user)
        if(!name || !email || !division || !password || !cpassword )
        {
            setError("Something missing");
            setLoading(false);
        }
        else if (!validateEmail(email))
        {
            setError("Email is not in valid formate");
            setLoading(false);
        }
        else if(!(password === cpassword))
        {
            
            setError("Password is not Matched");
            // setUSer({password:'',cpassword:''})
            setLoading(false);
        }
        else{    
                  
            try{
                const resp =await axios.post('/Signup',
                {
                    name,
                    email,
                    division,
                    password,
                    status
                    
                }).then((resp)=>{
                    swal("Signup Successfully")
                    window.location.reload(false)
                    setLoading(false)
                })
            }
            catch(err)
            {
                setError(err.response.data.err)
                setLoading(false);
            }
            // const resp =await axios.post('/Signup',
            //     {
            //         name,
            //         email,
            //         division,
            //         password,
            //         status
                    
            //     }).then((resp) => {
            //         swal("Signup Successfully")
            //         window.location.reload(false)
            //         setLoading(false)
            //       }, (problem) => {
            //         setError("User Already exist")
            //         setLoading(false)

            //       });
           
        }
        
        
      }
      
const handleLogin= async (e)=>{
    const {email, password} = user
    e.preventDefault()
        if(!email || !password )
    {
        setError("Something missing");
        setLoading(false);
    }
    else if (!validateEmail(email))
    {
        setError("Email is not in valid formate");
        setLoading(false);
    }
    else{
    try{
        const resp = await axios.post('/Signin', {
            email,
            password
        }).then((resp)=>{
            const UserName = resp.data.userExist.email
            const UserID = resp.data.userExist._id 
            const User = resp.data.userExist._id
            const UserDivision = resp.data.userExist.division       
            sessionStorage.setItem('username',UserName)
            alert('Welcome to ICAR Discussion Forum')           
            navigate('/')
            
        })
        }
        catch(err) {
            setError(err.response.data.err)
            setLoading(false);
        }
    
    }
        }

  return (
        <div className='auth'>
            <Helmet>
        <title>Discussion Forum | Auth</title>
      </Helmet>
        <div className='auth-container'>
                <div className='landing_page'>
                    <div className='pull-right'>
                      <div className='ICAR-Sign'>
                          <img src={Img} alt="" style={{ height: "150px"}} />

                      </div>
                      <div className='auth-login'>
                          <div className='auth-login-container'>
                            {
                                register ? (<>
                                    <div className='input-field'>
                                  <p>Name</p>
                                  <input  type="text" name='name' autoComplete='off'
                                  value={user.name}
                                  onChange={handleInput}
                                  placeholder='Enter your full name' />
                              </div>
                              <div className='input-field'>
                                  <p>ICAR Email</p>
                                  <input  type="email" name='email' autoComplete='off'
                                  value={user.email}
                                  onChange={handleInput}
                                  placeholder='Enter your icar mail' />
                              </div>

                              <div className='input-field'>
                                  <p>Select Division</p>
                                  <select name="division" onChange={handleInput} value={user.division} id="divsion">
                                  <option value=''>--Select Organization--</option>
                                  <option value='Agricultural Education'>Agricultural Education </option>
                                  <option value='Agricultural Engineering'>Agricultural Engineering</option>
                                  <option value='Agricultural Extension'>Agricultural Extension</option>
                                  <option value='Animal Science'>Animal Science</option>
                                  <option value='Crop Science'>Crop Science</option>
                                  <option value='Fisheries Science'>Fisheries Science</option>
                                  <option value='Horticulture Science'>Horticulture Science</option>
                                  <option value='Natural Resource Management'>Natural Resource Management</option>
                                  <option value='Administration'>Administration</option>
                                  <option value='Finance'>Finance</option>
                                  <option value='Social Science'>Social Science</option>
                                  <option value='Technical'>Technical</option>
                                  </select>
                              </div>
                              <div className='input-field'>
                                  <p>Password</p>
                                  <input  name='password' type="password" autoComplete='off'
                                  value={user.password}
                                  onChange={handleInput}
                                  placeholder='Enter the password'/>
                              </div>
                              <div className='input-field'>
                                  <p>Confirm Pasword</p>
                                  <input type="password" name='cpassword' autoComplete='off'
                                  value={user.cpassword}
                                  onChange={handleInput}
                                  placeholder='Enter the Confirm password' />
                              </div>
                              <button style={{ marginTop: "20px" }} onClick={handleRegister}>
                              {loading ? "Registering..." : "Register"}
                              </button>
                                </>
                                ) : (
                                
                                <>
                                <div className='input-field'>
                                  <p>Email</p>
                                  <input  type="email" name='email'  autoComplete='off' 
                                   value={user.email}
                                   onChange={handleInput}
                                  />
                              </div>
                              <div className='input-field'>
                                  <p>Password</p>
                                  <input  type="password" name='password' autoComplete='off'
                                  value={user.password}
                                  onChange={handleInput}
                                  />
                              </div>                         
                                                                                                                 
                              <button style={{ marginTop: "20px" }} onClick={handleLogin}>
                              {loading ? "Logging in..." : "Login"}
                              </button>
                              
                                </>
                                )}
                              <p onClick={()=> setRegister(!register)   || setUSer({name:'',email:'',division:'',password:'',cpassword:''})   || setError(false)                        
                            } style={{
                                    marginTop:'10px',
                                    textAlign:'center',
                                    color:'#0095ff',
                                    textDecoration:'underline',
                                    cursor:'pointer'
                              }}>{ register ? 'Login' : 'Register'}?</p>
                                  <div id="company">
                                  {error !== "" && (
                                        <p
                                        style={{
                                        color: "red",
                                        fontSize: "14px",
                                               }}
                                        >
                                          {error}
                                        </p>
                                            )}    
                                  </div>
                                   
                              </div>
                      </div>

                    </div>
                    
                        <Content/>
                  
                
                    </div>       
                   
                  </div>      
           </div>
    
  )
}

export default Index