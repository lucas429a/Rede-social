/* Desenvolva seu código aqui */
import { toast } from "./toast.js"
export const baseUrl = "http://localhost:3333"
export const green = "#168821"
export const red = '#df1545'

async function Createuser(requestbody){
    const newUser = await fetch (`${baseUrl}/users/create`,{
        method : "POST",
        headers:{
            "content-type":'application/json'
        },
        body:JSON.stringify(requestbody)
    })
    .then (async(res)=>{
        const resJson = await res.json()
        if(res.ok){
            toast("Usuário criado com sucesso",green)
            return resJson
        }else{
            throw new Error(
                resJson.message
            );
        }
    })
    .catch((err)=>{
        toast(err.message,red)
    })
}

function registerUser(){
   const inputs = document.querySelectorAll(".register_input");
   const button = document.querySelector(".register_button");
   let newUser = {}

   button.addEventListener("click",(event)=>{
    event.preventDefault()
    inputs.forEach(input=>{
        newUser[input.name] = input.value
    })
    Createuser(newUser)
   })
}

function backLogin(){
    const button = document.getElementById("buttonTurnBack");

    button.addEventListener("click",(event)=>{
        event.preventDefault()
        location.replace("./src/pages/login.html")
    })
}

registerUser()
backLogin()
