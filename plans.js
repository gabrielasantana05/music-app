function openPlan(name, price) {
  document.getElementById("title").innerText = name;
  document.getElementById("price").innerText = "Price: " + price;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function confirmPlan() {
  document.getElementById("popup").style.display = "none";
  alert("✅ Plan activated (demo only)");
}
