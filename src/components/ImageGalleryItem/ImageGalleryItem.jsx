import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import styles from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({image: { webformatURL, largeImageURL, tags}}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = ()=> {
    setShowModal(!showModal);
  };

    return (
      <li className={styles.galleryItem} onClick={toggleModal}>
        <img className={styles.galleryItemImage} src={webformatURL} alt={tags} />
        {showModal && (
          <Modal image={largeImageURL} tags={tags} onClose={toggleModal} />
        )}
      </li>
    );
}

export default ImageGalleryItem;
