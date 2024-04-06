import { toast } from "./toast.js";

const green = "#168821";
const red = '#df1545';
async function loginRequest(loginbody){
    const token = await fetch(`http://localhost:3333/login`,{
        method:"POST",
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify(loginbody)
    })
    .then(async (res)=>{
        const resJson = await res.json()
        if(res.ok){
            const {name,token} = resJson
            localStorage.setItem("@petinfo:token", resJson.token)
            toast("login realizado com sucesso",green)
            return resJson
        }else{
            throw new Error(resJson.message)
        }
    })
    .catch(err => toast(err.message,red))
    return token
}

function loginUser(){
    const inputs = document.querySelectorAll(".register_input-log");
    const button = document.querySelector(".btn_login")
    let User = {}
 
    button.addEventListener("click",(event)=>{
     event.preventDefault()
     inputs.forEach(input=>{
        toast("login realizado com sucesso",green)
         User[input.name] = input.value
         setTimeout(() => {
            location.replace('../pages/dashboard.html')
          }, 2000);
     })
     loginRequest(User)
    })
 }

 function backRegister(){
    const button = document.querySelector(".register_button");

    button.addEventListener("click",(event)=>{
        event.preventDefault()
        location.replace("../../index.html")
    })
}

 loginUser()
 backRegister()