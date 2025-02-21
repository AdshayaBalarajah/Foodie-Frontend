import React, { useEffect } from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { green } from "@mui/material/colors";
import { Button, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCartAction } from "../../../State/Customers/Cart/cart.action";

const PaymentSuccess = () => {
  const navigate = useNavigate();
 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCartAction())
  }, []);

  return (
    <div className="min-h-screen  px-5">
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <Card className="box w-full lg:w-1/4 flex flex-col items-center rounded-md p-5 rounded-md">
          <TaskAltIcon sx={{ fontSize: "5rem", color: green[600] }} />
          <h1 className="py-5 text-2xl font-semibold">Order Success !</h1>
          <p className="py-3 text-center text-gray-400">
            Thank you for your order! We’re delighted to serve you.
          </p>
          <p className="py-2 text-center text-gray-200 text-lg">
            Have A Great Day !
          </p>
          <Button
            variant="contained"
            className="my-5"
            sx={{ margin: "1rem 0rem" }}
            onClick={()=>navigate("/")}
          >
            Go To Home
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
