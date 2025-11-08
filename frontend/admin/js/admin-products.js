// document.addEventListener('DOMContentLoaded', () => {
//   const token = localStorage.getItem('adminToken');
//   const tableBody = document.getElementById('product-table-body');
//   const addForm = document.getElementById('add-product-form');
//   const msgBox = document.getElementById('form-msg');
//   const imageInput = document.getElementById('product-image');
//   const imagePreview = document.getElementById('image-preview');

//   if (!token) {
//     window.location.href = 'login.html';
//     return;
//   }

//   const headers = {
//     'Authorization': `Bearer ${token}`
//   };

//   // ✅ Preview uploaded image
//   imageInput.addEventListener('change', () => {
//     const file = imageInput.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = e => {
//         imagePreview.src = e.target.result;
//         imagePreview.classList.remove('hidden');
//       };
//       reader.readAsDataURL(file);
//     } else {
//       imagePreview.classList.add('hidden');
//     }
//   });

//   // ✅ Load all products
//   async function loadProducts() {
//     tableBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
//     try {
//       const res = await fetch('http://localhost:8000/api/product', { headers });
//       const data = await res.json();

//       if (!res.ok) {
//         tableBody.innerHTML = `<tr><td colspan="5">${data.msg || 'Failed to fetch products.'}</td></tr>`;
//         return;
//       }

//       if (data.length === 0) {
//         tableBody.innerHTML = `<tr><td colspan="5">No products found.</td></tr>`;
//         return;
//       }

//       tableBody.innerHTML = data
//         .map(
//           (p) => `
//           <tr>
//             <td>${p.name}</td>
//             <td>${p.category || '—'}</td>
//             <td>₹${p.price.toLocaleString()}</td>
//             <td>${p.quantity > 0 ? p.quantity : '<span class="out-stock">Out</span>'}</td>
//             <td>
//               <button class="btn btn-danger btn-sm delete-btn" data-id="${p._id}">Delete</button>
//             </td>
//           </tr>`
//         )
//         .join('');

//       // ✅ Attach delete listeners
//       document.querySelectorAll('.delete-btn').forEach(btn => {
//         btn.addEventListener('click', async (e) => {
//           const id = e.target.getAttribute('data-id');
//           if (!confirm('Are you sure you want to delete this product?')) return;

//           try {
//             const delRes = await fetch(`http://localhost:8000/api/product/${id}`, {
//               method: 'DELETE',
//               headers
//             });
//             const delData = await delRes.json();
//             if (!delRes.ok) alert(delData.msg || 'Delete failed');
//             else loadProducts();
//           } catch (err) {
//             alert('Server error while deleting.');
//           }
//         });
//       });
//     } catch (err) {
//       tableBody.innerHTML = `<tr><td colspan="5">Error loading products.</td></tr>`;
//       console.error(err);
//     }
//   }

//   // ✅ Add new product (multipart/form-data)
//   addForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     msgBox.textContent = '';

//     const formData = new FormData(addForm);

//     try {
//       const res = await fetch('http://localhost:8000/api/product', {
//         method: 'POST',
//         headers,
//         body: formData
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         msgBox.textContent = data.msg || 'Failed to add product.';
//         msgBox.className = 'error';
//         return;
//       }

//       msgBox.textContent = '✅ Product added successfully!';
//       msgBox.className = 'success';
//       addForm.reset();
//       imagePreview.classList.add('hidden');
//       loadProducts();
//     } catch (err) {
//       msgBox.textContent = '⚠️ Server error while adding.';
//       msgBox.className = 'error';
//     }
//   });

//   loadProducts();
// });



