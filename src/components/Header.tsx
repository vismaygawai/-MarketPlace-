import { Wallet, ShoppingBag } from "lucide-react";

interface HeaderProps {
  account: string;
}

const Header = ({ account }: HeaderProps) => {
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-card shadow-[var(--shadow-card)] rounded-2xl p-6 mb-8 transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <ShoppingBag className="text-primary-foreground" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NFT Marketplace
            </h1>
            <p className="text-muted-foreground text-sm">Trade digital assets seamlessly</p>
          </div>
        </div>
        {account && (
          <div className="bg-secondary/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <Wallet className="text-primary" size={18} />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Connected</p>
                <p className="font-mono text-sm font-bold text-foreground">{shortenAddress(account)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
