import React, { useEffect, useRef, useState } from 'react';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { getAPI } from 'pixabay-api';
import styles from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';

function App () {
  const [images, setImages ] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const endOfListRef = useRef();

  useEffect(() => {
    if (searchQuery === '') return;
    const fetchAndScroll = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
          const response = await getAPI(searchQuery, currentPage);
          const { totalHits, hits } = response;

          setImages(prevState => currentPage === 1 ? hits : [...prevState, ...hits]);
          setIsLoading(false);
          setIsEnd(currentPage * 12 >= totalHits);

          if (hits.length === 0) {
            toast('No images found. Try a different search.');
          }
        } catch (error) {
          setIsLoading(false);
          setIsError(true);
          toast.error(`An error occurred while fetching data: ${error}`);
        }
      };
      if (currentPage !== 1) {
        setTimeout(() => {
          endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    void fetchAndScroll();
  }, [searchQuery, currentPage]); // Effect runs when searchQuery or currentPage changes

  const handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCurrentQuery = searchQuery.toLowerCase();

    if (normalizedQuery === '') {
      toast.error(`Empty string is not a valid search query. Please type again.`);
      return;
    }

    if (normalizedQuery === normalizedCurrentQuery) {
      toast.error(
        `Search query is the same as the previous one. Please provide a new search query.`
      );
      return;
    }

    if (normalizedQuery !== normalizedCurrentQuery) {
      setSearchQuery( normalizedQuery);
      setCurrentPage(1);
      setImages([]);
      setIsEnd(false);
    }
  };

  const handleLoadMore = () => {
    if (!isEnd) {
      setCurrentPage(prevValue => prevValue + 1);
    } else {
      toast("You've reached the end of the search results.");
    }
  };

    return (
      <div className={styles.App}>
        <div><Toaster position="top-right" /></div>
        <SearchBar onSubmit={handleSearchSubmit} />
        <ImageGallery images={images} />
        <div ref={endOfListRef}></div>
        {isLoading && <Loader />}
        {!isLoading && !isError && images.length > 0 && !isEnd && (
          <Button onClick={handleLoadMore} />
        )}

        {isError && <p>Something went wrong. Please try again later.</p>}
      </div>
    );
}

export default App;
