interface popupProps {
    isOpen: boolean;
    message: string;
    onClose: () => void;
  }
  
  const popup: React.FC<popupProps> = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <p>{message}</p>
          <button onClick={onClose} style={{ marginTop: '10px' }}>Close</button>
        </div>
      </div>
    );
  }
  
  export default popup;
  