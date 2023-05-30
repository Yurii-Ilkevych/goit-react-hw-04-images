import React, { Component } from 'react';
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
class Searchbar extends Component {
  state = {
    name: '',
  };

  handleText = event => {
    const { value } = event.currentTarget;
    this.setState({
      name: value,
    });
  };

  hundleSubmit = event => {
    event.preventDefault();
    if (this.state.name.trim() === '') {
      toast.error('invalid name Search !');
      return;
    }
    this.props.onForm(this.state.name);
    this.setState({
      name: '',
    });
  };

  render() {
    const { name } = this.state;
    return (
      <Head>
        <SearchForm onSubmit={this.hundleSubmit}>
          <SearchFormButton type="submit">
            <IconContext.Provider value={{ color: 'blue', size: '3em' }}>
              <AiOutlineSearch />
            </IconContext.Provider>
          </SearchFormButton>
          <SearchFormInput
            onChange={this.handleText}
            type="text"
            autocomplete="off"
            value={name}
            placeholder="Search images and photos"
          />
        </SearchForm>
      </Head>
    );
  }
}

export default Searchbar;

Searchbar.propTypes = {
  onForm: PropTypes.func.isRequired,
};
