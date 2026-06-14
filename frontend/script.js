const API = "https://task-manager-9jcw.onrender.com";

async function register() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
        window.location = "index.html";
    }
}

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    localStorage.setItem("token", data.token);

    alert("Login Successful");

    window.location = "dashboard.html";
}

async function addTask() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    await fetch(`${API}/api/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({
            title,
            description,
            dueDate,
            priority
        })
    });

    alert("Task Added Successfully");

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("priority").value ="Medium";

    loadTasks();
}

async function deleteTask(id) {

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    await fetch(`${API}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
            "x-auth-token": localStorage.getItem("token")
        }
    });

    alert("Task Deleted");

    loadTasks();
}

async function completeTask(id) {

    await fetch(`${API}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token")
        },
        body: JSON.stringify({
            status: "Completed"
        })
    });

    alert("Task Completed");

    loadTasks();
}

async function editTask(
    id,
    oldTitle,
    oldDescription,
    oldStatus,
    oldPriority
) {

    const title = prompt(
        "Edit Title",
        oldTitle
    );

    if (title === null) return;

    const description = prompt(
        "Edit Description",
        oldDescription
    );

    if (description === null) return;

    const priority = prompt(
        "Priority (High/Medium/Low)",
        oldPriority
    );

    if(priority === null) return;

    const status = prompt(
        "Status (Pending / Completed)",
        oldStatus
    );

    if (status === null) return;

    await fetch(`${API}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-auth-token":
            localStorage.getItem("token")
        },
        body: JSON.stringify({
            title,
            description,
            status,
            priority
        })
    });

    alert("Task Updated");

    loadTasks();
}

function logout() {

    localStorage.removeItem("token");

    window.location = "index.html";
}

async function loadTasks() {

    const res = await fetch(`${API}/api/tasks`, {
        headers: {
            "x-auth-token": localStorage.getItem("token")
        }
    });

    const tasks = await res.json();

    const total = tasks.length;

    const completed =
    tasks.filter(
        task => task.status === "Completed"
    ).length;

    const pending = total - completed;

    if(document.getElementById("totalTasks")){
        document.getElementById("totalTasks").innerText = total;
    }

    if(document.getElementById("completedTasks")){
        document.getElementById("completedTasks").innerText = completed;
    }

    if(document.getElementById("pendingTasks")){
        document.getElementById("pendingTasks").innerText = pending;
    }

    const searchBox =
    document.getElementById("search");

    const search =
    searchBox
    ? searchBox.value.toLowerCase()
    : "";

    let html = "";

    tasks
    .filter(task =>
        task.title
        .toLowerCase()
        .includes(search)
    )
    .forEach(task => {

        html += `
        <div class="task">

            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <p>
            Priority:
            <span class="${
                task.priority === "High"? "high"
                : task.priority === "Medium"
                ? "medium"
                : "low"}">
                ${task.priority}
            </span>
            </p>

            <p>
                Status:
                <span class="${
                    task.status === "Completed"
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

            ${
                task.status === "Pending"
                ?
                `
                <button
                onclick="completeTask('${task._id}')">
                    Complete
                </button>

                <br><br>
                `
                :
                ""
            }

            <button
            onclick="editTask(
'${task._id}',
'${task.title}',
'${task.description}',
'${task.status}','${task.priority}'
)">
                Edit
            </button>

            <br><br>

            <button
            onclick="deleteTask('${task._id}')">
                Delete
            </button>

        </div>
        `;
    });

    if(document.getElementById("tasks")){
        document.getElementById("tasks").innerHTML = html;
    }

    if(document.getElementById("taskCount")){
        document.getElementById("taskCount")
        .innerText = `Total Tasks: ${tasks.length}`;
    }
}

if(document.getElementById("tasks")){
    loadTasks();
}