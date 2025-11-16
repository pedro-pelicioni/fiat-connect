import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Download,
  Wallet,
  TrendingUp,
  LogOut,
  Settings,
  PieChart as PieChartIcon,
  Plus,
  Trash2,
  QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import LoadingDots from "@/components/LoadingDots";
import merchantQR from "@/assets/merchant-qr.png";

interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  amount: number;
  currency: string;
  network: string;
  status: "confirmed" | "pending" | "processing";
  date: string;
  hash: string;
}

interface SplitRecipient {
  id: string;
  name: string;
  percentage: number;
  address: string;
}

interface WithdrawalTransaction {
  id: string;
  amount: number;
  currency: string;
  network: string;
  date: string;
  hash: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "incoming",
    amount: 150.00,
    currency: "USDC",
    network: "BSC",
    status: "confirmed",
    date: "2025-01-15 14:32",
    hash: "0x742d...3a1f"
  },
  {
    id: "2",
    type: "incoming",
    amount: 75.50,
    currency: "USDT",
    network: "Polygon",
    status: "pending",
    date: "2025-01-15 12:18",
    hash: "0x8b3c...7d2e"
  },
  {
    id: "3",
    type: "outgoing",
    amount: 500.00,
    currency: "BRL",
    network: "Off-ramp",
    status: "processing",
    date: "2025-01-14 16:45",
    hash: "0x9f1a...4c8b"
  },
  {
    id: "4",
    type: "incoming",
    amount: 220.00,
    currency: "USDC",
    network: "Ethereum",
    status: "confirmed",
    date: "2025-01-14 10:23",
    hash: "0x5e7d...9b4f"
  },
  {
    id: "5",
    type: "incoming",
    amount: 89.99,
    currency: "USDT",
    network: "BSC",
    status: "confirmed",
    date: "2025-01-13 18:56",
    hash: "0x3c2b...6a5d"
  }
];

const mockSplitRecipients: SplitRecipient[] = [
  {
    id: "1",
    name: "Platform Fee",
    percentage: 15,
    address: "0x1a2b...3c4d"
  },
  {
    id: "2",
    name: "Partner Commission",
    percentage: 25,
    address: "0x5e6f...7g8h"
  },
  {
    id: "3",
    name: "Merchant Revenue",
    percentage: 60,
    address: "0x9i0j...1k2l"
  }
];

