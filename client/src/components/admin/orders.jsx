import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { useEffect, useState } from "react";
import AdminOrderDetails from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrderById,
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/orderSlice";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DeleteIcon } from "lucide-react";

function AdminOrdersCard() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  const statuses = ["all", "Pending", "Confirmed", "rejected"];

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin(selectedStatus));
  }, [dispatch, selectedStatus]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  return (
    <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
      <TabsList className="mb-5 flex-wrap w-full text-[10px]">
        {statuses.map((status) => (
          <TabsTrigger
            key={status}
            value={status}
            className="text-[10px] md:text-[1rem]"
          >
            {status === "all" ? "All Orders" : status}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={selectedStatus}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Orders - {selectedStatus}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Order Price</TableHead>
                    <TableHead>
                      <span className="sr-only">Details</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderList?.map((orderItem) => (
                    <TableRow key={orderItem._id}>
                      <TableCell className="break-all max-w-[150px]">
                        {orderItem._id}
                      </TableCell>
                      <TableCell>
                        {orderItem.orderDate?.split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`px-3 py-1 text-white ${
                            orderItem?.orderStatus === "Confirmed"
                              ? "bg-green-500"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-gray-800"
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
                                handleFetchOrderDetails(orderItem._id)
                              }
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {orderDetails ? (
                              <AdminOrderDetails orderDetails={orderDetails} />
                            ) : (
                              <p>Loading order details...</p>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            dispatch(deleteOrderById(orderItem._id))
                          }
                          className="ml-2"
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default AdminOrdersCard;
