const tasksContainer=document.querySelector(".task-cont");
const tasklayout=document.querySelector(".task");
const userinput= document.querySelector(".userinput");
const submit= document.querySelector(".submit");
const form =document.querySelector("#add-form");
const pinned_tasks = document.querySelector(".pinned-tasks"); 
const completed_tasks = document.querySelector(".completed-tasks"); 
const new_tasks = document.querySelector(".new-tasks"); 




let obj = {};

function loadtasks(){
    obj = JSON.parse(localStorage.getItem("task") || '{}');
    for(key in obj){
        if(obj[key].status=="new")
            addtask(key,obj[key].id,new_tasks);
        else if(obj[key].status=="pinned")
             addtask(key,obj[key].id,pinned_tasks);
        else if(obj[key].status=="marked")
             addtask(key,obj[key].id,completed_tasks);
    }
}




// creartng div 
function creatediv(classes){
    const div=document.createElement("div")
    if(Array.isArray(classes)){
        classes.forEach(c => {
            div.classList.add(`${c}`)
        });  
    }
    else{
        div.classList.add(`${classes}`)
    }
    return div
}

// creating tasks
function addtask(taskmessage,num,parentCont){

    const task=creatediv("task");
    const taskname=creatediv("task-name")
    const taskbtn=creatediv("task-btn-cont")
    const marked=creatediv(["task-btn","marked"])
    const pinned=creatediv(["task-btn","pinned"])
    const deleted=creatediv(["task-btn","delete"])

    taskname.textContent=taskmessage
    if(parentCont==completed_tasks) marked.textContent="NM";
    else marked.textContent = "M";
    if(parentCont==pinned_tasks) pinned.textContent="U";
    else     
        pinned.textContent="P";
    deleted.textContent="X";
    task.id = num;
    task.classList.add("new");
    task.appendChild(taskname)
    taskbtn.appendChild(marked)
    taskbtn.appendChild(pinned)
    taskbtn.appendChild(deleted)
    task.appendChild(taskbtn)
    // console.log(task);
    parentCont.appendChild(task);
}



function saveData(){
    localStorage.setItem("task",JSON.stringify(obj));
}


form.addEventListener("submit",(e)=>{
    e.preventDefault();
    message=userinput.value;
    let length = Object.entries(obj).length;
    obj[message]={id:length+1,status:"new"};
    saveData();
    addtask(message,length+1,new_tasks)
    userinput.value="";
})



tasksContainer.addEventListener("click",(e)=>{
    if(e.target.classList.contains("delete")){
        e.target.parentElement.parentElement.remove();
        // console.log((e.target.parentElement).parentElement.id)
        const task=e.target.parentElement.parentElement.id;
        // console.log(task);
        
        delete obj[task]
        
    }else if (e.target.textContent=="P"){
        const num = e.target.parentElement.parentElement.id;
        obj[e.target.parentElement.parentElement.children[0].textContent].status="pinned";
        // console.log(e.target.textContent);
        e.target.textContent = "U";
        pinned_tasks.appendChild(e.target.parentElement.parentElement);
        let msg = e.target.parentElement.parentElement.children[0].innerText;                                                     ;
        // e.target.parentElement.parentElement.remove();
        // addtask(msg,num,pinned_tasks);
    }else if(e.target.textContent=="U"){
        e.target.textContent="P";
        obj[e.target.parentElement.parentElement.children[0].textContent].status="new";
        new_tasks.appendChild(e.target.parentElement.parentElement);
        pinned_tasks.innerHTML="";
        new_tasks.innerHTML="";
        completed_tasks.innerHTML="";
        saveData()
        loadtasks();
    }else if (e.target.textContent=="M"){
        e.target.textContent = "NM";
        obj[e.target.parentElement.parentElement.children[0].textContent].status="marked";
        completed_tasks.appendChild(e.target.parentElement.parentElement);
         

        
    }else if(e.target.textContent=="NM"){
        obj[e.target.parentElement.parentElement.children[0].textContent].status="new";
        e.target.textContent="M";
        new_tasks.appendChild(e.target.parentElement.parentElement);
        pinned_tasks.innerHTML="";
        new_tasks.innerHTML="";
        completed_tasks.innerHTML="";
        saveData()
        loadtasks();
    }
    
    saveData(); 
});


// Search Functionality



let searchInput = document.querySelector("#search");
searchInput.addEventListener("input",(val)=>{
    let allTasks = document.querySelectorAll(".task");
    if(val.target.value!=null){
     searchData = val.target.value.toLowerCase();
    allTasks.forEach(t =>{
        let text = t.children[0].textContent.toLowerCase();
        if(searchData=="")
             t.style.display="flex";
        else if(!text.startsWith(searchData))
            t.style.display="none";
        else 
            t.style.display="flex";
    })
}
})

// Edit tasks

let oldMsg ;

tasksContainer.addEventListener("dblclick",(e)=>{
    if(e.target.classList.contains("task-name")){
        oldMsg = e.target.textContent;
        e.target.contentEditable ="true";
        e.target.focus();
        saveData();
    }
})
tasksContainer.addEventListener("focusout",(e)=>{
    if(e.target.classList.contains("task-name")){
        e.target.contentEditable="false";
        obj[(e.target.textContent)]=obj[oldMsg];
        delete obj[oldMsg];
        console.log(oldMsg);
        saveData();
    }
})

loadtasks()


