import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api';

function Home({ user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest(`/products?user_id=${user.id}`);
        const data = await response.json();
        if (response.ok) {
          console.log('Products fetched:', data);
          setProducts(Array.isArray(data) ? data : []);
        } else {
          console.error('Error fetching products:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };
    
    if (user?.id) {
      fetchProducts();
    }
  }, [user]);

  return (
    <div className="home-page py-5">
      <div className="container">
        <div className="mb-5">
          <h1 className="display-5 fw-bold text-dark mb-2">Your Products</h1>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-6 mb-3">📦</div>
            <h5 className="text-muted">No products added yet</h5>
            <p className="text-muted">Start by adding your first product</p>
          </div>
        ) : (
          <div className="row g-4">
            {products.map(product => (
              <div key={product.id} className="col-lg-4 col-md-6">
                <div className="product-card card h-100 border-0 shadow-sm transition-all">
                  <div className="product-image-wrapper position-relative overflow-hidden">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        className="card-img-top" 
                        alt={product.title}
                        style={{ height: '320px', objectFit: 'cover', width: '100%' }}
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-dark fw-bold mb-2">{product.title}</h5>
                    <p className="card-text text-muted flex-grow-1" style={{ fontSize: '0.95rem' }}>
                      {product.description || 'No description available'}
                    </p>
                    
                    <div className="row g-2 mt-3 pt-3 border-top">
                      <div className="col-6">
                        <div className="bg-light p-3 rounded text-center">
                          <p className="mb-1 text-muted small">Price</p>
                          <h6 className="text-success fw-bold">LKR {parseFloat(product.price).toFixed(2)}</h6>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light p-3 rounded text-center">
                          <p className="mb-1 text-muted small">Quantity</p>
                          <h6 className="text-primary fw-bold">{product.quantity}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
