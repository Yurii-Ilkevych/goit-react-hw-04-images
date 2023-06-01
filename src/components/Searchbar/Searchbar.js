import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Head,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
} from './Searchbar.styled';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { AiOutlineSearch } from 'react-icons/ai';
import { IconContext } from 'react-icons';
function Searchbar({ onForm }) {
  const [name, setName] = useState('');

  const handleText = event => {
    const { value } = event.currentTarget;
    setName(value);
  };

  const hundleSubmit = event => {
    event.preventDefault();
    if (name.trim() === '') {
      toast.error('invalid name Search !');
      return;
    }
    onForm(name);
    setName('');
  };
  return (
    <Head>
      <SearchForm onSubmit={hundleSubmit}>
        <SearchFormButton type="submit">
          <IconContext.Provider value={{ color: 'blue', size: '3em' }}>
            <AiOutlineSearch />
          </IconContext.Provider>
        </SearchFormButton>
        <SearchFormInput
          onChange={handleText}
          type="text"
          autocomplete="off"
          value={name}
          placeholder="Search images and photos"
        />
      </SearchForm>
    </Head>
  );
}

export default Searchbar;

Searchbar.propTypes = {
  onForm: PropTypes.func.isRequired,
};
