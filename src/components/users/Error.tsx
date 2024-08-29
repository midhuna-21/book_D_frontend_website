import { useLocation, useNavigate } from 'react-router-dom';

const Error = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const error = location?.state?.error;
    const from = location?.state?.from ;

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f7f7f7',
            flexDirection: 'column',
            textAlign: 'center'
        }}>
            <h1 style={{
                fontSize: '6rem',
                color: '#333',
                marginBottom: '20px'
            }}>404</h1>
            <h2 style={{
                fontSize: '2rem',
                color: '#666',
                marginBottom: '10px'
            }}>Oops! Page Not Found</h2>
            {error && <p style={{
                color: '#999',
                fontSize: '1.2rem',
                marginBottom: '30px'
            }}>{error}</p>}
            <button onClick={() => navigate(from)}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    textDecoration: 'none'
                }}
            >
                Go Back
            </button>
        </div>
    );
};

export default Error;
