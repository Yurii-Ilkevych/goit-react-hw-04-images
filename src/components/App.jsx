import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import { ToastContainer } from 'react-toastify';
import { AppWrapper } from './App.styled';
export class App extends Component {
  state = {
    name: '',
  };

  hundleForm = name => {
    this.setState({ name });
  };

  render() {
    return (
      <AppWrapper>
        <Searchbar onForm={this.hundleForm} />
        <ImageGallery searchName={this.state.name} />
        <ToastContainer position={'top-left'} autoClose={3000} />
      </AppWrapper>
    );
  }
}


App.propTypes = {
name: PropTypes.string,
}