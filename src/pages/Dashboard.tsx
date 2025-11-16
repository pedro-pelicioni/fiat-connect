import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode, 
  Search, 
  Download,
  Wallet,
  TrendingUp,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  type: "entrada" | "saida";
  amount: number;
  currency: string;
  network: string;
  status: "confirmado" | "pendente" | "processando";
  date: string;
  hash: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "entrada",
    amount: 150.00,
    currency: "USDC",
    network: "BSC",
    status: "confirmado",
    date: "2025-01-15 14:32",
    hash: "0x742d...3a1f"
  },
  {
    id: "2",
    type: "entrada",
    amount: 75.50,
    currency: "USDT",
    network: "Polygon",
    status: "confirmado",
    date: "2025-01-15 12:18",
    hash: "0x8b3c...7d2e"
  },
  {
    id: "3",
    type: "saida",
    amount: 500.00,
    currency: "BRL",
    network: "Off-ramp",
    status: "processando",
    date: "2025-01-14 16:45",
    hash: "0x9f1a...4c8b"
  },
  {
    id: "4",
    type: "entrada",
    amount: 220.00,
    currency: "USDC",
    network: "Ethereum",
    status: "confirmado",
    date: "2025-01-14 10:23",
    hash: "0x5e7d...9b4f"
  },
  {
    id: "5",
    type: "entrada",
    amount: 89.99,
    currency: "USDT",
    network: "BSC",
    status: "confirmado",
    date: "2025-01-13 18:56",
    hash: "0x3c2b...6a5d"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showQR, setShowQR] = useState(false);

  const totalBalance = 1245.50;
  const totalToday = 225.50;

  const handleLogout = () => {
    navigate("/");
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "confirmado":
        return <Badge className="bg-success text-success-foreground">Confirmado</Badge>;
      case "pendente":
        return <Badge variant="outline" className="border-warning text-warning">Pendente</Badge>;
      case "processando":
        return <Badge variant="outline" className="border-primary text-primary">Processando</Badge>;
    }
  };

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
                <p className="text-xs text-muted-foreground">Gateway de Pagamento</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardDescription>Saldo Total</CardDescription>
              <CardTitle className="text-3xl font-bold">
                ${totalBalance.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-success">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% este mês</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border">
            <CardHeader className="pb-3">
              <CardDescription>Recebido Hoje</CardDescription>
              <CardTitle className="text-3xl font-bold">
                ${totalToday.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                3 transações
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-border bg-gradient-primary text-primary-foreground">
            <CardHeader className="pb-3">
              <CardDescription className="text-primary-foreground/80">QR Code de Pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => setShowQR(!showQR)}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {showQR ? "Esconder QR" : "Mostrar QR"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Display */}
        {showQR && (
          <Card className="shadow-elevated border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-64 h-64 bg-muted rounded-xl flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Endereço de Recebimento</p>
                  <code className="text-xs bg-muted px-3 py-1 rounded">0x742d35Cc6634C0532925a3b8...3a1f</code>
                </div>
                <p className="text-sm text-muted-foreground max-w-md text-center">
                  Aceita USDC e USDT em BSC, Polygon e Ethereum
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Extrato de Transações</CardTitle>
                <CardDescription>Histórico completo de movimentações</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
            <div className="pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por hash, moeda ou rede..."
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
                      tx.type === "entrada" 
                        ? "bg-success/10 text-success" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {tx.type === "entrada" ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">
                          {tx.type === "entrada" ? "Recebimento" : "Saque"}
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
                      tx.type === "entrada" ? "text-success" : "text-foreground"
                    }`}>
                      {tx.type === "entrada" ? "+" : "-"}${tx.amount.toFixed(2)}
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
