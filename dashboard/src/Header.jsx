import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    localStorage.removeItem('auth_token');
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/home">E-com dashboard</Navbar.Brand>
        <Nav className="me-auto navbar_wrapper">
          {user && <Nav.Link as={Link} to="/home">Home</Nav.Link>}
          {user && <Nav.Link as={Link} to="/add">Add Product</Nav.Link>}
          {user && <Nav.Link as={Link} to="/update">Update Products</Nav.Link>}
          {!user && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
          {!user && <Nav.Link as={Link} to="/register">Register</Nav.Link>}
        </Nav>
        {user && (
          <Nav>
            <NavDropdown title={user.name} id="user-dropdown">
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;
