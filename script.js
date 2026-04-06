// ---------------------- DATA ----------------------
let jobs = JSON.parse(localStorage.getItem("jobs")) || [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions",
    location: "Delhi",
    salary: 35000,
    description: "Build responsive websites using HTML, CSS, JavaScript and React."
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CodeCraft",
    location: "Bangalore",
    salary: 50000,
    description: "Develop secure APIs and server-side applications using Node.js and databases."
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Mumbai",
    salary: 30000,
    description: "Design user-friendly interfaces, prototypes and improve user experience."
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Insight Ltd",
    location: "Hyderabad",
    salary: 45000,
    description: "Analyze business data, create reports and dashboards using Excel, SQL and Power BI."
  },
  {
    id: 5,
    title: "Python Developer",
    company: "NextGen Tech",
    location: "Noida",
    salary: 60000,
    description: "Work on Python applications, automation scripts and backend systems."
  }
];

let savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
let applications = JSON.parse(localStorage.getItem("applications")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let selectedJobId = null;

// ---------------------- ELEMENTS ----------------------
const jobsContainer = document.getElementById("jobsContainer");
const savedJobsContainer = document.getElementById("savedJobsContainer");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const darkModeToggle = document.getElementById("darkModeToggle");

// ---------------------- INIT ----------------------
renderJobs(jobs);
renderSavedJobs();
updateProfile();
loadDarkMode();

// ---------------------- RENDER JOBS ----------------------
function renderJobs(jobList) {
  jobsContainer.innerHTML = "";

  if (jobList.length === 0) {
    jobsContainer.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobList.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Salary:</strong> ₹${job.salary}/month</p>
      <div class="job-actions">
        <button class="details-btn" onclick="openJobModal(${job.id})">View Details</button>
        <button class="save-btn" onclick="saveJob(${job.id})">Save Job</button>
      </div>
    `;

    jobsContainer.appendChild(card);
  });
}

// ---------------------- SAVED JOBS ----------------------
function renderSavedJobs() {
  savedJobsContainer.innerHTML = "";

  if (savedJobs.length === 0) {
    savedJobsContainer.innerHTML = "<p>No saved jobs yet.</p>";
    updateProfile();
    return;
  }

  savedJobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Salary:</strong> ₹${job.salary}/month</p>
      <div class="job-actions">
        <button class="details-btn" onclick="openJobModal(${job.id})">View Details</button>
        <button onclick="removeSavedJob(${job.id})">Remove</button>
      </div>
    `;

    savedJobsContainer.appendChild(card);
  });

  updateProfile();
}

function saveJob(jobId) {
  const job = jobs.find((j) => j.id === jobId);

  if (!currentUser) {
    alert("Please login first to save jobs.");
    return;
  }

  const alreadySaved = savedJobs.some((j) => j.id === jobId);
  if (alreadySaved) {
    alert("Job already saved.");
    return;
  }

  savedJobs.push(job);
  localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  renderSavedJobs();
  alert("Job saved successfully.");
}

function removeSavedJob(jobId) {
  savedJobs = savedJobs.filter((job) => job.id !== jobId);
  localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
  renderSavedJobs();
}

// ---------------------- JOB DETAILS MODAL ----------------------
function openJobModal(jobId) {
  const job = jobs.find((j) => j.id === jobId);
  selectedJobId = jobId;

  document.getElementById("modalJobTitle").textContent = job.title;
  document.getElementById("modalCompany").textContent = job.company;
  document.getElementById("modalLocation").textContent = job.location;
  document.getElementById("modalSalary").textContent = job.salary;
  document.getElementById("modalDescription").textContent = job.description;

  document.getElementById("jobModal").style.display = "block";
}

function closeJobModal() {
  document.getElementById("jobModal").style.display = "none";
}

document.getElementById("modalApplyBtn").addEventListener("click", function () {
  closeJobModal();

  if (!currentUser) {
    alert("Please login first to apply.");
    return;
  }

  document.getElementById("applicantName").value = currentUser.name || "";
  document.getElementById("applicantEmail").value = currentUser.email || "";
  document.getElementById("applyModal").style.display = "block";
});

function closeApplyModal() {
  document.getElementById("applyModal").style.display = "none";
}

// ---------------------- APPLY FORM ----------------------
document.getElementById("applyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  const applicantName = document.getElementById("applicantName").value.trim();
  const applicantEmail = document.getElementById("applicantEmail").value.trim();
  const applicantResume = document.getElementById("applicantResume").value.trim();
  const applicantMessage = document.getElementById("applicantMessage").value.trim();
  const applyMessage = document.getElementById("applyMessage");

  if (!applicantName || !applicantEmail || !applicantResume || !applicantMessage) {
    applyMessage.style.color = "red";
    applyMessage.textContent = "Please fill all fields.";
    return;
  }

  const appliedJob = jobs.find((j) => j.id === selectedJobId);

  applications.push({
    jobId: selectedJobId,
    jobTitle: appliedJob.title,
    name: applicantName,
    email: applicantEmail,
    resume: applicantResume,
    message: applicantMessage,
    userEmail: currentUser.email
  });

  localStorage.setItem("applications", JSON.stringify(applications));

  applyMessage.style.color = "green";
  applyMessage.textContent = "Application submitted successfully.";

  document.getElementById("applyForm").reset();
  updateProfile();

  setTimeout(() => {
    closeApplyModal();
    applyMessage.textContent = "";
  }, 1200);
});