const mockWithdrawals: WithdrawalTransaction[] = [
  {
    id: "w1",
    amount: 150.00,
    currency: "USDC",
    network: "BSC",
    date: "2025-01-15 14:32",
    hash: "0x742d...3a1f"
  },
  {
    id: "w2",
    amount: 220.00,
    currency: "USDC",
    network: "Ethereum",
    date: "2025-01-14 10:23",
    hash: "0x5e7d...9b4f"
  },
  {
    id: "w3",
    amount: 89.99,
    currency: "USDT",
    network: "BSC",
    date: "2025-01-13 18:56",
    hash: "0x3c2b...6a5d"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSplitConfig, setShowSplitConfig] = useState(false);
  const [splitRecipients, setSplitRecipients] = useState<SplitRecipient[]>(mockSplitRecipients);
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<SplitRecipient | null>(null);
  const [newRecipient, setNewRecipient] = useState({ name: "", percentage: 0, address: "" });

  const totalBalance = 1245.50;
  const totalToday = 225.50;

  const handleLogout = () => {
    navigate("/");
  };

  const handleAddRecipient = () => {
    if (!newRecipient.name || !newRecipient.address || newRecipient.percentage <= 0) return;
    
    const recipient: SplitRecipient = {
      id: Date.now().toString(),
      ...newRecipient
    };
    
    setSplitRecipients([...splitRecipients, recipient]);
    setNewRecipient({ name: "", percentage: 0, address: "" });
    setIsEditingRecipient(false);
  };

  const handleRemoveRecipient = (id: string) => {
    setSplitRecipients(splitRecipients.filter(r => r.id !== id));
  };

  const handleUpdateRecipient = () => {
    if (!editingRecipient) return;
    
    setSplitRecipients(splitRecipients.map(r => 
      r.id === editingRecipient.id ? editingRecipient : r
    ));
    setEditingRecipient(null);
  };

  const totalPercentage = splitRecipients.reduce((sum, r) => sum + r.percentage, 0);

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-success text-success-foreground">Confirmed</Badge>;
      case "pending":
        return (
          <Badge variant="outline" className="border-warning text-warning flex items-center gap-2">
            <LoadingDots />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="border-primary text-primary flex items-center gap-2">
            <LoadingDots />
            Processing
          </Badge>
        );
    }
  };

  const pieData = splitRecipients.map((recipient) => ({
    name: recipient.name,
    value: recipient.percentage,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--accent))'];

  const filteredTransactions = mockTransactions.filter(tx =>
    tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.network.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">NativeFi</h1>
                <p className="text-xs text-muted-foreground">Payment Gateway</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardDescription>Total Balance</CardDescription>
              <CardTitle className="text-3xl font-bold">
                ${totalBalance.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-success">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardDescription>Received Today</CardDescription>
              <CardTitle className="text-3xl font-bold">
                ${totalToday.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                3 transactions
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardDescription>Merchant QR Code</CardDescription>
              <CardTitle className="text-lg">Payment Address</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <div className="bg-white p-4 rounded-lg">
                <img src={merchantQR} alt="Merchant Payment QR Code" className="w-40 h-40" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Customers scan to pay with crypto
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border bg-gradient-primary text-primary-foreground">
            <CardHeader className="pb-3">
              <CardDescription className="text-primary-foreground/80">Payment Split</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Split
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Configure Payment Split</DialogTitle>
                    <DialogDescription>
                      Set up how incoming payments should be split across different investments
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* Current Recipients */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Current Split Configuration</h3>
                        <Badge variant={totalPercentage === 100 ? "default" : "destructive"}>
                          Total: {totalPercentage}%
                        </Badge>
                      </div>
                      
                      {splitRecipients.map((recipient) => (
                        <div key={recipient.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                          {editingRecipient?.id === recipient.id ? (
                            <div className="space-y-3">
                              <div className="grid gap-3">
                                <div>
                                  <Label>Investment Name</Label>
                                  <Input
                                    value={editingRecipient.name}
                                    onChange={(e) => setEditingRecipient({...editingRecipient, name: e.target.value})}
                                    placeholder="e.g., Platform Fee, Partner Commission"
                                  />
                                </div>
                                <div>
                                  <Label>Percentage</Label>
                                  <Input
                                    type="number"
                                    value={editingRecipient.percentage}
                                    onChange={(e) => setEditingRecipient({...editingRecipient, percentage: Number(e.target.value)})}
                                    placeholder="25"
                                  />
                                </div>
                                <div>
                                  <Label>Wallet Address</Label>
                                  <Input
                                    value={editingRecipient.address}
                                    onChange={(e) => setEditingRecipient({...editingRecipient, address: e.target.value})}
                                    placeholder="0x..."
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleUpdateRecipient}>Save</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingRecipient(null)}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-foreground">{recipient.name}</p>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-primary text-primary-foreground">
                                    {recipient.percentage}%
                                  </Badge>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => setEditingRecipient(recipient)}
                                  >
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleRemoveRecipient(recipient.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <code className="text-xs text-muted-foreground">{recipient.address}</code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add New Recipient */}
                    <div className="border-t pt-4">
                      {isEditingRecipient ? (
                        <div className="space-y-3">
                          <h3 className="font-semibold">Add New Investment</h3>
                          <div className="grid gap-3">
                            <div>
                              <Label>Investment Name</Label>
                              <Input
                                value={newRecipient.name}
                                onChange={(e) => setNewRecipient({...newRecipient, name: e.target.value})}
                                placeholder="e.g., Savings, Trading"
                              />
                            </div>
                            <div>
                              <Label>Percentage</Label>
                              <Input
                                type="number"
                                value={newRecipient.percentage || ""}
                                onChange={(e) => setNewRecipient({...newRecipient, percentage: Number(e.target.value)})}
                                placeholder="25"
                              />
                            </div>
                            <div>
                              <Label>Wallet Address</Label>
                              <Input
                                value={newRecipient.address}
                                onChange={(e) => setNewRecipient({...newRecipient, address: e.target.value})}
                                placeholder="0x..."
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleAddRecipient}>Add Investment</Button>
                            <Button variant="outline" onClick={() => {
                              setIsEditingRecipient(false);
                              setNewRecipient({ name: "", percentage: 0, address: "" });
                            }}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <Button onClick={() => setIsEditingRecipient(true)} variant="outline" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add New Investment
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Split Visualization */}
        {splitRecipients.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-elevated border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Split Configuration
                </CardTitle>
                <CardDescription>Configure payment split recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {splitRecipients.map((recipient) => (
                    <div key={recipient.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-foreground">{recipient.name}</p>
                        <Badge className="bg-primary text-primary-foreground">
                          {recipient.percentage}%
                        </Badge>
                      </div>
                      <code className="text-xs text-muted-foreground">{recipient.address}</code>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-foreground">Total</p>
                      <Badge className="bg-success text-success-foreground">
                        {splitRecipients.reduce((sum, r) => sum + r.percentage, 0)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elevated border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Split Distribution
                </CardTitle>
                <CardDescription>Visual breakdown of payment splits</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Withdrawals */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle>Available for Withdrawal</CardTitle>
            <CardDescription>Validated transactions ready to withdraw</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWithdrawals.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-success/10 text-success">
                      <ArrowDownLeft className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">Validated Payment</p>
                        <Badge className="bg-success text-success-foreground">Ready</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tx.network} • {tx.date}
                      </p>
                      <code className="text-xs text-muted-foreground">{tx.hash}</code>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-lg font-bold text-success">
                        ${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">{tx.currency}</p>
                    </div>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Withdraw
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction Statement</CardTitle>
                <CardDescription>Complete transaction history</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by hash, currency or network..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "incoming" 
                        ? "bg-success/10 text-success" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {tx.type === "incoming" ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">
                          {tx.type === "incoming" ? "Incoming" : "Withdrawal"}
                        </p>
                        {getStatusBadge(tx.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tx.network} • {tx.date}
                      </p>
                      <code className="text-xs text-muted-foreground">{tx.hash}</code>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      tx.type === "incoming" ? "text-success" : "text-foreground"
                    }`}>
                      {tx.type === "incoming" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">{tx.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
