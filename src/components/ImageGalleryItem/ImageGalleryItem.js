import PropTypes from 'prop-types';
import {
  ImageGalleryItemLi,
  ImageGalleryItemImage,
} from './ImageGalleryItem.styled';

const ImageGalleryItem = ({ onToggle, onGetId, hits }) => {
  return hits.map((hit) => {
    return ( <a href='##'
        key={hit.id}
        onClick={() => {
          onToggle();
          onGetId(hit);
        }}
      >
        <ImageGalleryItemLi>
          <ImageGalleryItemImage src={hit.webformatURL} alt={hit.tags} />
        </ImageGalleryItemLi>
      </a>
    );
  });
};

export default ImageGalleryItem;

ImageGalleryItem.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onGetId: PropTypes.func.isRequired,
  hits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      tags: PropTypes.string.isRequired,
      webformatURL: PropTypes.string.isRequired,
    })
  ),
};