// ---------------------- SEARCH ----------------------
function searchJobs() {
  const input = document.getElementById("jobSearch").value.toLowerCase();
  const filtered = jobs.filter((job) =>
    job.title.toLowerCase().includes(input) ||
    job.company.toLowerCase().includes(input)
  );
  renderJobs(filtered);
}

// ---------------------- FILTER ----------------------
function filterJobs() {
  const locationValue = document.getElementById("locationFilter").value;
  const salaryValue = document.getElementById("salaryFilter").value;

  let filtered = jobs;

  if (locationValue) {
    filtered = filtered.filter((job) => job.location === locationValue);
  }

  if (salaryValue) {
    filtered = filtered.filter((job) => Number(job.salary) >= Number(salaryValue));
  }

  renderJobs(filtered);
}

function resetFilters() {
  document.getElementById("locationFilter").value = "";
  document.getElementById("salaryFilter").value = "";
  document.getElementById("jobSearch").value = "";
  renderJobs(jobs);
}

// ---------------------- AUTH FORM SWITCH ----------------------
loginBtn.addEventListener("click", () => {
  loginBtn.classList.add("active");
  signupBtn.classList.remove("active");
  loginForm.classList.add("active-form");
  signupForm.classList.remove("active-form");
});

signupBtn.addEventListener("click", () => {
  signupBtn.classList.add("active");
  loginBtn.classList.remove("active");
  signupForm.classList.add("active-form");
  loginForm.classList.remove("active-form");
});

// ---------------------- SIGNUP ----------------------
signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const signupMessage = document.getElementById("signupMessage");

  if (!name || !email || !password || !confirmPassword) {
    signupMessage.style.color = "red";
    signupMessage.textContent = "Please fill all fields.";
    return;
  }

  if (password.length < 6) {
    signupMessage.style.color = "red";
    signupMessage.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (password !== confirmPassword) {
    signupMessage.style.color = "red";
    signupMessage.textContent = "Passwords do not match.";
    return;
  }

  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    signupMessage.style.color = "red";
    signupMessage.textContent = "User already exists with this email.";
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  signupMessage.style.color = "green";
  signupMessage.textContent = "Signup successful. Please login.";
  signupForm.reset();
});

// ---------------------- LOGIN ----------------------
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const loginMessage = document.getElementById("loginMessage");

  const matchedUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!matchedUser) {
    loginMessage.style.color = "red";
    loginMessage.textContent = "Invalid email or password.";
    return;
  }

  currentUser = matchedUser;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  loginMessage.style.color = "green";
  loginMessage.textContent = "Login successful.";
  loginForm.reset();
  updateProfile();
});

// ---------------------- PROFILE ----------------------
function updateProfile() {
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileSavedCount = document.getElementById("profileSavedCount");
  const profileAppliedCount = document.getElementById("profileAppliedCount");

  if (currentUser) {
    profileName.textContent = currentUser.name;
    profileEmail.textContent = currentUser.email;

    const userApplications = applications.filter(
      (app) => app.userEmail === currentUser.email
    );

    profileSavedCount.textContent = savedJobs.length;
    profileAppliedCount.textContent = userApplications.length;
  } else {
    profileName.textContent = "Not logged in";
    profileEmail.textContent = "Not logged in";
    profileSavedCount.textContent = "0";
    profileAppliedCount.textContent = "0";
  }
}

// ---------------------- RECRUITER DASHBOARD ----------------------
document.getElementById("jobPostForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("jobTitle").value.trim();
  const company = document.getElementById("companyName").value.trim();
  const location = document.getElementById("jobLocation").value.trim();
  const salary = document.getElementById("jobSalary").value.trim();
  const description = document.getElementById("jobDescription").value.trim();

  const newJob = {
    id: Date.now(),
    title,
    company,
    location,
    salary: Number(salary),
    description
  };

  jobs.push(newJob);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  renderJobs(jobs);
  this.reset();
  alert("Job posted successfully.");
});

// ---------------------- DARK MODE ----------------------
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("darkMode", "enabled");
    darkModeToggle.textContent = "☀ Light Mode";
  } else {
    localStorage.setItem("darkMode", "disabled");
    darkModeToggle.textContent = "🌙 Dark Mode";
  }
});

function loadDarkMode() {
  const darkMode = localStorage.getItem("darkMode");

  if (darkMode === "enabled") {
    document.body.classList.add("dark");
    darkModeToggle.textContent = "☀ Light Mode";
  }
}

// ---------------------- CLOSE MODAL OUTSIDE CLICK ----------------------
window.addEventListener("click", function (e) {
  const jobModal = document.getElementById("jobModal");
  const applyModal = document.getElementById("applyModal");

  if (e.target === jobModal) {
    jobModal.style.display = "none";
  }

  if (e.target === applyModal) {
    applyModal.style.display = "none";
  }
});