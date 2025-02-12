
const socket = io()
const radios = document.querySelectorAll(".radio")
const Btn = document.getElementById("Btn")
const sendbtn = document.getElementById("sBtn")
const RecevierName = document.getElementById("IDD")
const messages = document.getElementById("messages")
const msg = document.getElementById("MSG")
const SenderName = document.querySelector(".UserID").id
const chatList = document.getElementById("chatList")
const img = document.getElementById("img")
const rcvrPrfle = document.getElementById("recvrPrfle")
const imgg = document.querySelectorAll(".img")

//chat img reset
document.getElementById("reset").addEventListener("click",()=>{
img.style.backgroundImage = `url("/Public/bg/default.png")`
})


const persons = document.querySelectorAll(".person")
persons.forEach((p)=>{
    p.addEventListener("click",(e)=>{
        document.getElementById("fomr").submit()
    })
})

//select Chat img
var chatImg = ''
imgg.forEach((e)=>{
    e.addEventListener('click',(e)=>{
        document.querySelector(".selected")?.classList.remove("selected")
        e.target.classList.add("selected")
        chatImg = e.target.attributes.src.value 
    })
})

//chatBG apply btn 
document.getElementById("apply").addEventListener("click",()=>{
img.style.backgroundImage = `url("${chatImg}")`
socket.emit("chatIMG",chatImg,SenderName)
})



var room = ""
var receverName = ''
var lastdate

//DIRECT MSG
if(RecevierName.innerText !== ""){
    socket.emit("Directmsg",SenderName,RecevierName.innerText)
    receverName = RecevierName.innerText
    document.querySelector(".ReceiverName").classList.remove("ts")
    document.querySelector(".ReceiverName").classList.add("p-2")
    sendbtn.classList.replace("invisible","visible")
}

socket.on("setProfile",(Profile)=>{
    rcvrPrfle.src = Profile

})

//SELECTING ROOM
radios.forEach((radio,index) => {
    radio.labels[0].style.animationDelay = `${(index+1)*50}ms`
    radio.addEventListener("change",function(e){
        document.querySelector(".active")?.classList.remove("active")
        e.target.labels[0].classList.add("active")
        lastdate = ''
        e.preventDefault()
        room = e.target.value
        document.querySelector(".ReceiverName").classList.replace("invisible","visible")
        sendbtn.classList.replace("invisible","visible")
        messages.innerHTML = ''
        RecevierName.innerText = e.target.labels[0].innerText
        RecevierName.classList.add("p-2")
        document.querySelector(".ReceiverName").classList.remove("ts")
        receverName = RecevierName.innerText
        msg.focus()
        socket.emit("setRoomId",room,receverName)
    })
});
//SEND MESSAGE BUTTON
Btn.addEventListener("click",()=>{
    const message = msg.value
    const Ctime = moment().format('LT')
    const date = moment().format('L')
    const time = Ctime+","+date

    // CHECK DATE
    if(lastdate !== date){
        const p = document.createElement("div")
        p.classList.add("align-self-center","rounded","day")

        const span = document.createElement("span")
        span.innerText = "Today"
        span.classList.add("mx-2",'p-2',"date")

        p.appendChild(span)
        messages.appendChild(p)
        lastdate = date
    }

    const Time = time.split(",")
    const p = document.createElement("div")
    p.classList.add("p-1","rounded",'m-2',"Me","align-self-end",)

    //Message
    const msgg = document.createElement("span")
    msgg.innerText = message
    msgg.classList.add("pl-2")

    //Time
    const span = document.createElement("span")
    span.innerText = Time[0]
    span.classList.add("mx-2","text-sm")
    
    p.appendChild(msgg)
    p.appendChild(span)
    messages.appendChild(p)
    
    socket.emit("SendingMsg",message,receverName,SenderName)

    msg.value = ""
    msg.focus()
    messages.scrollTop = messages.scrollHeight


})

//RECEIVING MESSAGE
socket.on("msg",(m,Time)=>{
    const time = Time.split(",")
    const p = document.createElement("div")
    p.innerText = m
    p.classList.add("p-1","rounded",'m-2',"you","align-self-start",)

    const span = document.createElement("span")
    span.innerText = time[0]
    span.classList.add("mx-2","text-sm")

    p.appendChild(span)
    messages.appendChild(p)
    messages.scrollTop = messages.scrollHeight

})

//LOADING MESSAGES
socket.on("loadMsgs",(chats,profile)=>{
    rcvrPrfle.src = profile

    chats.forEach((msgObj,index) => {
        const time = msgObj.createdAt.split(",")
        // Date CHECK
        if(lastdate !== time[1]){
            
            const p = document.createElement("div")
            p.classList.add("align-self-center","rounded","day")
            const span = document.createElement("span")
            
            if(time[1] === moment().format('L')){
                span.innerText = "Today"
            }
            else{
                const t = time[1].split("/")
                const m = moment().format('L').split('/')
                if(Number(t[1])==(Number(m[1])-1) && t[2]==m[2] && t[0]==m[0] ){
                    
                    span.innerText = "Yesterday"
                }
                else{
                    span.innerText = time[1]
                }
            }

            span.classList.add("mx-2",'p-2',"date")

            p.appendChild(span)
            messages.appendChild(p)
            lastdate = time[1]
        }

        //CREATE MSG 
        const p = document.createElement("div")
        p.classList.add("p-1","rounded","m-2","ani")
        p.style.animationDuration = `${index*50}ms`
        p.style.width = "max-content"

         //Message
        const msgg = document.createElement("span")
        msgg.innerText = msgObj.Message
        msgg.classList.add("ps-2")

        //TIME
        const span = document.createElement("span")
        span.innerText = time[0]
        span.classList.add("mx-2","text-sm")
        
        //PLACING
        if(msgObj.senderId===SenderName){
            p.classList.add("Me","align-self-end")
        }
        else{
            p.classList.add("you","align-self-start")
        }

        p.appendChild(msgg)
        p.appendChild(span)
        messages.appendChild(p)
        });
    
     messages.scrollTop = messages.scrollHeight
})


socket.on("createList",()=>{
    const name = RecevierName.innerText
    const div = document.createElement("div")
    div.innerHTML = `<label style="width: 100%;" class="mb-2 p-2 bg-info">
                    <input type="radio" name="user" >
                    ${name}
                    </label>
                    `
    chatList.insertBefore(div,chatList.firstChild)
})

let toggle = document.querySelectorAll(".toggle")
toggle.forEach((e)=>{
    e.addEventListener("click",()=>{
        document.querySelector(".sidebar").classList.toggle("s")
    })
})
