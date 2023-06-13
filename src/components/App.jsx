import { useState } from 'react';
import PropTypes from 'prop-types';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import { ToastContainer } from 'react-toastify';
import { AppWrapper } from './App.styled';

function App() {
  const [name, setName] = useState('');
  const hundleForm = name => {
    setName(name);
  };
  return (
    <AppWrapper>
      <Searchbar onForm={hundleForm} />
      <ImageGallery searchValueProp={name} />
      <ToastContainer position={'top-left'} autoClose={3000} />
    </AppWrapper>
  );
}

export default App;

App.propTypes = {
  name: PropTypes.string,
};
