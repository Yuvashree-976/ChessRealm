import GameSidebar from "@/components/chess/GameSidebar";
import { Settings as SettingsIcon, Volume2, Palette, Monitor, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Settings = () => (
  <div className="flex min-h-screen bg-background">
    <GameSidebar />
    <main className="flex-1 p-6 lg:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <div className="space-y-4">
          {[
            { icon: Volume2, label: "Sound Effects", desc: "Play sounds on moves and captures", defaultOn: true },
            { icon: Palette, label: "Piece Animations", desc: "Smooth piece movement transitions", defaultOn: true },
            { icon: Monitor, label: "Board Coordinates", desc: "Show rank and file labels", defaultOn: true },
            { icon: Bell, label: "Notifications", desc: "Get notified when it's your turn", defaultOn: false },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <s.icon className="w-5 h-5 text-primary" />
                <div>
                  <Label className="text-foreground font-medium">{s.label}</Label>
                  <p className="text-muted-foreground text-xs">{s.desc}</p>
                </div>
              </div>
              <Switch defaultChecked={s.defaultOn} />
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

export default Settings;
