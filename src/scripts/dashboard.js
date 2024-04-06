import {toast} from "./toast.js"

const baseusrl = 'http://localhost:3333'

const tokem = localStorage.getItem("@petinfo:token")

const user = await userProfile()

const green = "#168821"
const red = '#df1545'

async function userProfile(){
  const user = await fetch(`${baseusrl}/users/profile`,{
  method:"GET",
  headers:{
    Authorization: `Bearer ${tokem}`,
    'Content-Type': 'application/json'
  }
  })
  .then(async (res) => {
    const resJson = await res.json()
    localStorage.setItem("@petinfo:user",JSON.stringify(resJson))
    if(res.ok) {

      return resJson
    } else {
      location.replace("../pages/login.html")
    }
  })
  .catch(err => toast(err.message, red))

  return user
}

async function createPost(taskBody) {
    const token = localStorage.getItem('@petinfo:token')
    const newTask = await fetch(`${baseusrl}/posts/create`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(taskBody)
    })
    .then(async (res) => {
      const resJson = await res.json()
      if(res.ok) {
        toast('post criado com sucesso', green)
        return resJson
      } else {
        throw new Error(resJson.message)
      }
    })
    .catch(err => toast(err.message, red))
  
    return newTask
  }
  

async function readAllposts() {
    const token = localStorage.getItem('@petinfo:token')
   
    const allposts = await fetch(`${baseusrl}/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":"application/json"
      }
    })
    .then(async (res) => {
      if(res.ok) {
        return await res.json()
      } else {
        throw new Error('Problemas no servidor, tente novamente mais tarde')
      }
    })
    .catch(err => toast(err.message, red))
    return allposts
  }

async function updateTaskById(taskId, requestBody) {
    const token = localStorage.getItem('@petinfo:token')
   
    const post = await fetch(`${baseusrl}/posts/${taskId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(async (res) => {
      const resJson = await res.json()
  
      if(res.ok) {
        toast('Tarefa atualizada com sucesso', green)
  
        return resJson
      } else {
        throw new Error(resJson.message)
      }
    })
    .catch(err => toast(err.message, red))
  
    return post
  }

async function deletepostById(taskId) {
    const token = localStorage.getItem('@petinfo:token')
    const postdeleted = await fetch(`${baseusrl}/posts/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":"application/json"
      }
    })
    .then(async (res) => {
      const resJson = await res.json()
      if(res.ok) {
        toast('Tarefa deletada com sucesso', green)
        return resJson
      } else {
        throw new Error(resJson.message)
      }
    })
    .catch(err => toast(err.message, red))
  
    return postdeleted
  }

function createCard(post){
    const cardContainer = document.createElement("li");
    const cardHeader = document.createElement("div");
    const cardMain = document.createElement("div");
    const avatarImage = document.createElement("img");
    const userName = document.createElement("h3");
   
    const postTittle = document.createElement("h4");
    const postDescription =  document.createElement("p");
    const openButton = document.createElement("button");
    let id =""

    cardContainer.classList.add("card_container");
    cardMain.classList.add("card_main");
    cardHeader.classList.add("card_header--container");
    avatarImage.classList.add("card_avatar");
    userName.classList.add("card_username");
  
    postTittle.classList.add("card_post-tittle");
    postDescription.classList.add("card_description");
    postDescription.ariaValueMax = 150
    openButton.classList.add("card_open-button");

    avatarImage.src = post.user.avatar
    userName.innerText = post.user.username
    postTittle.innerText = post.title
    postDescription.innerText = post.content
    id = post.id
    openButton.innerText = "abrir postagem"
    
    const editmodal = modaledit(post);
    

    cardHeader.append(avatarImage,userName,);
    cardMain.append(postTittle,postDescription,openButton);
    if( user.id == post.user.id){
      const modalDelete = document.querySelector(".delete_modal")
      const deleteButton = document.createElement("button");
      const editButton = document.createElement("button");
      deleteButton.classList.add("card_delete-button");
      deleteButton.id = post.id
      editButton.classList.add("card_edit-button");
      deleteButton.innerText = "excluir"
      editButton.innerText = "editar"
      
      editButton.addEventListener("click",()=>{
        editmodal.showModal()
      })
      deleteButton.addEventListener("click",()=>{
        modalDelete.showModal()
        const btn = document.querySelector(".delete__btn--excludes")
        btn.addEventListener("click",async()=>{
          await deletepostById(id)
         

          await showposts()
          
          modalDelete.close()
        })
      })
      cardMain.append(deleteButton,editButton)
    }

    cardContainer.append(cardHeader,cardMain,editmodal);
    

    return cardContainer
}
async function render(array){
    const list = document.querySelector(".list_container")
    list.innerHTML=""
   array.forEach(post => {
      const card = createCard(post)
      list.appendChild(card)
    })
    handleDeletePost()
}

async function showposts(){
  const allposts = await readAllposts()
  render(allposts)
} 

function showAddPostModal() {
  const button = document.querySelector("#addPostButton");
  const modalController = document.querySelector(".modal__controller--post");

  button.addEventListener("click", (e) => {
    modalController.showModal();

    closeModal();
  });
}

function closeModal() {
  const button = document.querySelector("#closeModalButton");
  const modalController = document.querySelector(".modal__controller--post");

  button.addEventListener("click", () => {
    modalController.close();
  });
}


function handleNewTask() {
  const inputs = document.querySelectorAll(".create__post")
  const button = document.querySelector("#addPostSubmit")
  const modalController = document.querySelector('.modal__controller--post')
  const newTask = {}
  let count = 0

  button.addEventListener('click', async (event) => {
    event.preventDefault()

    inputs.forEach(input => {
      if (input.value.trim() === '') {
        count++
      }

      newTask[input.name] = input.value
      input.value = ""
    })

    if (count !== 0) {
      count = 0
      toast('Por favor preencha os campos necessários', red)
    } else {
      await createPost(newTask)
      modalController.close()
      showposts()


    }
  })
}

function closeModalDelete(){
  const button = document.querySelector(".cancel__delete");
  const modalController = document.querySelector(".delete_modal");

  button.addEventListener("click", () => {
    modalController.close();
})
}

function showAddlogoutModal() {
  const button = document.querySelector(".img_logout");
  const modalController = document.querySelector(".logout_modal");
  const userProfile = JSON.parse(localStorage.getItem("@petinfo:user"))
  const username = document.querySelector(".name_user")
  username.innerText = `@${userProfile.username}`

  button.addEventListener("click", (e) => {
    e.preventDefault()
    modalController.showModal();
    
    closeModalLogout()
  });
}
function closeModalLogout() {
  const button = document.querySelector(".exit_btn");
  const modalController = document.querySelector(".logout_modal");

  button.addEventListener("click", (e) => {
    e.preventDefault()
    location.replace("../../index.html")
    localStorage.clear()
    modalController.close();
  });
}
function userHeader(){
  const profile = document.querySelector(".user_identifier")
  const img = document.createElement("img")
  const name = document.createElement("p")
  const userProfile = JSON.parse(localStorage.getItem("@petinfo:user"))
  
  img.src = userProfile.avatar
  name.innerText = userProfile.username

  img.classList.add("img_logout")

  profile.append(img)
  return profile
}
function modaledit(post){
  const modalController = document.createElement("dialog");
  const modalCard = document.createElement("div")
  const titlePost = document.createElement("h2")
  const titleInput = document.createElement("textarea")
  const description = document.createElement("h3")
  const descriptionInput = document.createElement("textarea")
  const btn = document.createElement("button")

  titlePost.innerText = "título"
  titleInput.value = post.title
  description.innerText = "descrição" 
  descriptionInput.value = post.content
  btn.innerText="salvar alrerações"
  
  btn.addEventListener("click",async()=>{
    const editBody = {
      title: titleInput.value,
      content: descriptionInput.value
    }
    if(titleInput.value == "" || descriptionInput.value == ""){
      return toast("valores não podem ser vazios",red)
    }
    const editPost = await updateTaskById(post.id,editBody)
    showposts()
  })
  modalCard.append(titlePost,titleInput,description,descriptionInput,btn);
  modalController.append(modalCard);

  return modalController
}


showposts()
showAddPostModal()
closeModal()

handleNewTask()
userHeader()
showAddlogoutModal()
closeModalDelete()