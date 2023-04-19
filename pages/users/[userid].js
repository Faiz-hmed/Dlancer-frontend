import Header from '@/components/Header';
import { useRouter } from 'next/router'
import { useRef,useState,useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import styles from '../../styles/Users.module.css'
import Certificate from './Certificate';
import Project from './Project';
import ProjectCard from '../search/ProjectCard';
import { skillsets } from '@/constants';
export default function Profile(){
    const router = useRouter();
    const {userid}=router.query;
    const [skills, setSkills] = useState([]);
    const [certlist,setCertlist] = useState([])

    const imgurl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpCKq1XnPYYDaUIlwlsvmLPZ-9-rdK28RToA&usqp=CAU";
    const [data,setData] = useState(
      {username:"employee",walletID:"0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
      skills:["React.js","Python","Tensorflow"],
      image:imgurl,
      location:"Bangalore",
      bio:"Hardworking student",
      tasks:"5/6",
      email:"employee@gmail.com"
});
const [newSkill, setNewSkill] = useState("");
useEffect(()=>{
    fetch('http://localhost:5000/api/users/'+account).then((res)=>{
        return res.json();
    }).then((res)=>{
        console.log(res)
        setData(res)
        setSkills(res.skills)
    }).catch((e)=>{
        console.error(e);
    })
},[])

useEffect(()=>{
  fetch('http://localhost:5000/api/users/certs/'+account).then((res)=>{
      return res.json();
  }).then((res)=>{
      console.log(res)
      setCertlist(res)
  }).catch((e)=>{
      console.error(e);
  })
},[])

const inviteproject = useRef();
const projects= [{id:1,title:"todo",collaborators:2,tasks:5,status:1,skills:["golang","python"]},
  {id:2,title:"website",collaborators:2,tasks:6,status:0,skills:["react.js","python"]},
  {id:3,title:"application",collaborators:2,tasks:5,status:1,skills:["flutter","js"]},]

const certificates = [
    {title:"web3",org:"coursera",link:"link here",verified:1},
    {title:"react.js",org:"coursera",link:"link here",verified:1},
    {title:"deep learning",org:"coursera",link:"link here",verified:0},
    {title:"fundamentals of blockchain",org:"coursera",link:"link here",verified:0},
    {title:"advanced data structues with java",org:"coursera",link:"link here",verified:1},
];

const {account} = useMoralis();

const accountprojects = [{id:1,title:"Todo app"},{id:2,title:"Self balancing robot"},{id:3,title:"gyroscope"}];

const projectlist = projects.map((project,key)=>{
    return <div className='row my-3'>
      <div className='col-12'><ProjectCard key={key} project ={project}/></div>
      {/* <ProjectCard key={key} tasks={project.tasks} title = {project.title} status = {project.status} /> */}
      {/* <Project key={key} tasks={project.tasks} title={project.title} status={project.status}/> */}
      </div>
})

const certificatelist = certlist.map((cert,key)=>{
    return <div className='row my-3'><Certificate key={key}  title={cert.title} org = {cert.org} link={cert.link} verified={cert.verified}/></div>
})

const invite = ()=>{
    console.log("invite for project id",inviteproject.current.value,"sent to user",account)
}

const handleSkillAdd = (e) => {
  const selectedSkill = e.target.value;
  if (!skills.includes(selectedSkill)) {
    setSkills([...skills, selectedSkill]);
  }    
}

const handleSkillRemove = (skill) => {
  setSkills(skills.filter((s) => s !== skill))
}

  const [edit,setEdit] = useState(false);
  const handleSave = ()=>{
    console.log('saved');
    setEdit(false);
}


  const editprofile = <form className="container" >
  <div className='card-body'>
    <div className='container'>
      <div className='row d-flex justify-content-center py-5'>
        <div className='col-xl-1 col-lg-2 col-md-2 col-sm-3 p-5 p-sm-0 d-flex align-items-center'>
          <img className={styles.cardimg} src={imgurl}></img>
        </div>
        <div className='col-lg-4'>
          <div className='container'>
            <div className='row my-2'>
              <div className='col-6'>
                <b>Username:</b>
              </div>
              <div className='col-6 '>
                <input type="text" className='form-control' name="username" defaultValue={data.username} />
              </div>
            </div>

            <div className='row my-2'>
              <div className='col-6'>
                <b>Bio:</b>
              </div>
              <div className='col-6 '>
                <input type="text" className='form-control' name="bio" defaultValue={data.bio} />
              </div>
            </div>
           
            <div className='row my-2'>
              <div className='col-6'>
                <b>Email:</b>
              </div>
              <div className='col-6'>
                <input type="email" className='form-control' name="email" defaultValue={data.email} />
              </div>
            </div>
            
            <div className='row my-2'>
              <div className='col-6'>
                <b>Location:</b>
              </div>
              <div className='col-6'>
                <input type="text" className='form-control' name="location" defaultValue={data.location} />
              </div>
            </div>
            <div className='row my-2'>
            <div className='col-6'>
                <b>Skills:</b>
            </div>
            <div className='col-6'>
      
             <div className="input-group mb-3">
            <select
            className="form-control"
            id="skillSelect"
            onChange={handleSkillAdd}
            >
          <option defaultValue="">-- Select a skill --</option>
            {skillsets.map((item,key)=>{
                return <option key={key} value={key}>{item}</option>
            })}
          </select>
          </div>
                
                <div className="skills-list">
    {skills.map((skill, index) => (
      <span
        key={index}
        className="badge badge-secondary mr-2"
        onClick={() => handleSkillRemove(skill)}
      >
        {skillsets[skill]} &times;
      </span>
    ))}
  </div>
    
             </div>
            </div>
            <div className="btn shadow bg-primary" onClick={handleSave}>
              <div onClick={handleSave} className="card-body text-center text-white">
                Save
              </div>
            </div>
        
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

const displayprofile =  <div className="container">
<div className='card-body'>
    <div className='container'>
        <div className='row d-flex justify-content-center py-5'>
            <div className='col-xl-1 col-lg-2 col-md-2 col-sm-3 p-5 p-sm-0 d-flex align-items-center'>
                <img className={styles.cardimg} src={imgurl}></img>
            </div>
            <div className='col-lg-4'>
                <div className='container'>
                    <div className='row my-2'>
                        <div className='col-6'>
                            <b>Username:</b>
                        </div>
                        <div className='col-6 '>
                            {data.username}
                        </div>
                    </div>
                    <div className='row my-2'>
                        <div className='col-6'>
                            <b>Bio:</b>
                        </div>
                        <div className='col-6 '>
                            {data.bio}
                        </div>
                    </div>
                    <div className='row my-2'>
                        <div className='col-6'>
                            <b>Wallet:</b>
                        </div>
                        <div className='col-6'>
                            {data.walletID.slice(0,6)}...{data.walletID.slice(data.walletID.length-4)}
                        </div>
                    </div>
                    <div className='row my-2'>
                        <div className='col-6'>
                            <b>Email:</b>
                        </div>
                        <div className='col-6'>
                            {data.email}
                        </div>
                    </div>
                    <div className='row my-2'>
                        <div className='col-6'>
                            <b>Task completed:</b>
                        </div>
                        <div className='col-6'>
                            {data.tasksAssigned}
                        </div>
                    </div>
                    <div className='row my-2'>
                        <div className='col-6'>
                            <b>Location:</b>
                        </div>
                        <div className='col-6'>
                            {data.location}
                        </div>
                    </div>
                    <div className='row my-2'>
                        <div className='col-6'>
                            <b>Skills:</b>
                        </div>
                        <div className='col-6'>
                        {skills.map((skill,key)=>{
                            return <span key={key} className="badge bg-secondary">{skillsets[skill]}</span>
                        })}
                        </div>
                    </div>

                        {account?.toLowerCase()==data.walletID.toLowerCase()?
                        <div onClick={()=>setEdit(1)} className="btn shadow bg-primary text-center text-white ">
                        Edit profile
                    </div>:
                        <div className="btn shadow bg-primary text-center text-white " data-toggle="modal" data-target="#projectInviteModal">
                            Invite for collaboration
                        </div>
                        
                        }

                </div>
            </div>
        </div>
    </div>
</div>
</div> 
  

    return<>
    <Header/>
    {edit?editprofile:displayprofile}

   

    {/* MODAL STARTS HERE */}
    <div className="modal fade" id="projectInviteModal" tabIndex="-1" role="dialog" aria-labelledby="projectInviteModal" aria-hidden="true">
    <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" > Collaboration Invite</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="container">
            <div className='row d-flex justify-content-center'>
                <div className='col-sm-3 col-md-2 d-flex align-items-center'>
                    <b>Project:</b>
                </div>
                <div className='col-sm-9 col-md-10'>
                    <select ref = {inviteproject} className="form-control my-1 mr-sm-2" >
                        {accountprojects.map((item,key)=>{
                            return <option key={key} value={item.id}>{item.title}</option>
                        })}
                    </select> 
                </div>
            </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
        <button type="button" className="btn btn-success" onClick={invite}>Invite</button>
      </div>
    </div>
    </div>
    </div>
    {/* MODAL ENDS HERE */}


    <div className='container p-5 bg-light rounded'>
        <div className='row d-flex justify-content-center'>
            <div className='col-md-6 d-flex justify-content-center'>
                <div className='container'>
                <div className='row d-flex justify-content-center'>
                    <h3 className='justify-content-center d-flex'>Projects</h3>
                </div>
                <div className='row'>
                    <div style={{height:'70vh',overflowY:'scroll'}} className='container bg-secondary p-sm-5'>
                        {projectlist}
                    </div>
                </div>
                </div>
            </div>
            <div className='col-md-6 d-flex justify-content-center'>
            <div className='container'>
                <div className='row d-flex justify-content-center'>
                    <h3 className='justify-content-center d-flex'>Certificates</h3>
                </div>
                <div className='row'>
                    <div style={{height:'70vh',overflowY:'scroll'}} className='container bg-secondary p-sm-5'>
                        {certificatelist}
                    </div>
                </div>
                </div>
                
            </div>
        </div>
    </div>
    </>
}