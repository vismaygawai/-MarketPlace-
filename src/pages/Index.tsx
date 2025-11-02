import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import Header from "@/components/Header";
import ListItemForm from "@/components/ListItemForm";
import MarketplaceItem from "@/components/MarketplaceItem";
import OwnedItem from "@/components/OwnedItem";
import EmptyState from "@/components/EmptyState";
import { Store, Package, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CONTRACT_ADDRESS = "0x788ff72228dafb0eca5c8c6d8e2d3de1d7324c43";
const ABI = [
  {
    inputs: [{ internalType: "address", name: "_owner", type: "address" }],
    name: "getItemsByOwner",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "itemCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "items",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "address payable", name: "seller", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "bool", name: "isSold", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint256", name: "_price", type: "uint256" },
    ],
    name: "listItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "purchaseItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "address", name: "_to", type: "address" },
    ],
    name: "transferItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Index = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [ownedItems, setOwnedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    if (typeof (window as any).ethereum === "undefined") {
      toast.error("Please install MetaMask to use this application");
      setInitializing(false);
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);

      (window as any).ethereum.on("accountsChanged", async (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount("");
          setItems([]);
          setOwnedItems([]);
          return;
        }
        setAccount(accounts[0]);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        setContract(contract);
        await loadItems(contract);
        await loadOwnedItems(contract, accounts[0]);
      });

      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setContract(contract);

      await loadItems(contract);
      await loadOwnedItems(contract, accounts[0]);
      toast.success("Connected to wallet successfully");
    } catch (err: any) {
      toast.error("Failed to connect: " + err.message);
    } finally {
      setInitializing(false);
    }
  };

  const loadItems = async (contract: ethers.Contract) => {
    try {
      const itemCount = await contract.itemCount();
      const itemsArray = [];
      for (let i = 1; i <= itemCount.toNumber(); i++) {
        const item = await contract.items(i);
        itemsArray.push(item);
      }
      setItems(itemsArray);
    } catch (err) {
      console.error("Error loading items:", err);
    }
  };

  const loadOwnedItems = async (contract: ethers.Contract, owner: string) => {
    try {
      const ownedItemIds = await contract.getItemsByOwner(owner);
      const ownedItemsArray = [];
      for (let i = 0; i < ownedItemIds.length; i++) {
        const item = await contract.items(ownedItemIds[i]);
        ownedItemsArray.push(item);
      }
      setOwnedItems(ownedItemsArray);
    } catch (err) {
      console.error("Error loading owned items:", err);
    }
  };

  const handleListItem = async (name: string, price: string) => {
    if (!contract) return;

    if (!name || !price) {
      toast.error("Please enter both item name and price");
      return;
    }

    if (parseFloat(price) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.listItem(name, ethers.utils.parseEther(price));
      toast.loading("Transaction pending...");
      await tx.wait();
      toast.success("Item listed successfully!");
      await loadItems(contract);
    } catch (err: any) {
      toast.error("Failed to list item: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseItem = async (id: ethers.BigNumber, price: string) => {
    if (!contract) return;

    setLoading(true);
    try {
      const tx = await contract.purchaseItem(id, { value: ethers.utils.parseEther(price) });
      toast.loading("Transaction pending...");
      await tx.wait();
      toast.success("Item purchased successfully!");
      await loadItems(contract);
      await loadOwnedItems(contract, account);
    } catch (err: any) {
      toast.error("Failed to purchase: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferItem = async (id: ethers.BigNumber, toAddress: string) => {
    if (!contract) return;

    if (!toAddress) {
      toast.error("Please enter a transfer address");
      return;
    }

    if (!ethers.utils.isAddress(toAddress)) {
      toast.error("Invalid address format");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.transferItem(id, toAddress);
      toast.loading("Transaction pending...");
      await tx.wait();
      toast.success("Item transferred successfully!");
      await loadItems(contract);
      await loadOwnedItems(contract, account);
    } catch (err: any) {
      toast.error("Failed to transfer: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header account={account} />

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <ListItemForm onListItem={handleListItem} loading={loading} />
          </div>
          <div className="lg:col-span-2">
            <Tabs defaultValue="marketplace" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="marketplace" className="flex items-center gap-2">
                  <Store size={18} />
                  Marketplace
                </TabsTrigger>
                <TabsTrigger value="owned" className="flex items-center gap-2">
                  <Package size={18} />
                  Your Items ({ownedItems.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="marketplace" className="space-y-4">
                {items.length === 0 ? (
                  <EmptyState
                    icon={Store}
                    title="No items listed yet"
                    description="Be the first to list an item on the marketplace!"
                  />
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {items.map((item) => (
                      <MarketplaceItem
                        key={item.id.toString()}
                        item={item}
                        currentAccount={account}
                        onPurchase={handlePurchaseItem}
                        loading={loading}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="owned" className="space-y-4">
                {ownedItems.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No items owned"
                    description="Purchase items from the marketplace to see them here."
                  />
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {ownedItems.map((item) => (
                      <OwnedItem
                        key={item.id.toString()}
                        item={item}
                        onTransfer={handleTransferItem}
                        loading={loading}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
