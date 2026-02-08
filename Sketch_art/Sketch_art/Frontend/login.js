const LOGIN_URL = "http://localhost:8080/api/login";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      alert("⚠️ Invalid credentials");
      return;
    }

    const data = await res.json();

    // ✅ Save login info
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("isLoggedIn", "true");

    alert("✅ Login successful!");

    // ✅ Redirect based on role
    if (data.role === "ADMIN") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "gallery.html";
    }

  } catch (err) {
    console.error("⚠️ Login error:", err);
    alert("⚠️ Something went wrong during login");
  }
});
