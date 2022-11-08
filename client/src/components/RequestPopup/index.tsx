/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FC, useState, useContext, useEffect,
} from 'react';
import {
  Button, Modal, ImageList, ListSubheader, ImageListItem, Typography,
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import PopupCard from './PopupCard';
import { IProductPopup, UserProduct } from '../../interfaces';
import { AuthContext } from '../Context/AuthContext';
import { ImageContext } from '../Context/ImageContext';
import './Popup.css';

const RequestPopup:FC<IProductPopup> = ({ open, handleClose, receiverId }) => {
  const [products, setProducts] = useState< UserProduct[]>([]);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const { userId, fullName: senderName } = useContext(AuthContext);
  const { handleRequest, productArray } = useContext(ImageContext);

  const fetchData = async () => {
    try {
      const userProducts = await axios
        .get(`/api/v1/user/${userId}/products`);

      setProducts(userProducts.data.rows);
    } catch (error) {
      Swal.fire(error.response.data.message);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const checkArrayOfIds = () => {
    if (productArray.length) {
      setShowMessage(false);
      handleRequest(receiverId, senderName);
    } else {
      setShowMessage(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="popupModal"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {products.length ? (
        <ImageList
          sx={{
            width: 700, height: 550, backgroundColor: '#fff', padding: '1rem',
          }}
          cols={3}
          gap={13}
        >
          <ImageListItem key="Subheader" cols={3}>
            <ListSubheader component="div">
              Choose products for exchange
            </ListSubheader>
          </ImageListItem>
          {products.map((item) => (
            <PopupCard item={item} key={item.id} />
          ))}
          <ImageListItem cols={3}>
            {showMessage
            && <Typography variant="h5">Choose at least one item</Typography>}
            <Button
              variant="contained"
              onClick={checkArrayOfIds}
            >
              confirm

            </Button>
          </ImageListItem>

        </ImageList>

      ) : (<h1>Loading ...</h1>)}
    </Modal>
  );
};

export default RequestPopup;