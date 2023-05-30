import { ButtonLoadMore } from './Button.styled';
import PropTypes from 'prop-types';
const Button = ({ loadMore }) => {
  return (
    <ButtonLoadMore
      type="button"
      onClick={() => {
        loadMore();
      }}
    >
      Load more
    </ButtonLoadMore>
  );
};
export default Button;


ButtonLoadMore.propTypes = {
    loadMore: PropTypes.func,
}