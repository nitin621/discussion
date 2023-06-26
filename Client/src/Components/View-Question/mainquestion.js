import React, {useState} from 'react'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import HistoryIcon from '@mui/icons-material/History'
import { Avatar } from '@mui/material'
import {NavLink} from 'react-router-dom'
import parse from 'html-react-parser'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // quill css 
import AttachFileIcon from '@mui/icons-material/AttachFile'
import './index.css'
import ReplyAllIcon from '@mui/icons-material/ReplyAll'
import FileDownload from 'js-file-download'
import Axios from 'axios'


const Mainquestion = (details) => {   

  let detail = details.details


  const question_id = detail._id

  // let answer = detail.result

  const auth = sessionStorage.getItem('username')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');  
  const [body, setBody] = useState('')
  const [file,setFile] = useState('')
  const handleQuill = (value) => {
    setBody(value)
  }

  

const answer = async (e)=>{  
  e.preventDefault()   

  const data = new FormData()

    data.append('file', file)
    data.append('body',body)
    data.append('auth',auth)
    data.append('question_id',question_id)

    // console.log(file,body,auth,question_id) //Check  value of comment

    console.log(body)
    console.log(file)

    if(!body)
    {
      setError("Please comment first");
        setLoading(false);
    }    
    if(file)
    {
      if(file.size/1024 > 5120 || file.type.split('/').pop()!='pdf')
      {
        setError("Please upload file in below mentioned format");
        setLoading(false); 
         
      }    
    }
    else
    {
      console.log('hello brother')
    }
    
     
     
    
  }

const handleFileChange = (event) => {       
   
  setFile(event.target.files[0])   
  }




  //Reply button code for hide and unhide
const [enable, setEnable] = useState(true)
const reply = ()=>{
    if(enable ==true)
    {
      setEnable(false)
    }
    else if(enable == false)
    {
      setEnable(true)
    }
  }  

  //Here the code for download Post Attachment
  const download = (e) =>{  
   Axios({
    url:`/Q_download/${e}`,
    method:'GET',
    responseType:'blob'
   }).then((resp)=>{
      
    FileDownload(resp.data,'file.pdf')    
  })
  }  

  
  return (
    <div className='main'>
      
      <div className='main-container'>
        <div className='main-top'>
          <h2 className='main-question'></h2>
            <NavLink to='/add-question'>
              <button>Ask Question</button>
            </NavLink>
              </div>
              <div className='main-desc'>
                <div className='info'>
                  <p>{new Date(detail?.created_at).toLocaleString()}</p>   
                  <a onClick={(e)=>download(detail._id)}><AttachFileIcon/></a>             
                </div>
              </div>
          <div className='all-questions'>
            <div className='all-questions-container'>
              {/* <div className='all-questions-left'>
                <div className='all-options'>
                <p className="arrow">▲</p>

                <p className="arrow">0</p>

                <p className="arrow">▼</p>

                <BookmarkIcon />

                <HistoryIcon />
                </div>
              </div> */}
              <div className='question-answer'>
                <p>{parse(detail.body)}</p>
                <div className='author'>
                  <small></small>
                  <div className='auth-details'>
                  <Avatar/>
                  <p>{String(detail?.auth).split('@')[0]}</p> 
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          <div className='all-questions'>
            <p>Number of Comments</p> 
            <div className='all-questions-container'>
            <div className='all-questions-left'>
                <div className='all-options'>
                <p className="arrow">▲</p>

                <p className="arrow">0</p>

                <p className="arrow">▼</p>

                <BookmarkIcon />

                <HistoryIcon />
                </div>
              </div>
            
              <div className='question-answer'>
             dsfsdfsdfsdfsdfsdfsdfsdfsd
                <div className='author'>
                  <small>asked "Timestamp"</small>
                  <div className='auth-details'>
                  <Avatar/>
                  <p>Author Name</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ReplyAllIcon className='icon-reply'  onClick={()=>reply()}/>        
        <div className='answer' hidden={enable}>
        <div className='main-answer'>
        <h3>You can Answer</h3>
        <ReactQuill theme="snow" value={body} onChange={handleQuill} className='react-quill'  style={{height
        :"200px"}}/> 
      </div>

      <div className='file-attach'>
            <h3>Attach file (only PDF with 5 MB)</h3>
            <input label="File upload" type="file" name='file' onChange={handleFileChange} 
              placeholder="Select file..." />
          </div>          
      <button onClick={answer} style={{
          margin: "10px 0",
          maxWidth: "fit-content",
        }}>
           {loading ? "Commenting..." : "Post Comment"}
        </button>       
        {error !== "" && (
          <p style={{ color: "red", fontSize: "14px" }} >
            {error}
          </p>
        )} 

        </div>
        
      </div>
  )
}

export default Mainquestion