document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('adminToken');
  const tableBody = document.getElementById('product-table-body');
  const addForm = document.getElementById('add-product-form');
  const msgBox = document.getElementById('form-msg');
  const imageInput = document.getElementById('product-image');
  const imagePreview = document.getElementById('image-preview');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const headers = { 'Authorization': `Bearer ${token}` };

  // ✅ Preview uploaded image
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.classList.add('hidden');
    }
  });

  // ✅ Load all products
  async function loadProducts() {
    tableBody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    try {
      const res = await fetch('http://localhost:8000/api/product', { headers });
      const data = await res.json();

      if (!res.ok) {
        tableBody.innerHTML = `<tr><td colspan="5">${data.msg || 'Failed to fetch products.'}</td></tr>`;
        return;
      }

      if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5">No products found.</td></tr>`;
        return;
      }

      tableBody.innerHTML = data.map(p => `
        <tr>
          <td>${p.name}</td>
          <td>${p.category || '—'}</td>
          <td>₹${p.price.toLocaleString()}</td>
          <td>${p.quantity > 0 ? p.quantity : '<span class="out-stock">Out</span>'}</td>
          <td>
            <button class="btn btn-edit btn-sm edit-btn" data-id="${p._id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${p._id}">Delete</button>
          </td>
        </tr>`
      ).join('');

      attachActionListeners();
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="5">Error loading products.</td></tr>`;
      console.error(err);
    }
  }

  // ✅ Attach event listeners for edit & delete buttons
  function attachActionListeners() {
    // Delete button
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = e.target.getAttribute('data-id');
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
          const delRes = await fetch(`http://localhost:8000/api/product/${id}`, {
            method: 'DELETE',
            headers
          });
          const delData = await delRes.json();
          if (!delRes.ok) alert(delData.msg || 'Delete failed');
          else loadProducts();
        } catch (err) {
          alert('Server error while deleting.');
        }
      });
    });

    // Edit button
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = e.target.getAttribute('data-id');
        try {
          const res = await fetch(`http://localhost:8000/api/product/${id}`, { headers });
          const product = await res.json();

          if (!res.ok) {
            alert(product.msg || 'Failed to fetch product details');
            return;
          }

          // Fill the form with existing product data
          document.getElementById('product-name').value = product.name;
          document.getElementById('product-category').value = product.category;
          document.getElementById('product-description').value = product.description;
          document.getElementById('product-price').value = product.price;
          document.getElementById('product-quantity').value = product.quantity;

          msgBox.textContent = `Editing: ${product.name}`;
          msgBox.className = 'info';

          // Change button to "Update Product"
          const submitBtn = addForm.querySelector('button[type="submit"]');
          submitBtn.textContent = 'Update Product';
          submitBtn.classList.add('btn-warning');

          // Replace form submit handler temporarily
          addForm.onsubmit = async ev => {
            ev.preventDefault();

            const formData = new FormData(addForm);
            try {
              const updateRes = await fetch(`http://localhost:8000/api/product/${id}`, {
                method: 'PUT',
                headers,
                body: formData
              });
              const updateData = await updateRes.json();

              if (!updateRes.ok) {
                msgBox.textContent = updateData.msg || 'Failed to update product.';
                msgBox.className = 'error';
                return;
              }

              msgBox.textContent = '✅ Product updated successfully!';
              msgBox.className = 'success';
              addForm.reset();
              imagePreview.classList.add('hidden');
              submitBtn.textContent = 'Add Product';
              submitBtn.classList.remove('btn-warning');
              addForm.onsubmit = defaultSubmitHandler;
              loadProducts();
            } catch (err) {
              msgBox.textContent = '⚠️ Server error while updating.';
              msgBox.className = 'error';
            }
          };
        } catch (err) {
          alert('Error fetching product details.');
        }
      });
    });
  }

  // ✅ Default Add Product handler
  const defaultSubmitHandler = async e => {
    e.preventDefault();
    msgBox.textContent = '';

    const formData = new FormData(addForm);
    try {
      const res = await fetch('http://localhost:8000/api/product', {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        msgBox.textContent = data.msg || 'Failed to add product.';
        msgBox.className = 'error';
        return;
      }

      msgBox.textContent = '✅ Product added successfully!';
      msgBox.className = 'success';
      addForm.reset();
      imagePreview.classList.add('hidden');
      loadProducts();
    } catch (err) {
      msgBox.textContent = '⚠️ Server error while adding.';
      msgBox.className = 'error';
    }
  };

  addForm.onsubmit = defaultSubmitHandler;
  loadProducts();
});
