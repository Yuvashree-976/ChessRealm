import GameSidebar from "@/components/chess/GameSidebar";
import { Users, MessageSquare, UserPlus, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const friends = [
  { name: "GrandMaster42", rating: 1850, online: true },
  { name: "PawnStorm", rating: 1420, online: true },
  { name: "BishopPair", rating: 1680, online: false },
  { name: "KnightRider99", rating: 1560, online: false },
];

const Social = () => (
  <div className="flex min-h-screen bg-background">
    <GameSidebar />
    <main className="flex-1 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Social</h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Friends</h3>
            <div className="space-y-3">
              {friends.map(f => (
                <div key={f.name} className="flex items-center justify-between p-2 rounded hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${f.online ? "bg-green-400" : "bg-muted-foreground"}`} />
                    <span className="text-foreground font-medium text-sm">{f.name}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{f.rating}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full border-border"><UserPlus className="w-4 h-4 mr-1" /> Add Friend</Button>
          </div>
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Messages</h3>
            <p className="text-muted-foreground text-sm">No new messages</p>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default Social;
