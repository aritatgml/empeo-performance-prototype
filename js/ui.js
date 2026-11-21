// Modal and toast helpers.

function showModal(s) {
  document.getElementById("modal").innerHTML = s;
  document.getElementById("modalBack").classList.add("show");
}

function closeModal() {
  document.getElementById("modalBack").classList.remove("show");
}

function showToast(s) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText =
      "position:fixed;bottom:22px;right:22px;background:#232038;color:white;padding:13px 17px;border-radius:9px;box-shadow:0 8px 25px #0002;z-index:40";
    document.body.appendChild(t);
  }
  t.textContent = s;
  t.style.display = "block";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => (t.style.display = "none"), 2800);
}

document.getElementById("modalBack").addEventListener("click", (e) => {
  if (e.target.id === "modalBack") closeModal();
});
