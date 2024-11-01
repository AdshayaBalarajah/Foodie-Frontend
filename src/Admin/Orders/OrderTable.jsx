import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRestaurantsOrder,
  updateOrderStatus,
} from "../../State/Admin/Order/restaurants.order.action";

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
];

const OrdersTable = ({ isDashboard, name, restaurantId }) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurantsOrder } = useSelector((store) => store);
  const [anchorElArray, setAnchorElArray] = React.useState([]);

  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateOrder = (orderId, orderStatus, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(updateOrderStatus({ orderId, orderStatus, jwt }));
  };

  useEffect(() => {
    if (restaurantId) {
      dispatch(
        fetchRestaurantsOrder({
          jwt,
          restaurantId,
        })
      );
    }
  }, [dispatch, jwt, restaurantId]);

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader title={name} />
        <TableContainer>
          <Table aria-label="Orders Table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Name</TableCell>
                {!isDashboard && <TableCell>Status</TableCell>}
                {!isDashboard && <TableCell>Update</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurantsOrder.orders?.map((item) => (
                <TableRow
                  className="cursor-pointer"
                  hover
                  key={item.id}
                  sx={{
                    "&:last-of-type td, &:last-of-type th": { border: 0 },
                  }}
                >
                  <TableCell>{item.id}</TableCell>
                  <TableCell align="right">
                    <AvatarGroup>
                      {item.items.map((orderItem) => {
                        const foodImage =
                          orderItem.food?.images?.[0] ||
                          "/path/to/placeholder.jpg";
                        return <Avatar key={orderItem.id} src={foodImage} />;
                      })}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell>{item?.customer?.fullName}</TableCell>
                  <TableCell>₹{item?.totalAmount}</TableCell>
                  <TableCell>
                    {item.items.map((orderItem) => (
                      <p key={orderItem.id}>
                        {orderItem.food?.name || "Unknown Food"}
                      </p>
                    ))}
                  </TableCell>
                  {!isDashboard && (
                    <TableCell sx={{ textAlign: "center" }}>
                      <Chip
                        label={item?.orderStatus}
                        size="small"
                        color={
                          item.orderStatus === "PENDING"
                            ? "info"
                            : item.orderStatus === "DELIVERED"
                            ? "success"
                            : "secondary"
                        }
                      />
                    </TableCell>
                  )}
                  {!isDashboard && (
                    <TableCell>
                      <Button
                        id={`basic-button-${item?.id}`}
                        aria-controls={`basic-menu-${item.id}`}
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorElArray[item.id])}
                        onClick={(event) =>
                          handleUpdateStatusMenuClick(event, item.id)
                        }
                      >
                        Status
                      </Button>
                      <Menu
                        id={`basic-menu-${item?.id}`}
                        anchorEl={anchorElArray[item.id]}
                        open={Boolean(anchorElArray[item.id])}
                        onClose={() => handleUpdateStatusMenuClose(item.id)}
                      >
                        {orderStatus.map((s) => (
                          <MenuItem
                            key={s.value}
                            onClick={() =>
                              handleUpdateOrder(item.id, s.value, item.id)
                            }
                          >
                            {s.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {restaurantsOrder.loading && (
        <CircularProgress
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      )}
    </Box>
  );
};

export default OrdersTable;
