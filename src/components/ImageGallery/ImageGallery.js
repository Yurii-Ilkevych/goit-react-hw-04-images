import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import ImageGalleryItem from 'components/ImageGalleryItem';
import Loader from 'components/Loader';
import ImageGalleryUl from './ImageGallery.styled';
import Button from 'components/Button';
import fetchSearch from 'components/Api/FetchSearch';
import Modal from 'components/Modal';

let btnToggle = false;
let totalHits = 0;
class ImageGallery extends Component {
  state = {
    searchArrayPhoto: null,
    status: 'idle',
    page: 1,
    show: false,
    photoForModal: null,
  };

 async componentDidUpdate(prevProps ) {
    const { toggleButton, reset, hundleFetch } = this;

    if (prevProps.searchName !== this.props.searchName) {
     toggleButton(false);
     await reset();
     this.setState({ status: 'pending' });
      hundleFetch();
     }
  }

  hundleFetch = () => {
    const { searchName } = this.props;
    const { page } = this.state;
    const { toDoThen, reset } = this;
    fetchSearch(searchName, page)
      .then(searchArrayPhoto => {
        toDoThen(searchArrayPhoto);
      })
      .catch(() => {
        this.setState({ status: 'rejected' });
        toast.error(`Not found ${searchName}`);
        reset();
        return;
      });
  };

  toDoThen = searchArrayPhoto => {
    if (searchArrayPhoto.hits.length === 0) {
      this.setState({ status: 'rejected' });
      toast.error(`Not found ${this.props.searchName}`);
      this.reset();
      return;
    }
    if (this.state.searchArrayPhoto === null) {
      this.setState({
        status: 'resolved',
        searchArrayPhoto: searchArrayPhoto.hits,
      });
      totalHits = searchArrayPhoto.totalHits;
    } else if (this.state.searchArrayPhoto !== null) {
      this.setState(prevState => ({
        searchArrayPhoto: [
          ...prevState.searchArrayPhoto,
          ...searchArrayPhoto.hits,
        ],
        status: 'resolved',
      }));
    }

    if (searchArrayPhoto.totalHits <= 12) {
      this.toggleButton(false);
    } else if (searchArrayPhoto.totalHits > 12) {
      this.toggleButton(true);
    }

    if (
      this.state.searchArrayPhoto !== null &&
      this.state.searchArrayPhoto.length + 12 === totalHits
    ) {
      this.toggleButton(false);
    }
  };

  toggleButton = bool => {
    return (btnToggle = bool);
  };

  reset = () => {
    this.setState({ searchArrayPhoto: null, status: 'idle', page: 1 });
    this.toggleButton(false);
    btnToggle = false;
    totalHits = 0;
  };

  hundleLoadMore = async () => {
    await this.setState(({ page }) => ({
      page: (page += 1),
    }));

    this.hundleFetch();
  };

  getPhoto = id => {
    this.setState({
      photoForModal: this.state.searchArrayPhoto.filter(
        photo => photo.id === id
      ),
    });
  };

  toggle = () => {
    this.setState(({ show }) => ({
      show: !show,
    }));
  };

  render() {
    const { searchArrayPhoto, status, photoForModal, show } = this.state;
    const { toggle, getPhoto, hundleLoadMore } = this;
    return (
      <>
        {status === 'pending' && <Loader />}
        <ImageGalleryUl>
          {status === 'resolved' && (
            <ImageGalleryItem
              hits={searchArrayPhoto}
              onToggle={toggle}
              onGetId={getPhoto}
            />
          )}
        </ImageGalleryUl>
        {btnToggle && <Button loadMore={hundleLoadMore} />}
        {show && (
          <Modal
            onClose={toggle}
            src={photoForModal[0].largeImageURL}
            alt={photoForModal[0].tags}
          ></Modal>
        )}
      </>
    );
  }
}

export default ImageGallery;

ImageGallery.propTypes = {
  searchName: PropTypes.string.isRequired,
  searchArrayPhoto: PropTypes.arrayOf(
    PropTypes.shape({
      hits: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          tags: PropTypes.string,
          webformatURL: PropTypes.string,
        })
      ),
    })
  ),
};
