import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

function AddProduct({ user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setMessage('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!title || !price || !quantity) {
      setError('Please complete title, price and quantity.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('user_id', user.id);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await apiRequest('/products', {
        method: 'POST',
        body: formData,
      });

      const body = await response.json();
      if (!response.ok) {
        setError(body.errors ? Object.values(body.errors).flat().join(' ') : 'Unable to add product.');
        return;
      }

      setMessage('Product added successfully.');
      setTitle('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError('Unable to add product. Please try again.');
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="col-sm-6 offset-sm-3">
        <h1>Add Product</h1>
        <div className="alert alert-warning">Please login first to add products.</div>
      </div>
    );
  }

  return (
    <div className="product-form">
      <h1>Add Product</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
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
          <img src={imagePreview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '240px' }} />
        </div>
      )}
      <button className="btn btn-primary" onClick={handleSubmit}>Save Product</button>
    </div>
  );
}

export default AddProduct;
