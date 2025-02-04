
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
            console.log(event.target)
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

        document.querySelector(".test").innerHTML = ` <div class="alert alert-danger alert-dismissible fade show " role="alert">
                You are not Logged In. Please <a href="/login" class="alert-link">Login</a> to your account
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
        
        
    }
}