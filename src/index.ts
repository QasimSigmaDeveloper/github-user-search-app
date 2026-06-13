const form =document.querySelector("#form") as HTMLFormElement;
const user_input = document.querySelector("#user") as HTMLInputElement;
const main_container = document.querySelector(".main_container") as HTMLElement;
const URL = "https://api.github.com/users";

interface UserData {
    login:string,
    avatar_url:string,
    url:string
}

async function fetchData<T>(url:string,optional?:RequestInit):Promise<T>{
  let response = await fetch(url,optional)
  if(!response.ok){
    throw new Error(
        `Network response was not ok - status: ${response.status}`
    )
  }
   let data = await response.json()
   console.log(data)
   return data
  
}

function showUI(singleUser:UserData){
    const {login,avatar_url,url } = singleUser;
  main_container.insertAdjacentHTML("beforeend",
    `<div class="card">
    <img src=${avatar_url} alt=${login} />
    <hr/>
    <div class="card_footer">
    <img src=${avatar_url} />
    <a href=${url}>Github</a>
    </div>
    </div>`
  )  
}


function showData(url:string){
 fetchData<UserData[]>(url,{}).then((userInfo)=>{
    for(const singleUser of userInfo){
        showUI(singleUser)
    }
 })
}
showData("https://api.github.com/users")
form.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const searchValue = user_input.value.toLowerCase();
    try{
        const allUserData = await fetchData<UserData[]>(URL,{})
        const matchingUSer = allUserData.filter((singleUSer)=>{
            return singleUSer.login.toLowerCase().includes(searchValue);
        })
        
        if(matchingUSer.length === 0){
            
            main_container.insertAdjacentHTML("beforeend",
                `<p class="empty_msg">No Users Found</p>`
            )  
        }else{
            main_container.innerHTML = "";
             for(const singleUser of matchingUSer){
             showUI(singleUser)
    }
        }


    }catch(err){
        console.error(err)
    }
})


