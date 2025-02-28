
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  UserRound, 
  Volume2, 
  Bell, 
  Smartphone, 
  Shield,
  Eye,
  Mic,
  Share2,
  ChevronRight,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [textSize, setTextSize] = useState(2); // 1-3: small, medium, large
  const [contrastMode, setContrastMode] = useState(false);
  const [voiceControl, setVoiceControl] = useState(true);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: "Mary (Daughter)", phone: "555-987-6543" },
    { name: "John (Son)", phone: "555-876-5432" },
    { name: "Dr. Johnson", phone: "555-123-4567" }
  ]);
  const [notifications, setNotifications] = useState({
    medications: true,
    appointments: true,
    healthAlerts: true,
    familyMessages: true
  });
  
  const announcePageLoad = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Settings page loaded. You can adjust accessibility preferences, notifications, and manage your profile.");
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Small delay to ensure screen reader doesn't conflict
    const timer = setTimeout(() => {
      announcePageLoad();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTextSizeChange = (value: number[]) => {
    const newSize = value[0];
    setTextSize(newSize);
    
    document.documentElement.style.fontSize = 
      newSize === 1 ? '14px' : 
      newSize === 2 ? '16px' : '18px';
    
    const sizeLabel = newSize === 1 ? 'Small' : newSize === 2 ? 'Medium' : 'Large';
    
    toast({
      title: "Text Size Changed",
      description: `Text size set to ${sizeLabel}`,
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Text size changed to ${sizeLabel}`);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleContrastMode = () => {
    setContrastMode(!contrastMode);
    
    if (!contrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    toast({
      title: contrastMode ? "Standard Contrast Mode" : "High Contrast Mode",
      description: contrastMode 
        ? "Contrast mode has been disabled." 
        : "High contrast mode has been enabled for better visibility.",
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        contrastMode 
          ? "Standard contrast mode activated." 
          : "High contrast mode activated."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceControl = () => {
    setVoiceControl(!voiceControl);
    
    toast({
      title: voiceControl ? "Voice Control Disabled" : "Voice Control Enabled",
      description: voiceControl 
        ? "Voice control has been turned off." 
        : "Voice control has been activated.",
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        voiceControl 
          ? "Voice control deactivated." 
          : "Voice control activated."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
    
    toast({
      title: notifications[key] ? `${key} Notifications Disabled` : `${key} Notifications Enabled`,
      description: notifications[key] 
        ? `You will no longer receive notifications for ${key}.` 
        : `You will now receive notifications for ${key}.`,
      variant: "default",
    });
  };

  const addEmergencyContact = () => {
    // In a real app, this would open a form to add a new contact
    const newContact = { 
      name: "New Contact", 
      phone: "555-000-0000" 
    };
    
    setEmergencyContacts([...emergencyContacts, newContact]);
    
    toast({
      title: "Emergency Contact Added",
      description: "New emergency contact has been added to your list.",
      variant: "default",
    });
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-12">
      <section className="text-center md:text-left">
        <h1 className="text-4xl-accessible font-bold tracking-tight">Settings</h1>
        <p className="text-2xl-accessible text-muted-foreground mt-2">
          Customize your experience and preferences
        </p>
      </section>

      <Tabs defaultValue="accessibility" className="w-full">
        <TabsList className="grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="accessibility" className="text-xl py-3">
            <Eye className="mr-2 h-5 w-5" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xl py-3">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-xl py-3">
            <UserRound className="mr-2 h-5 w-5" />
            Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="accessibility" className="mt-6 space-y-6">
          <Card className="accessible-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl-accessible">Text Size</CardTitle>
              <CardDescription className="text-xl">
                Adjust the size of text throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Small</span>
                  <span className="text-xl">Medium</span>
                  <span className="text-2xl">Large</span>
                </div>
                <Slider
                  defaultValue={[textSize]}
                  max={3}
                  min={1}
                  step={1}
                  onValueChange={handleTextSizeChange}
                  className="py-4"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="accessible-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl-accessible">Display Options</CardTitle>
              <CardDescription className="text-xl">
                Customize how content appears on screen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">High Contrast Mode</label>
                    <p className="text-muted-foreground">Enhances visibility with stronger contrast</p>
                  </div>
                  <Switch
                    checked={contrastMode}
                    onCheckedChange={toggleContrastMode}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="accessible-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl-accessible">Voice Control</CardTitle>
              <CardDescription className="text-xl">
                Configure voice command settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">Enable Voice Commands</label>
                    <p className="text-muted-foreground">Navigate the app using voice instructions</p>
                  </div>
                  <Switch
                    checked={voiceControl}
                    onCheckedChange={toggleVoiceControl}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="accessible-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl-accessible">Notification Preferences</CardTitle>
              <CardDescription className="text-xl">
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">Medication Reminders</label>
                    <p className="text-muted-foreground">Alerts for when to take medications</p>
                  </div>
                  <Switch
                    checked={notifications.medications}
                    onCheckedChange={() => toggleNotification('medications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">Appointments</label>
                    <p className="text-muted-foreground">Reminders about upcoming appointments</p>
                  </div>
                  <Switch
                    checked={notifications.appointments}
                    onCheckedChange={() => toggleNotification('appointments')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">Health Alerts</label>
                    <p className="text-muted-foreground">Important health status notifications</p>
                  </div>
                  <Switch
                    checked={notifications.healthAlerts}
                    onCheckedChange={() => toggleNotification('healthAlerts')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">Family Messages</label>
                    <p className="text-muted-foreground">Messages from family members</p>
                  </div>
                  <Switch
                    checked={notifications.familyMessages}
                    onCheckedChange={() => toggleNotification('familyMessages')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="accessible-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl-accessible">Personal Information</CardTitle>
              <CardDescription className="text-xl">
                Manage your personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-secondary rounded-lg">
                  <div>
                    <h3 className="text-xl font-medium">Full Name</h3>
                    <p className="text-lg">Thomas Anderson</p>
                  </div>
                  <Button variant="ghost" className="mt-2 sm:mt-0">
                    <span className="mr-1">Edit</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-secondary rounded-lg">
                  <div>
                    <h3 className="text-xl font-medium">Date of Birth</h3>
                    <p className="text-lg">May 15, 1945</p>
                  </div>
                  <Button variant="ghost" className="mt-2 sm:mt-0">
                    <span className="mr-1">Edit</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-secondary rounded-lg">
                  <div>
                    <h3 className="text-xl font-medium">Address</h3>
                    <p className="text-lg">123 Main Street, Anytown, USA</p>
                  </div>
                  <Button variant="ghost" className="mt-2 sm:mt-0">
                    <span className="mr-1">Edit</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="accessible-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl-accessible flex items-center justify-between">
                <span>Emergency Contacts</span>
                <Button onClick={addEmergencyContact}>
                  <Plus size={18} className="mr-1" />
                  Add Contact
                </Button>
              </CardTitle>
              <CardDescription className="text-xl">
                People to contact in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div 
                    key={index}
                    className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-secondary rounded-lg"
                  >
                    <div>
                      <h3 className="text-xl font-medium">{contact.name}</h3>
                      <p className="text-lg">{contact.phone}</p>
                    </div>
                    <div className="flex mt-2 sm:mt-0">
                      <Button variant="outline" size="sm" className="mr-2">
                        <span className="mr-1">Edit</span>
                        <ChevronRight size={16} />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <span className="mr-1">Remove</span>
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add Plus component
const Plus = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
};

export default Settings;
