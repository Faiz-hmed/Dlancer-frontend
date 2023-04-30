import { useEffect, useRef, useState } from "react";
import {useWeb3Contract,useMoralis} from 'react-moralis'
import { abi,addresses,BUSDabi } from "@/constants";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { skillsets } from "@/constants";
export default function AddTask(){
    const tokenAddress = '0x21E0F5d54E45CE43f465a19AA3668F03be118CfC'
    const {account} = useMoralis();
    const taskname = useRef("");
    const description = useRef("");
    const testCases = useRef([]);
    const freelancer = useRef("");
    const reward = useRef("");
    const timelimit = useRef(0);
    const {chainId:chainIdhex} = useMoralis();
    const chainId = parseInt(chainIdhex);
    const contractAddress= addresses[chainId]?addresses[chainId][addresses[chainId].length-1]:null;
    const router = useRouter();
    const [skills, setSkills] = useState([]);
    const [collaborators,setCollaborators] = useState([]);

    useEffect(()=>{
        // router.query.projectid
        console.log(router.query.projectid)
        fetch('http://localhost:5000/api/tasks/collaborators?projectid='+router.query.projectid).then((res)=>{
            return res.json();
        }).then((res)=>{
            console.log(res)
            setCollaborators(res.collaborators);
        })
    },[])

    const handleSkillAdd = (e) => {
        const selectedSkill = e.target.value;
        if (!skills.includes(selectedSkill)) {
          setSkills([...skills, selectedSkill]);
        }    
      }
      
    const handleSkillRemove = (skill) => {
        setSkills(skills.filter((s) => s !== skill))
      }

    
      
    const {runContractFunction:activateTask} = useWeb3Contract(
        {
            abi:abi,
            contractAddress:contractAddress,
            functionName:"activateTask",
            
            params:{_reward: ethers.utils.parseEther(reward.current?.value || "0")},
            chainId:chainId,
            
            msgValue:ethers.utils.parseEther(reward.current?.value || "0")
        }
    )

        const onActivate = async ()=>{
            const reqObj = {name:taskname.current.value,description:description.current.value,deadline:timelimit.current.value,employer:account,employee:freelancer.current.value,amount:reward.current.value}
            console.log(reqObj)
            fetch('http://localhost:5000/api/tasks/',{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify(reqObj)
            }).then((res)=>{
                return res.json();
            }).then((res)=>{
                console.log('contract address is '+res.address);
                return res.address;
            }).then(async(contractAddress)=>{

            try {
                //after deploying the contract on the backend, execute below functions using contractAddress obtained from serverside
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const taskContract = new ethers.Contract(contractAddress, abi, signer);
                const tokenContract = new ethers.Contract(tokenAddress, BUSDabi, signer);
                // const approveTx = await tokenContract.connect(signer).approve(contractAddress,ethers.utils.parseUnits("5000") );
                // const tx = await taskContract.activateTask();
                const result = await taskContract.isActivated();
                console.log(result)

                fetch('http://localhost:5000/api/tasks/'+router.query.projectid,{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify({contractAddress:contractAddress,name:taskname.current.value,employee:freelancer.current.value,requiredSkills:skills})
                }).then((res)=>{
                    if(res.status!=200) throw new Error("could not activate task")
                    return res.json();
                }).then((res)=>{
                    console.log("Task successfully created");
                    router.back()
                }).catch((e)=>{console.error(e)})

            } catch (error) {
                console.error(error);
            }

                
            }).catch((e)=>{
                console.error(e)
            })
       
        }
   

    const TestCase = ()=>{
        return <div className="col-sm-10">
        <div className="form-group row my-3">
            <label htmlFor="title" className="col-sm-1 col-form-label">Input</label>
                <div className="col-sm-5">
                    <textarea type="text" className="form-control" />
                </div>
            <label htmlFor="title" className="col-sm-1 col-form-label">Output</label>
                <div className="col-sm-5">
                    <textarea type="text" className="form-control"/>
                </div>
            </div>
        </div>
    }


    return (
        <div className="container p-5">
        <div className="card">
            <div className="card-header">
                <div className="display-6 text-center">Create a Task</div>
            </div>
            <div className="card-body">
                <div className="container">
                    <div className="form-group row my-3">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Task name</label>
                        <div className="col-sm-10">
                            <input ref={taskname} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row my-3">
                        <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
                        <div className="col-sm-10">
                            <textarea type="text" ref={description} rows={4} className="form-control" />
                        </div>
                    </div>
                    <div className="form-group row my-3">
                        <label htmlFor="test cases" className="col-sm-2 col-form-label">Test Cases</label>
                        <TestCase></TestCase>
                    </div>
                    <div className="form-group row my-3">
                        <label htmlFor="time-limit" className="col-sm-2 col-form-label">Time limit</label>
                        <div className="col-sm-4"><input ref={timelimit} min={1} type="number" placeholder="in hrs" className="form-control"/></div>
                        
                        <label htmlFor="time-limit" className="col-sm-2 col-form-label">Reward</label>
                        <div className="col-sm-4"><input ref={reward} type="text" placeholder="in ETH" className="form-control"/></div>
                    </div>
                    <div className="form-group row my-3">
                    <label htmlFor="contributor"  className="col-sm-2 col-form-label">freelancer</label>
                        <div className="col-sm-4">
                        <select ref={freelancer} className="form-control my-1 mr-sm-2" >
                            {collaborators.map((collaborator)=>{
                                return <option key={collaborator._id} value={collaborator.walletID}>{collaborator.username}</option>
                            })}
                            {/* <option value="0xB45C57b446C82d93f5c4282eE8A47Ca149A4b042">Admin</option>
                            <option value="0x66A296555bD0750635e8C3A8168Ed64d928E577a">employee</option>
                            <option value="0x89E2Da7cAC0360e7796722bA47b40c46A9CFEF39">testnet</option>
                            <option value="0xb2bf46A95dCfd3B3Cc42A5BF7649378dd07c4fbD">owner</option> */}
                        </select>
                        </div>
                    </div>
                    <div className='form-group row my-2'>
                    <label htmlFor="skills" className="col-sm-2 col-form-label">Skills</label>

                        <div className='col-sm-4'>
      
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

                    <div className = "form-group row my-3 d-flex flex-row-reverse">
                        <div className="col-sm-1">
                        <button className="btn btn-primary" onClick={async()=>await onActivate()}>Create</button>
                        </div>
                        <div className="col-sm-1">
                        <button className="btn btn-danger" onClick={()=>router.back()}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}