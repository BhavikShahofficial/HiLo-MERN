import { Tabs, TabsContent } from "@/components/ui/tabs";
import AdminOrdersCard from "@/components/admin/orders";

function ShopperAccount() {
  return (
    <div className="flex flex-col">
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="Orders">
            <TabsContent value="Orders">
              <AdminOrdersCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShopperAccount;
