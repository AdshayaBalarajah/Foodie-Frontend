import { Button, Card, Divider, IconButton, Snackbar } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import AddressCard from "../../components/Address/AddressCard";
import CartItemCard from "../../components/CartItem/CartItemCard";
import { useDispatch, useSelector } from "react-redux";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { Box, Modal, Grid, TextField } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createOrder } from "../../../State/Customers/Orders/Action";
import { findCart } from "../../../State/Customers/Cart/cart.action";
import { isValid } from "../../util/ValidToOrder";
import { cartTotal } from "./totalPay";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

const initialValues = {
  streetAddress: "",
  state: "",
  pincode: "",
  city: "",
};

const validationSchema = Yup.object().shape({
  streetAddress: Yup.string().required("Street Address is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be 6 digits"),
  city: Yup.string().required("City is required"),
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  p: 4,
};

const Cart = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const { cart, auth } = useSelector((store) => store);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); // Track selected address

  const handleCloseAddressModal = () => {
    setOpenAddressModal(false);
  };

  const handleOpenAddressModal = () => setOpenAddressModal(true);

  useEffect(() => {
    dispatch(findCart(localStorage.getItem("jwt")));
  }, [dispatch]);

  const handleSubmit = (values, { resetForm }) => {
    const data = {
      jwt: localStorage.getItem("jwt"),
      order: {
        restaurantId: cart.cartItems[0]?.food?.restaurant?.id,
        deliveryAddress: {
          fullName: auth.user?.fullName,
          streetAddress: values.streetAddress,
          city: values.city,
          state: values.state,
          postalCode: values.pincode,
          country: "Sri Lanka",
        },
      },
    };
    if (isValid(cart.cartItems)) {
      dispatch(createOrder(data));
    } else {
      setOpenSnackbar(true);
    }
  };

  const createOrderUsingSelectedAddress = (deliveryAddress) => {
    // Check if the selected address is already set and matches the current selection
    if (
      selectedAddress &&
      selectedAddress.streetAddress === deliveryAddress.streetAddress
    ) {
      // Deselect the address if it's already selected
      setSelectedAddress(null);
    } else {
      // Set the selected address if not already set
      setSelectedAddress(deliveryAddress);

      const data = {
        jwt: localStorage.getItem("jwt"),
        order: {
          restaurantId: cart.cartItems[0]?.food?.restaurant?.id,
          deliveryAddress: {
            fullName: auth.user?.fullName,
            streetAddress: deliveryAddress.streetAddress,
            city: deliveryAddress.city,
            state: deliveryAddress.state,
            postalCode: deliveryAddress.postalCode,
            country: deliveryAddress.country,
          },
        },
      };

      if (isValid(cart.cartItems)) {
        dispatch(createOrder(data));
      } else {
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Fragment>
      {cart.cartItems.length > 0 ? (
        <main className="lg:flex justify-between">
          <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
            {cart.cartItems.map((item, i) => (
              <CartItemCard key={i} item={item} />
            ))}
            <Divider />
            <div className="billDetails px-5 text-sm">
              <p className="font-extralight py-5">Bill Details</p>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <p>Item Total</p>
                  <p>Rs.{cartTotal(cart.cartItems)}</p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>Delivery Fee</p>
                  <p>Rs.59</p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>Platform Fee</p>
                  <p>Rs.30</p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>GST and Restaurant Charges</p>
                  <p>Rs.20</p>
                </div>
                <Divider />
                <div className="flex justify-between text-gray-400">
                  <p>Total Pay</p>
                  <p>Rs.{cartTotal(cart.cartItems) + 109}</p>
                </div>
              </div>
            </div>
          </section>
          <Divider orientation="vertical" flexItem />
          <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
            <div className="">
              <h1 className="text-center font-semibold text-2xl py-10">
                Choose Delivery Address
              </h1>
              <div className="flex gap-5 flex-wrap justify-center">
                {auth.user?.addresses.map((item, index) => (
                  <AddressCard
                    key={index}
                    handleSelectAddress={createOrderUsingSelectedAddress}
                    item={item}
                    showButton={true}
                  />
                ))}
                <Card className="flex flex-col justify-center items-center p-5  w-64 ">
                  <div className="flex space-x-5">
                    <AddLocationAltIcon />
                    <div className="space-y-5">
                      <p>Add New Address</p>
                      <Button
                        onClick={handleOpenAddressModal}
                        sx={{ padding: ".75rem" }}
                        fullWidth
                        variant="contained"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <RemoveShoppingCartIcon sx={{ fontSize: 100 }} />
          <h1 className="text-2xl font-semibold">Cart is Empty</h1>
        </div>
      )}
      <Modal open={openAddressModal} onClose={handleCloseAddressModal}>
        <Box sx={style}>
          <h1 className="text-xl font-semibold mb-5">Add Delivery Address</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange }) => (
              <Form>
                <Field
                  name="streetAddress"
                  as={TextField}
                  label="Street Address"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  error={Boolean(<ErrorMessage name="streetAddress" />)}
                  helperText={<ErrorMessage name="streetAddress" />}
                  className="mb-3"
                />
                <Field
                  name="city"
                  as={TextField}
                  label="City"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  error={Boolean(<ErrorMessage name="city" />)}
                  helperText={<ErrorMessage name="city" />}
                  className="mb-3"
                />
                <Field
                  name="state"
                  as={TextField}
                  label="State"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  error={Boolean(<ErrorMessage name="state" />)}
                  helperText={<ErrorMessage name="state" />}
                  className="mb-3"
                />
                <Field
                  name="pincode"
                  as={TextField}
                  label="Pincode"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  error={Boolean(<ErrorMessage name="pincode" />)}
                  helperText={<ErrorMessage name="pincode" />}
                  className="mb-3"
                />
                <Button type="submit" variant="contained" className="w-full">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Cannot create order, please check the items in the cart."
      />
    </Fragment>
  );
};

export default Cart;
