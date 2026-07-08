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

async function registerUser() {
    const name = getInputValue("registerName");
    const email = getInputValue("registerEmail");
    const password = getInputValue("registerPassword");

    if (!name || !email || !password) {
        showMessage(registerMessage, "Please fill all register fields.", "error");
        return;
    }

    if (password.length < 6) {
        showMessage(registerMessage, "Password must be at least 6 characters.", "error");
        return;
    }

    showMessage(registerMessage, "Creating account...", "info");

    try {
        const data = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password })
        });

        if (data.token) {
            saveSession(data);
            showMessage(registerMessage, "Account created successfully.", "success");
            checkAuthState();
            return;
        }

        showMessage(registerMessage, data.message || "Registration failed.", "error");
    } catch (error) {
        showMessage(registerMessage, error.message, "error");
    }
}

async function loginUser() {
    const email = getInputValue("loginEmail");
    const password = getInputValue("loginPassword");

    if (!email || !password) {
        showMessage(loginMessage, "Please enter email and password.", "error");
        return;
    }

    showMessage(loginMessage, "Logging in...", "info");

    try {
        const data = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        if (data.token) {
            saveSession(data);
            showMessage(loginMessage, "Login successful.", "success");
            checkAuthState();
            return;
        }

        showMessage(loginMessage, data.message || "Login failed.", "error");
    } catch (error) {
        showMessage(loginMessage, error.message, "error");
    }
}

function savePost() {
    if (editingPostId) {
        updatePost();
        return;
    }

    createPost();
}

async function createPost() {
    const postData = getPostFormData();

    if (!postData) {
        return;
    }

    showMessage(postMessage, "Publishing post...", "info");

    try {
        const data = await apiRequest("/posts", {
            method: "POST",
            token: getToken(),
            body: JSON.stringify(postData)
        });

        if (data.post || data.message) {
            showMessage(postMessage, "Post published successfully.", "success");
            clearPostForm();
            loadPosts();
        }
    } catch (error) {
        showMessage(postMessage, error.message, "error");
    }
}

async function updatePost() {
    const postData = getPostFormData();

    if (!postData) {
        return;
    }

    showMessage(postMessage, "Updating post...", "info");

    try {
        await apiRequest(`/posts/${editingPostId}`, {
            method: "PUT",
            token: getToken(),
            body: JSON.stringify(postData)
        });

        showMessage(postMessage, "Post updated successfully.", "success");
        editingPostId = null;
        createPostBtn.textContent = "Publish Post";
        clearPostForm();
        loadPosts();
    } catch (error) {
        showMessage(postMessage, error.message, "error");
    }
}

async function deletePost(postId) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");

    if (!confirmDelete) {
        return;
    }

    try {
        await apiRequest(`/posts/${postId}`, {
            method: "DELETE",
            token: getToken()
        });

        showMessage(postMessage, "Post deleted successfully.", "success");
        loadPosts();
    } catch (error) {
        showMessage(postMessage, error.message, "error");
    }
}

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

function clearPostForm() {
    document.getElementById("postTitle").value = "";
    document.getElementById("postCategory").value = "";
    document.getElementById("postContent").value = "";
}

async function loadPosts() {
    postsGrid.innerHTML = `<p class="empty-text">Loading posts...</p>`;

    try {
        const data = await apiRequest("/posts");
        const posts = data.posts || [];
        const currentUser = getStoredUser();

        postsGrid.innerHTML = "";

        if (posts.length === 0) {
            postsGrid.innerHTML = `<p class="empty-text">No posts published yet.</p>`;
            return;
        }

        posts.forEach(function (post) {
            postsGrid.appendChild(createPostCard(post, currentUser));
        });
    } catch (error) {
        postsGrid.innerHTML = `<p class="empty-text">Could not load posts. Please try again.</p>`;
    }
}

function createPostCard(post, currentUser) {
    const postCard = document.createElement("article");
    const isOwner = currentUser && post.author && post.author._id === currentUser.id;
    const category = document.createElement("span");
    const title = document.createElement("h3");
    const excerpt = document.createElement("p");
    const author = document.createElement("small");

    postCard.className = "post-card";
    category.textContent = post.category || "General";
    title.textContent = post.title || "Untitled post";
    excerpt.textContent = createExcerpt(post.content);
    author.textContent = `By ${post.author ? post.author.name : "Unknown author"}`;

    postCard.append(category, title, excerpt, author);

    if (isOwner) {
        const actions = document.createElement("div");
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        actions.className = "post-actions";
        editBtn.className = "small-btn edit-btn";
        deleteBtn.className = "small-btn danger-btn delete-btn";
        editBtn.type = "button";
        deleteBtn.type = "button";
        editBtn.textContent = "Edit";
        deleteBtn.textContent = "Delete";

        editBtn.addEventListener("click", function () {
            startEditPost(post);
        });

        deleteBtn.addEventListener("click", function () {
            deletePost(post._id);
        });

        actions.append(editBtn, deleteBtn);
        postCard.appendChild(actions);
    }

    return postCard;
}

function checkAuthState() {
    const token = getToken();
    const user = getStoredUser();

    if (token && user) {
        authSection.style.display = "none";
        dashboardSection.style.display = "block";
        welcomeTitle.textContent = `Welcome, ${user.name}`;
        return;
    }

    authSection.style.display = "grid";
    dashboardSection.style.display = "none";
}

function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    editingPostId = null;
    createPostBtn.textContent = "Publish Post";
    clearPostForm();
    checkAuthState();
    loadPosts();
}

async function apiRequest(endpoint, options = {}) {
    const headers = {
        "Content-Type": "application/json"
    };

    if (options.token) {
        headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
        method: options.method || "GET",
        headers,
        body: options.body
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Request failed. Please try again.");
    }

    return data;
}

function getPostFormData() {
    const title = getInputValue("postTitle");
    const category = getInputValue("postCategory");
    const content = getInputValue("postContent");

    if (!title || !category || !content) {
        showMessage(postMessage, "Please fill all post fields.", "error");
        return null;
    }

    return { title, category, content };
}

function saveSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
}

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        return null;
    }
}

function getToken() {
    return localStorage.getItem("token");
}

function getInputValue(id) {
    return document.getElementById(id).value.trim();
}

function createExcerpt(content = "") {
    if (content.length <= 150) {
        return content;
    }

    return `${content.slice(0, 150)}...`;
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message-text ${type}`;
}
