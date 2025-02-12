
function follow(id,user,event){
        if (user !== null){
            fetch(`/user/follower/${id}`,{method:"POST"})
            .then((res)=>res.text())
            .then((data)=>{
                event.target.innerText = data
            })
        }
        else{           
        document.querySelector(".test").innerHTML = ` <div class="alert alert-danger alert-dismissible fade show " role="alert">
        You are not Logged In. Please <a href="/login" class="alert-link">Login</a> to your account
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`
        }
    
}

function like(id,user,event){
    if (user !==null){
        fetch(`/user/like/${id}`,{method:"POST"})
        .then((res)=>res.json())
        .then((data)=>{
        
            if (data.like == "like")  {
                event.target.innerHTML=`
                <i style="color: red;" class="bi bi-heart-fill like"></i>
                ${data.len}`
            }
            else{
                event.target.innerHTML=`
                <i style="color: red;" class="bi bi-heart like"></i>
                ${data.len} `
            }
        })
    }
    else{

        document.querySelector(".test").innerHTML = ` <div class="alert alert-danger alert-dismissible fade show "  role="alert">
                You are not Logged In. Please <a href="/login" class="alert-link">Login</a> to your account
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
        
        
    }
}

function comment(id,event,fullName,Profile){
    var comment = event.target.parentNode.previousElementSibling   
    if(comment.value != ""){
        fetch(`/user/comment/${id}/${comment.value}`,{method:"POST"})
        .then((res)=>res.text())
        .then(data=>{
            
        })
        console.log("pr",Profile)
        const ele = event.target.parentNode.parentNode.nextElementSibling
        const cmt = document.createElement("div")
        cmt.classList.add("mt-1","d-flex")
        cmt.innerHTML = `<img style="width: 40px; height: 40px;" class="rounded-circle" src="${Profile}" alt="">
                        <div style="padding-left: 1em; margin-top: 0.25em;">
                            <div class="fw-bold">
                                ${fullName}
                            </div>
                            <div style="max-height: 150px;overflow-y: auto;" class="cmtt">
                            ${comment.value}
                            </div>
                        </div>`
        ele.insertBefore(cmt,ele.firstElementChild)
        comment.value = ""
    }
   
    return
}