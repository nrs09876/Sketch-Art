const API_URL = "http://localhost:8080/api/sketches";

// =========================
// ROLE-BASED ACCESS CONTROL
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const role = sessionStorage.getItem("role");

  // ✅ Agar admin.html page hai aur role != ADMIN, to redirect
  if (currentPage === "admin.html" && role !== "ADMIN") {
    alert("❌ Access denied! Only Admins can open this page.");
    window.location.href = "index.html";
  }

  // ✅ Agar user logged in nahi hai aur admin.html khol raha hai
  if (currentPage === "admin.html" && !role) {
    alert("⚠️ Please login first!");
    window.location.href = "login.html";
  }

  // ✅ Auto load data if admin page
  if (currentPage === "admin.html") {
    loadSketches();
    loadContacts();
  }

  // ✅ Auto load gallery if gallery page
  if (document.getElementById("gallery-data")) {
    loadGallery();
  }
});

// =========================
// CONTACTS MANAGEMENT
// =========================
const CONTACT_API = "http://localhost:8080/api/contact/all";
const DELETE_CONTACT_API = "http://localhost:8080/api/contact/delete/";

async function loadContacts() {
  const tbody = document.getElementById("contactTableBody");
  if (!tbody) return;

  try {
    const res = await fetch(CONTACT_API);
    const contacts = await res.json();
    tbody.innerHTML = "";

    contacts.forEach(c => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.message}</td>
        <td><button class="btn-delete" onclick="deleteContact(${c.id})">Delete</button></td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("⚠️ Error loading contacts:", err);
  }
}

async function deleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) return;
  try {
    const res = await fetch(DELETE_CONTACT_API + id, { method: "DELETE" });
    if (res.ok) {
      alert("✅ Contact deleted!");
      loadContacts();
    } else {
      alert("⚠️ Failed to delete contact");
    }
  } catch (err) {
    console.error("⚠️ Delete error:", err);
  }
}

// =========================
// GALLERY MANAGEMENT (Admin)
// =========================
const sketchTable = document.querySelector("#sketchTable tbody");
const formSection = document.getElementById("formSection");
const formTitle = document.getElementById("formTitle");
const sketchForm = document.getElementById("sketchForm");

const sketchIdInput = document.getElementById("sketchId");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const imageUrlInput = document.getElementById("imageUrl");

async function loadSketches() {
  if (!sketchTable) return;
  try {
    const res = await fetch(API_URL);
    const sketches = await res.json();

    sketchTable.innerHTML = "";
    sketches.forEach(sketch => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${sketch.id}</td>
        <td>${sketch.title}</td>
        <td>${sketch.description}</td>
        <td><img src="${sketch.imageUrl}" width="80"></td>
        <td>
          <button class="btn-edit" onclick="editSketch(${sketch.id})">Edit</button>
          <button class="btn-delete" onclick="deleteSketch(${sketch.id})">Delete</button>
        </td>
      `;
      sketchTable.appendChild(row);
    });
  } catch (err) {
    console.error("⚠️ Error loading sketches:", err);
  }
}

function showForm() {
  if (!formSection) return;
  formSection.style.display = "block";
  formTitle.innerText = "Add Sketch";
  sketchForm.reset();
  sketchIdInput.value = "";
}

async function editSketch(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const sketch = await res.json();
    sketchIdInput.value = sketch.id;
    titleInput.value = sketch.title;
    descInput.value = sketch.description;
    imageUrlInput.value = sketch.imageUrl;
    formTitle.innerText = "Edit Sketch";
    formSection.style.display = "block";
  } catch (err) {
    console.error("⚠️ Error editing sketch:", err);
  }
}

async function deleteSketch(id) {
  if (!confirm("Delete this sketch?")) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    alert("✅ Deleted successfully!");
    loadSketches();
    loadGallery();
  } catch (err) {
    console.error("⚠️ Error deleting sketch:", err);
  }
}

if (sketchForm) {
  sketchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = sketchIdInput.value;
    const data = {
      title: titleInput.value,
      description: descInput.value,
      imageUrl: imageUrlInput.value
    };

    try {
      let res;
      if (id) {
        res = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      }

      if (res.ok) {
        alert(id ? "✅ Sketch updated!" : "✅ Sketch added!");
        sketchForm.reset();
        formSection.style.display = "none";
        loadSketches();
      } else {
        const err = await res.text();
        alert("⚠️ Error: " + err);
      }
    } catch (err) {
      console.error("⚠️ Save error:", err);
    }
  });
}

// =========================
// GALLERY PAGE (User Side)
// =========================
const galleryGrid = document.getElementById("gallery-data");
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

async function loadGallery() {
  if (!galleryGrid) return;
  try {
    const res = await fetch(API_URL);
    const sketches = await res.json();

    galleryGrid.innerHTML = "";
    sketches.forEach(sketch => {
      const card = document.createElement("div");
      card.className = "gallery-card";
      card.innerHTML = `
        <img src="${sketch.imageUrl}" alt="${sketch.title}" onclick="showImage('${sketch.imageUrl}')">
        <h3>${sketch.title}</h3>
        <p>${sketch.description}</p>
      `;
      galleryGrid.appendChild(card);
    });
  } catch (err) {
    console.error("⚠️ Error loading gallery:", err);
  }
}

function showImage(url) {
  if (!modalImage || !imageModal) return;
  modalImage.src = url;
  imageModal.style.display = "flex";
}

if (closeModal) {
  closeModal.onclick = () => imageModal.style.display = "none";
}
if (imageModal) {
  imageModal.onclick = (e) => {
    if (e.target === imageModal) imageModal.style.display = "none";
  };
}
