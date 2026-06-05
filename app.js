const apiUrl = "https://nexsoft-blog.onrender.com/api";

const authSection = document.getElementById("authSection");
const dashboardSection = document.getElementById("dashboardSection");

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const createPostBtn = document.getElementById("createPostBtn");

const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");
const postMessage = document.getElementById("postMessage");

const welcomeTitle = document.getElementById("welcomeTitle");
const postsGrid = document.getElementById("postsGrid");

let editingPostId = null;

registerBtn.addEventListener("click", registerUser);
loginBtn.addEventListener("click", loginUser);
logoutBtn.addEventListener("click", logoutUser);
createPostBtn.addEventListener("click", savePost);

checkAuthState();
loadPosts();

// Register new user and save JWT
async function registerUser() {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!name || !email || !password) {
        showMessage(registerMessage, "Please fill all register fields.", "error");
        return;
    }

    if (password.length < 6) {
        showMessage(registerMessage, "Password must be at least 6 characters.", "error");
        return;
    }

    showMessage(registerMessage, "Creating account...", "info");

    const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showMessage(registerMessage, "Account created successfully.", "success");
        checkAuthState();
    } else {
        showMessage(registerMessage, data.message || "Registration failed.", "error");
    }
}

// Login user and save JWT
async function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        showMessage(loginMessage, "Please enter email and password.", "error");
        return;
    }

    showMessage(loginMessage, "Logging in...", "info");

    const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        showMessage(loginMessage, "Login successful.", "success");
        checkAuthState();
    } else {
        showMessage(loginMessage, data.message || "Login failed.", "error");
    }
}

// Create or update a protected blog post
async function savePost() {
    if (editingPostId) {
        updatePost();
    } else {
        createPost();
    }
}

// Create a protected blog post
async function createPost() {
    const title = document.getElementById("postTitle").value.trim();
    const category = document.getElementById("postCategory").value.trim();
    const content = document.getElementById("postContent").value.trim();

    const token = localStorage.getItem("token");

    if (!title || !category || !content) {
        showMessage(postMessage, "Please fill all post fields.", "error");
        return;
    }

    showMessage(postMessage, "Publishing post...", "info");

    const response = await fetch(`${apiUrl}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, category, content })
    });

    const data = await response.json();

    if (response.ok) {
        showMessage(postMessage, "Post published successfully.", "success");
        clearPostForm();
        loadPosts();
    } else {
        showMessage(postMessage, data.message || "Post creation failed.", "error");
    }
}

// Update selected blog post
async function updatePost() {
    const title = document.getElementById("postTitle").value.trim();
    const category = document.getElementById("postCategory").value.trim();
    const content = document.getElementById("postContent").value.trim();

    const token = localStorage.getItem("token");

    if (!title || !category || !content) {
        showMessage(postMessage, "Please fill all post fields.", "error");
        return;
    }

    showMessage(postMessage, "Updating post...", "info");

    const response = await fetch(`${apiUrl}/posts/${editingPostId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, category, content })
    });

    const data = await response.json();

    if (response.ok) {
        showMessage(postMessage, "Post updated successfully.", "success");

        createPostBtn.textContent = "Publish Post";
        editingPostId = null;

        clearPostForm();
        loadPosts();
    } else {
        showMessage(postMessage, data.message || "Post update failed.", "error");
    }
}

// Delete selected blog post
async function deletePost(postId) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");

    if (!confirmDelete) {
        return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(`${apiUrl}/posts/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (response.ok) {
        showMessage(postMessage, "Post deleted successfully.", "success");
        loadPosts();
    } else {
        showMessage(postMessage, data.message || "Post delete failed.", "error");
    }
}

// Put selected post data into form
function startEditPost(post) {
    editingPostId = post._id;

    document.getElementById("postTitle").value = post.title;
    document.getElementById("postCategory").value = post.category;
    document.getElementById("postContent").value = post.content;

    createPostBtn.textContent = "Update Post";
    showMessage(postMessage, "Editing mode enabled.", "info");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Clear post form
function clearPostForm() {
    document.getElementById("postTitle").value = "";
    document.getElementById("postCategory").value = "";
    document.getElementById("postContent").value = "";
}

// Load all published posts
async function loadPosts() {
    const response = await fetch(`${apiUrl}/posts`);
    const data = await response.json();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    postsGrid.innerHTML = "";

    if (!data.posts || data.posts.length === 0) {
        postsGrid.innerHTML = `<p class="empty-text">No posts published yet.</p>`;
        return;
    }

    data.posts.forEach(function (post) {
        const postCard = document.createElement("article");
        postCard.className = "post-card";

        const isOwner = currentUser && post.author && post.author._id === currentUser.id;

        postCard.innerHTML = `
            <span>${post.category}</span>
            <h3>${post.title}</h3>
            <p>${post.content.substring(0, 140)}...</p>
            <small>By ${post.author.name}</small>

            ${
                isOwner
                    ? `
                        <div class="post-actions">
                            <button class="small-btn edit-btn">Edit</button>
                            <button class="small-btn danger-btn delete-btn">Delete</button>
                        </div>
                    `
                    : ""
            }
        `;

        if (isOwner) {
            const editBtn = postCard.querySelector(".edit-btn");
            const deleteBtn = postCard.querySelector(".delete-btn");

            editBtn.addEventListener("click", function () {
                startEditPost(post);
            });

            deleteBtn.addEventListener("click", function () {
                deletePost(post._id);
            });
        }

        postsGrid.appendChild(postCard);
    });
}

// Show dashboard if user is logged in
function checkAuthState() {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
        authSection.style.display = "none";
        dashboardSection.style.display = "block";
        welcomeTitle.textContent = `Welcome, ${user.name}`;
    } else {
        authSection.style.display = "grid";
        dashboardSection.style.display = "none";
    }
}

// Logout user
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    editingPostId = null;
    createPostBtn.textContent = "Publish Post";

    clearPostForm();
    checkAuthState();
    loadPosts();
}

// Show status message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message-text ${type}`;
}