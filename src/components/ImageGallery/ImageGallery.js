import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import ImageGalleryItem from 'components/ImageGalleryItem';
import Loader from 'components/Loader';
import ImageGalleryUl from './ImageGallery.styled';
import Button from 'components/Button';
import fetchSearch from 'components/Api/FetchSearch';
import Modal from 'components/Modal';

function ImageGallery({ searchName }) {
  const [arrayPhoto, setArrayPhoto] = useState(null);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const [photoForModal, setPhotoForModal] = useState(null);
  const [btnToggle, setBtnToggle] = useState(false);
  const [totalHits, setTotalHits] = useState(0);


  useEffect(() => {
    if (searchName === '') {
      return;
    }
setStatus("pending")

    fetchSearch(searchName, page)
      .then(searchArrayPhoto => {
        
        if (searchArrayPhoto.hits.length === 0) {
          setStatus('rejected');
          toast.error(`Not found ${searchName}`);
          reset();
          return;
        }

        toDoThen(searchArrayPhoto);
      })
      .catch(() => {
        setStatus('rejected');
        toast.error(`Not found ${searchName}`);
        reset();
        return;
      });


    const toDoThen = searchArrayPhoto => {

      if (arrayPhoto === null) {
        setStatus('resolved');
        setArrayPhoto(searchArrayPhoto.hits);
        setTotalHits(searchArrayPhoto.totalHits);
      } else if (arrayPhoto !== null) {
        setArrayPhoto(prev => [...prev, ...searchArrayPhoto.hits]);
        setStatus('resolved');
      }

      if (searchArrayPhoto.totalHits <= 12) {
        setBtnToggle(false);
      } else if (searchArrayPhoto.totalHits > 12) {
        setBtnToggle(true);
      }

      if (arrayPhoto !== null && arrayPhoto.length + 12 === totalHits) {
        setBtnToggle(false);
      }
    };
  }, [searchName, page, arrayPhoto, totalHits]);

  // const hundleFetch = () => {
  //   fetchSearch(searchName, page)
  //     .then(searchArrayPhoto => {
  //       toDoThen(searchArrayPhoto);
  //     })
  //     .catch(() => {
  //       setStatus('rejected');
  //       toast.error(`Not found ${searchName}`);
  //       reset();
  //       return;
  //     });
  // };

  // const toDoThen = searchArrayPhoto => {
  //   if (searchArrayPhoto.hits.length === 0) {
  //     setStatus('rejected');
  //     toast.error(`Not found ${searchName}`);
  //     reset();
  //     return;
  //   }
  //   if (arrayPhoto === null) {
  //     setStatus('resolved');
  //     setArrayPhoto(searchArrayPhoto.hits);
  //     setTotalHits(searchArrayPhoto.totalHits);
  //   } else if (arrayPhoto !== null) {
  //     setArrayPhoto(prev => [...prev, ...searchArrayPhoto.hits]);
  //     setStatus('resolved');
  //   }

  //   if (searchArrayPhoto.totalHits <= 12) {
  //     setBtnToggle(false);
  //   } else if (searchArrayPhoto.totalHits > 12) {
  //     setBtnToggle(true);
  //   }

  //   if (arrayPhoto !== null && arrayPhoto.length + 12 === totalHits) {
  //     setBtnToggle(false);
  //   }
  // };

  const reset = () => {
    setArrayPhoto(null);
    setStatus('idle');
    setPage(1);
    setBtnToggle();
    setTotalHits(0);
  };

  const hundleLoadMore = () => {
    setPage(prev => (prev += 1));
  };

  const getPhoto = hit => {
    setPhotoForModal(hit);
  };

  const toggle = () => {
    setShow(!show);
  };
  return (
    <>
      {status === 'pending' && <Loader />}
      <ImageGalleryUl>
        {status === 'resolved' && (
          <ImageGalleryItem
            hits={arrayPhoto}
            onToggle={toggle}
            onGetId={getPhoto}
          />
        )}
      </ImageGalleryUl>
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
