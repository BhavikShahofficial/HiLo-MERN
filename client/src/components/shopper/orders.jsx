import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShopperOrderDetails from "./order-details";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUser,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/orderSlice";
import { Badge } from "../ui/badge";

function ShopperOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    if (user?.id) {
      const statusQuery = statusFilter !== "All" ? statusFilter : undefined;
      dispatch(getAllOrdersByUser({ userId: user.id, status: statusQuery }));
    }
  }, [dispatch, user?.id, statusFilter]);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <CardTitle>Your Order History</CardTitle>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="All">All</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="rejected">Rejected</option>
        </select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`px-3 py-1 ${
                        orderItem?.orderStatus === "Confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-600"
                          : "bg-black"
                      }`}
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${orderItem.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={(isOpen) => {
                        setOpenDetailsDialog(isOpen);
                        if (!isOpen) dispatch(resetOrderDetails());
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {orderDetails ? (
                          <ShopperOrderDetails orderDetails={orderDetails} />
                        ) : (
                          <p>Loading order details...</p>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShopperOrders;
