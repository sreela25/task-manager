const API = "http://localhost:5000";

async function register(){

    const name =
    document.getElementById("name").value;

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const res = await fetch(
        `${API}/api/auth/register`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password
            })
        }
    );

    const data = await res.json();

    alert(data.message);

    window.location="login.html";
}

async function login(){

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const res = await fetch(
        `${API}/api/auth/login`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await res.json();

    localStorage.setItem(
        "token",
        data.token
    );

    window.location="dashboard.html";
}

async function addTask(){

    const title =
    document.getElementById("title").value;

    const description =
    document.getElementById("description").value;

    const dueDate =
    document.getElementById("dueDate").value;

    await fetch(
        `${API}/api/tasks`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "x-auth-token":
                localStorage.getItem("token")
            },
            body:JSON.stringify({
                title,
                description,
                dueDate
            })
        }
    );

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";

    loadTasks();
}

async function deleteTask(id){

    await fetch(
        `${API}/api/tasks/${id}`,
        {
            method:"DELETE",
            headers:{
                "x-auth-token":
                localStorage.getItem("token")
            }
        }
    );

    loadTasks();
}

function logout(){

    localStorage.removeItem("token");

    window.location="login.html";
}

async function completeTask(id){

    await fetch(
        `${API}/api/tasks/${id}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "x-auth-token":
                localStorage.getItem("token")
            },
            body:JSON.stringify({
                status:"Completed"
            })
        }
    );

    loadTasks();
}

async function loadTasks(){

    const res = await fetch(
        `${API}/api/tasks`,
        {
            headers:{
                "x-auth-token":
                localStorage.getItem("token")
            }
        }
    );

    const tasks = await res.json();

    let html = "";

    tasks.forEach(task=>{

        html += `
<div class="task">

    <h3>${task.title}</h3>

    <p>${task.description}</p>

    <p>
        Status:
        <span class="${
            task.status==="Completed"
            ? "completed"
            : "pending"
        }">
            ${task.status}
        </span>
    </p>

    <p>
        Due:
        ${new Date(task.dueDate)
        .toLocaleDateString()}
    </p>

    <button
    onclick="completeTask('${task._id}')">
    Complete
    </button>
    <br><br>
    <button
    onclick="deleteTask('${task._id}')">
    Delete
    </button>

</div>
`;
    });

    document.getElementById("tasks")
    .innerHTML = html;
    document.getElementById("taskCount").innerText =`Total Tasks: ${tasks.length}`;
}

if(document.getElementById("tasks")){
    loadTasks();
}

if(document.getElementById("tasks")){
    loadTasks();
}