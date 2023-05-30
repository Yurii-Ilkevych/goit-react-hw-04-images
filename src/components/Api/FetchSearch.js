
function fetchSearch (searchName, page) {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '35606750-af8374c970d110a408f6cc0ed';
    return fetch(
        `${BASE_URL}?key=${API_KEY}&q=${searchName}&image_type=photo&per_page=12&page=${page}`
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(new Error());
        })
}

export default fetchSearch