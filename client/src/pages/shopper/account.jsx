import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accountImg from "../../assets/account/account.jpg";
import Address from "@/components/shopper/address";
import ShopperOrders from "@/components/shopper/orders";

function ShopperAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-auto w-full overflow-hidden">
        <img src={accountImg} />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="Orders">
            <TabsList>
              <TabsTrigger value="Orders">Orders</TabsTrigger>
              <TabsTrigger value="Address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="Orders">
              <ShopperOrders />
            </TabsContent>
            <TabsContent value="Address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShopperAccount;
