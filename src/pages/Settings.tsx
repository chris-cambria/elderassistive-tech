
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
    { name: "மேரி (மகள்)", phone: "555-987-6543" },
    { name: "ஜான் (மகன்)", phone: "555-876-5432" },
    { name: "டாக்டர் ஜான்சன்", phone: "555-123-4567" }
  ]);
  const [notifications, setNotifications] = useState({
    medications: true,
    appointments: true,
    healthAlerts: true,
    familyMessages: true
  });
  
  const announcePageLoad = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("அமைப்புகள் பக்கம் ஏற்றப்பட்டது. அணுகல் விருப்பங்கள், அறிவிப்புகள் மற்றும் உங்கள் சுயவிவரத்தை நிர்வகிக்கலாம்.");
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
    
    const sizeLabel = newSize === 1 ? 'சிறிய' : newSize === 2 ? 'நடுத்தர' : 'பெரிய';
    
    toast({
      title: "உரை அளவு மாற்றப்பட்டது",
      description: `உரை அளவு ${sizeLabel} ஆக அமைக்கப்பட்டது`,
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`உரை அளவு ${sizeLabel} ஆக மாற்றப்பட்டது`);
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
      title: contrastMode ? "வழக்கமான காண்ட்ராஸ்ட் பயன்முறை" : "உயர் காண்ட்ராஸ்ட் பயன்முறை",
      description: contrastMode 
        ? "காண்ட்ராஸ்ட் பயன்முறை முடக்கப்பட்டது." 
        : "சிறந்த தெரிவுக்காக உயர் காண்ட்ராஸ்ட் பயன்முறை இயக்கப்பட்டது.",
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        contrastMode 
          ? "வழக்கமான காண்ட்ராஸ்ட் பயன்முறை செயல்படுத்தப்பட்டது." 
          : "உயர் காண்ட்ராஸ்ட் பயன்முறை செயல்படுத்தப்பட்டது."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceControl = () => {
    setVoiceControl(!voiceControl);
    
    toast({
      title: voiceControl ? "குரல் கட்டுப்பாடு முடக்கப்பட்டது" : "குரல் கட்டுப்பாடு இயக்கப்பட்டது",
      description: voiceControl 
        ? "குரல் கட்டுப்பாடு அணைக்கப்பட்டது." 
        : "குரல் கட்டுப்பாடு செயல்படுத்தப்பட்டது.",
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        voiceControl 
          ? "குரல் கட்டுப்பாடு முடக்கப்பட்டது." 
          : "குரல் கட்டுப்பாடு இயக்கப்பட்டது."
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
    
    let notificationName = "";
    switch(key) {
      case "medications": notificationName = "மருந்து நினைவூட்டல்கள்"; break;
      case "appointments": notificationName = "சந்திப்புகள்"; break;
      case "healthAlerts": notificationName = "ஆரோக்கிய அறிவிப்புகள்"; break;
      case "familyMessages": notificationName = "குடும்ப செய்திகள்"; break;
    }
    
    toast({
      title: notifications[key] ? `${notificationName} அறிவிப்புகள் முடக்கப்பட்டன` : `${notificationName} அறிவிப்புகள் இயக்கப்பட்டன`,
      description: notifications[key] 
        ? `${notificationName} குறித்த அறிவிப்புகளை இனி பெற மாட்டீர்கள்.` 
        : `${notificationName} குறித்த அறிவிப்புகளை இப்போது பெறுவீர்கள்.`,
      variant: "default",
    });
  };

  const addEmergencyContact = () => {
    // In a real app, this would open a form to add a new contact
    const newContact = { 
      name: "புதிய தொடர்பு", 
      phone: "555-000-0000" 
    };
    
    setEmergencyContacts([...emergencyContacts, newContact]);
    
    toast({
      title: "அவசர தொடர்பு சேர்க்கப்பட்டது",
      description: "புதிய அவசர தொடர்பு உங்கள் பட்டியலில் சேர்க்கப்பட்டுள்ளது.",
      variant: "default",
    });
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-12">
      <section className="text-center md:text-left">
        <h1 className="text-4xl-accessible font-bold tracking-tight">அமைப்புகள்</h1>
        <p className="text-2xl-accessible text-muted-foreground mt-2">
          உங்கள் அனுபவத்தையும் விருப்பத்தேர்வுகளையும் தனிப்பயனாக்கவும்
        </p>
      </section>

      <Tabs defaultValue="accessibility" className="w-full">
        <TabsList className="grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="accessibility" className="text-xl py-3">
            <Eye className="mr-2 h-5 w-5" />
            அணுகல் தன்மை
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xl py-3">
            <Bell className="mr-2 h-5 w-5" />
            அறிவிப்புகள்
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-xl py-3">
            <UserRound className="mr-2 h-5 w-5" />
            சுயவிவரம்
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="accessibility" className="mt-6 space-y-6">
          <Card className="accessible-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl-accessible">உரை அளவு</CardTitle>
              <CardDescription className="text-xl">
                பயன்பாட்டில் உள்ள உரையின் அளவை சரிசெய்யவும்
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">சிறிய</span>
                  <span className="text-xl">நடுத்தர</span>
                  <span className="text-2xl">பெரிய</span>
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
              <CardTitle className="text-2xl-accessible">காட்சி விருப்பங்கள்</CardTitle>
              <CardDescription className="text-xl">
                திரையில் உள்ளடக்கம் தோன்றும் விதத்தை தனிப்பயனாக்கவும்
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">உயர் காண்ட்ராஸ்ட் பயன்முறை</label>
                    <p className="text-muted-foreground">வலுவான காண்ட்ராஸ்ட் மூலம் தெரிவுத்திறனை மேம்படுத்துகிறது</p>
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
              <CardTitle className="text-2xl-accessible">குரல் கட்டுப்பாடு</CardTitle>
              <CardDescription className="text-xl">
                குரல் கட்டளை அமைப்புகளை உள்ளமைக்கவும்
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">குரல் கட்டளைகளை இயக்கு</label>
                    <p className="text-muted-foreground">குரல் வழிமுறைகளைப் பயன்படுத்தி பயன்பாட்டை வழிநடத்தவும்</p>
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
              <CardTitle className="text-2xl-accessible">அறிவிப்பு விருப்பங்கள்</CardTitle>
              <CardDescription className="text-xl">
                எந்த அறிவிப்புகளைப் பெற விரும்புகிறீர்கள் என்பதைத் தேர்வுசெய்யவும்
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">மருந்து நினைவூட்டல்கள்</label>
                    <p className="text-muted-foreground">மருந்து எடுக்க வேண்டிய நேரத்திற்கான விழிப்பூட்டல்கள்</p>
                  </div>
                  <Switch
                    checked={notifications.medications}
                    onCheckedChange={() => toggleNotification('medications')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">சந்திப்புகள்</label>
                    <p className="text-muted-foreground">வரவிருக்கும் சந்திப்புகள் பற்றிய நினைவூட்டல்கள்</p>
                  </div>
                  <Switch
                    checked={notifications.appointments}
                    onCheckedChange={() => toggleNotification('appointments')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">ஆரோக்கிய அறிவிப்புகள்</label>
                    <p className="text-muted-foreground">முக்கியமான ஆரோக்கிய நிலை அறிவிப்புகள்</p>
                  </div>
                  <Switch
                    checked={notifications.healthAlerts}
                    onCheckedChange={() => toggleNotification('healthAlerts')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xl font-medium">குடும்ப செய்திகள்</label>
                    <p className="text-muted-foreground">குடும்ப உறுப்பினர்களிடமிருந்து வரும் செய்திகள்</p>
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
              <CardTitle className="text-2xl-accessible">தனிப்பட்ட தகவல்</CardTitle>
              <CardDescription className="text-xl">
                உங்கள் தனிப்பட்ட விவரங்களை நிர்வகிக்கவும்
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-secondary rounded-lg">
                  <div>
                    <h3 className="text-xl font-medium">முழு பெயர்</h3>
                    <p className="text-lg">தாமஸ் ஆண்டர்சன்</p>
                  </div>
                  <Button variant="ghost" className="mt-2 sm:mt-0">
                    <span className="mr-1">திருத்து</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-secondary rounded-lg">
                  <div>
                    <h3 className="text-xl font-medium">பிறந்த தேதி</h3>
                    <p className="text-lg">மே 15, 1945</p>
                  </div>
                  <Button variant="ghost" className="mt-2 sm:mt-0">
                    <span className="mr-1">திருத்து</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-secondary rounded-lg">
                  <div>
                    <h3 className="text-xl font-medium">முகவரி</h3>
                    <p className="text-lg">123 மெயின் ஸ்ட்ரீட், ஏனிடவுன், அமெரிக்கா</p>
                  </div>
                  <Button variant="ghost" className="mt-2 sm:mt-0">
                    <span className="mr-1">திருத்து</span>
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="accessible-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl-accessible flex items-center justify-between">
                <span>அவசர தொடர்புகள்</span>
                <Button onClick={addEmergencyContact}>
                  <Plus size={18} className="mr-1" />
                  தொடர்பு சேர்
                </Button>
              </CardTitle>
              <CardDescription className="text-xl">
                அவசர நிலையில் தொடர்பு கொள்ள வேண்டிய நபர்கள்
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
                        <span className="mr-1">திருத்து</span>
                        <ChevronRight size={16} />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <span className="mr-1">அகற்று</span>
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
