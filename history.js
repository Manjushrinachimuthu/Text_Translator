document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  const { username, email } = userData;

  document.getElementById("userEmail").textContent = email;
  document.getElementById("userName").textContent = username;
  document.getElementById("userAvatar").textContent = username.charAt(0).toUpperCase();

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  fetch(`http://localhost:3000/api/history?username=${username}&email=${email}`)
    .then(res => res.json())
    .then(data => loadHistory(data))
    .catch(err => console.error("Error loading history:", err));
});

function loadHistory(data) {
  const tableBody = document.querySelector("#historyTable tbody");
  tableBody.innerHTML = "";

  if (data.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" style="text-align:center;">No history found</td>`;
    tableBody.appendChild(tr);
    return;
  }

  data.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.input_text}</td>
      <td>${row.translated_text}</td>
      <td>${row.source_language || "-"}</td>
      <td>${row.target_language}</td>
      <td>${new Date(row.timestamp).toLocaleString()}</td>
    `;
    tableBody.appendChild(tr);
  });
}
