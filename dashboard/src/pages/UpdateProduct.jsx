import React, { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../api';

function UpdateProduct({ user }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      const response = await apiRequest(`/products?user_id=${user.id}`);
      const data = await response.json();
      if (!response.ok) {
        const message = data?.message || 'Unable to load products.';
        setError(message);
        setProducts([]);
        return;
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Unable to load products.');
      setProducts([]);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchProducts();
  }, [user, fetchProducts]);

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setTitle(product.title);
    setDescription(product.description || '');
    setPrice(product.price);
    setQuantity(product.quantity);
    setImageFile(null);
    setImagePreview(product.image_url || null);
    setMessage('');
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const updateProduct = async () => {
    if (!selectedProduct) {
      setError('Select a product to update.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('user_id', user.id);
      formData.append('_method', 'PUT');
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await apiRequest(`/products/${selectedProduct.id}`, {
        method: 'POST',
        body: formData,
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.errors ? Object.values(body.errors).flat().join(' ') : 'Unable to update product.');
        return;
      }
      setMessage('Product updated successfully.');
      setImageFile(null);
      fetchProducts();
      setSelectedProduct(body);
      setImagePreview(body.image_url || null);
    } catch (err) {
      console.error(err);
      setError('Unable to update product.');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    try {
      const response = await apiRequest(`/products/${id}?user_id=${user.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setError('Unable to delete product.');
        return;
      }
      setMessage('Product deleted successfully.');
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(null);
        setTitle('');
        setDescription('');
        setPrice('');
        setQuantity('');
      }
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError('Unable to delete product.');
    }
  };

  if (!user) {
    return (
      <div className="col-sm-6 offset-sm-3">
        <h1>Update Product</h1>
        <div className="alert alert-warning">Please login first to manage products.</div>
      </div>
    );
  }

  return (
    <div className="product-form">
      <h1>Update Products</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <div className="mb-4">
        <h4>Product list</h4>
        {products.length === 0 && <p>No products available yet.</p>}
        <div className="list-group">
          {products.map((product) => (
            <div key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                {product.image_url ? (
                  <img 
                    src={product.image_url.startsWith('http') ? product.image_url : `http://127.0.0.1:8000${product.image_url}`}
                    alt={product.title} 
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} 
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : null}
                <div>
                  <strong>{product.title}</strong>
                  <div className="small text-muted">Price: LKR {product.price}    Qty: {product.quantity}</div>
                </div>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => selectProduct(product)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="mb-3">
          <h4>Edit selected product</h4>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" step="0.01" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Quantity</label>
            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Product Image</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
          </div>
          {imagePreview && (
            <div className="mb-3">
              <img 
                src={imagePreview.startsWith('http') ? imagePreview : imagePreview.startsWith('blob:') ? imagePreview : `http://127.0.0.1:8000${imagePreview}`}
                alt="Preview" 
                className="img-fluid rounded" 
                style={{ maxHeight: '240px' }} 
              />
            </div>
          )}
          <button className="btn btn-success" onClick={updateProduct}>Update Product</button>
        </div>
      )}
    </div>
  );
}

export default UpdateProduct;
