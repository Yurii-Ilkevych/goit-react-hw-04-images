import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Overlay, Modalka } from './Modal.styled';
import { createPortal } from 'react-dom';
const modalRoot = document.querySelector('#modal-root');
function Modal({src, alt, onClose})  {

  useEffect(() => {
    const handleKey = (event) => {
      if (event.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);


  
  const handleClick = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

    return createPortal(
      <Overlay onClick={handleClick}>
        <Modalka>
          <img src={src} alt={alt} />
        </Modalka>
      </Overlay>,
      modalRoot
    );
}

export default Modal;

Modal.propTypes = {
    onClose: PropTypes.func.isRequired,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
}