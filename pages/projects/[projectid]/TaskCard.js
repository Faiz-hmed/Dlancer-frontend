import Link from "next/link"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { abi,addresses} from "@/constants";
import { ethers } from "ethers";

export default function TaskCard({task,projectid,usermode}){
    const router = useRouter();
    const [data, setData] = useState(null);
    const {chainId:chainIdhex,isWeb3Enabled} = useMoralis();
    const chainId = parseInt(chainIdhex);
    const {runContractFunction:getValues} = useWeb3Contract(
        {
            abi:abi,
            contractAddress:task.contractAddress,
            functionName:"getValues",
            chainId:chainId,
        }
    )
    const handleDelete = ()=>{
        fetch('http://localhost:5000/api/tasks/'+projectid+'?taskid='+task._id,{method:'DELETE'}).then((res)=>{
            if(res.status!=200) throw new Error(res.json().message);
            window.location.reload();
        }).catch((e)=>{
            console.error(e);
        })
    }
    
    const handleView = async()=>{
        // fetch('http://localhost:5000/api/tasks/',).then((res)=>{
        //     if(res.status!=200) throw new Error(res.json().message);
        //     return res.json();
        // })
        // .then((res)=>{
        //     if (res.title && res.description) {
        //         setData(res);
        //       } else {
        //         throw new Error("Title and description not found");
        //       }
        // })
        // .catch((e)=>{
        //     console.error(e);
        // })
        // const provider = ethers.getDefaultProvider();
        // const taskContract = new ethers.Contract(task.contractAddress, abi,provider);
        // console.log(taskContract)
        try{
           const arraydata = await getValues();
           const resObj = {
            title:arraydata[0],
            description:arraydata[1],
            employee:arraydata[2],
            reward:ethers.utils.formatEther(arraydata[3]),
            deadline:arraydata[4].toString(),
            cancelled:arraydata[5],
            completed:arraydata[6]    
            }
            setData(resObj);
        }catch(e) {
            console.error(e.message)
        }
    }
  
       return <div  className="card shadow text-dark my-3">
        <div className="card-body">
            <div className="container ">
                <div className="row d-flex align-items-center">
                    <div className="col-sm-6 col-md-2">
                        <b>Task Name:</b>
                    </div>
                    <div className="col-sm-6 col-md-2">
                        {task.taskName}
                    </div>
                    <div className="col-sm-6 col-md-2">
                        <b>Freelancer:</b>
                    </div>
                    <div className="col-sm-6 col-md-2">
                        {task.freelancer.slice(0,6)}...{task.freelancer.slice(task.freelancer.length-4)}
                    </div>
             
                        {usermode!=0?
                            <div className="col-sm-6 col-md-4 d-flex flex-row-reverse">
                        <div className="btn btn-danger" onClick={handleDelete}>Remove</div>
                         <div className="btn btn-primary" data-toggle="modal" data-target="#viewModal" onClick={handleView}>View</div>
                         </div>
                        :
                        <div className="col-sm-6 col-md-4 d-flex flex-row-reverse">
                        <div className="btn btn-primary" onClick={()=>{router.push(`/projects/${projectid}/${task._id}`)}}>Open</div>
                            </div>
                    }


<div className="modal fade" id="viewModal" tabIndex="-1" role="dialog" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{data?.title}</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <div className="container">
            <div className="row">
                <div className="col-sm-4">
                    description:
                </div>
                <div className="col-sm-8">
                    {data?.description}
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    Freelancer:
                </div>
                <div className="col-sm-8">
                {data?.employee.slice(0,6)}...{data?.employee.slice(data?.employee.length-4)}
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    reward:
                </div>
                <div className="col-sm-8">
                    {data?.reward} USD
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    deadline:
                </div>
                <div className="col-sm-8">
                    {data?.deadline}
                </div>
            </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>


                </div>
            </div>
            

        </div>

        


    </div>
}
