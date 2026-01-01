const productsContainer = document.getElementById("productsContainer");
const addProductBtn = document.getElementById("addProductBtn");
const productModal = document.getElementById("productModal");
const closeModal = document.querySelector(".close");
const productForm = document.getElementById("productForm");
let editingProductId = null;

// Check admin token
if (!localStorage.getItem("adminToken")) window.location.href = "index.html";

// Load products
async function loadProducts() {
  const { data: products, error } = await supabase.from("products").select("*");
  if (error) return alert(error.message);

  productsContainer.innerHTML = "";
  products.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("productCard");
    div.innerHTML = `
      <h3>${product.name}</h3>
      <p>Brand: ${product.brand}</p>
      <p>Price: Rs ${product.price}</p>
      <p>${product.description || ""}</p>
      <button onclick="editProduct(${product.id})">Edit</button>
      <button onclick="deleteProduct(${product.id})">Delete</button>
    `;
    productsContainer.appendChild(div);
  });
}

loadProducts();

// Open modal
addProductBtn.addEventListener("click", () => {
  editingProductId = null;
  productForm.reset();
  document.getElementById("modalTitle").textContent = "Add Product";
  productModal.style.display = "block";
});

// Close modal
closeModal.onclick = () => { productModal.style.display = "none"; }
window.onclick = (e) => { if (e.target == productModal) productModal.style.display = "none"; }

// Add/Edit product
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const productData = {
    name: formData.get("name"),
    brand: formData.get("brand"),
    price: Number(formData.get("price")),
    description: formData.get("description"),
    photos: formData.get("photos") ? formData.get("photos").split(",") : [],
    size: formData.get("size") ? formData.get("size").split(",").map(Number) : [],
    isaccessory: formData.get("isaccessory") ? true : false
  };

  if (editingProductId) {
    const { error } = await supabase.from("products").update(productData).eq("id", editingProductId);
    if (error) return alert(error.message);
  } else {
    const { error } = await supabase.from("products").insert([productData]);
    if (error) return alert(error.message);
  }

  productModal.style.display = "none";
  loadProducts();
});

// Edit product
window.editProduct = async (id) => {
  const { data } = await supabase.from("products").select("*").eq("id", id).single();
  editingProductId = id;
  document.getElementById("modalTitle").textContent = "Edit Product";

  productForm.name.value = data.name;
  productForm.brand.value = data.brand;
  productForm.price.value = data.price;
  productForm.description.value = data.description;
  productForm.photos.value = data.photos.join(",");
  productForm.size.value = data.size.join(",");
  productForm.isaccessory.checked = data.isaccessory;

  productModal.style.display = "block";
}

// Delete product
window.deleteProduct = async (id) => {
  if (!confirm("Are you sure?")) return;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return alert(error.message);
  loadProducts();
}
