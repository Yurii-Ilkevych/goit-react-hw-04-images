import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import ImageGalleryItem from 'components/ImageGalleryItem';
import Loader from 'components/Loader';
import ImageGalleryUl from './ImageGallery.styled';
import Button from 'components/Button';
import fetchPhoto from 'components/Api/FetchSearch';
import Modal from 'components/Modal';

function ImageGallery({ searchValueProp }) {
  const [searchValue, setSearchValue] = useState(null);
  const [arrayPhoto, setArrayPhoto] = useState(null);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [photoForModal, setPhotoForModal] = useState(null);
  const [btnToggle, setBtnToggle] = useState(false);
  const [totalHits, setTotalHits] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (searchValueProp === '') {
      return;
    }
    reset();
    setSearchValue(searchValueProp);
  }, [searchValueProp]);

  useEffect(() => {
    if (searchValue === null) {
      return;
    }
    if (searchValue !== null) {
      setPending(true);
    }

    fetchPhoto(searchValue, page)
      .then(FoundArrayOfPhotos => {
        if (FoundArrayOfPhotos.hits.length === 0) {
          setStatus('rejected');
          toast.error(`Not found ${searchValue}`);
          reset();
          return;
        }
        setStatus('resolved');
        setPending(false);
        if (page === 1) {
          setArrayPhoto(FoundArrayOfPhotos.hits);
          setTotalHits(FoundArrayOfPhotos.totalHits);
        } else if (page > 1) {
          setArrayPhoto(prev => [...prev, ...FoundArrayOfPhotos.hits]);
        }
        if (FoundArrayOfPhotos.totalHits <= 12) {
          setBtnToggle(false);
        } else if (FoundArrayOfPhotos.totalHits > 12) {
          setBtnToggle(true);
        }
      })
      .catch(() => {
        setStatus('rejected');
        toast.error(`Not found ${searchValue}`);
        reset();
        return;
      });
  }, [searchValue, page]);

  useEffect(() => {
    if (arrayPhoto !== null && arrayPhoto.length + 12 >= totalHits) {
      setBtnToggle(false);
    }
  }, [arrayPhoto, totalHits]);

  const reset = () => {
    setArrayPhoto(null);
    setStatus('idle');
    setPage(1);
    setBtnToggle(false);
    setTotalHits(0);
    setSearchValue(null);
    setPending(false);
  };

  const hundleLoadMore = () => {
    setPending(true);
    setPage(prev => (prev += 1));
  };

  const getPhoto = currentPhoto => {
    setPhotoForModal(currentPhoto);
  };

  const toggle = () => {
    setShow(!show);
  };

  return (
    <>
      <ImageGalleryUl>
        {status === 'resolved' && (
          <ImageGalleryItem
            hits={arrayPhoto}
            onToggle={toggle}
            onGetId={getPhoto}
          />
        )}
      </ImageGalleryUl>
      {pending && <Loader />}
      {btnToggle && <Button loadMore={hundleLoadMore} />}
      {show && (
        <Modal
          onClose={toggle}
          src={photoForModal.largeImageURL}
          alt={photoForModal.tags}
        ></Modal>
      )}
    </>
  );
}

export default ImageGallery;

ImageGallery.propTypes = {
  searchValueProp: PropTypes.string.isRequired,
  FoundArrayOfPhotos: PropTypes.arrayOf(
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
