
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Bell, Settings, UserRound, Activity, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("நல்ல நாள்");
  const [userName, setUserName] = useState("பயனர்");
  const [todayActivities, setTodayActivities] = useState([
    { time: "9:00 AM", activity: "காலை மருந்து எடுத்துக்கொள்ளுங்கள்" },
    { time: "10:30 AM", activity: "குடும்பத்துடன் வீடியோ அழைப்பு" },
    { time: "12:00 PM", activity: "மதிய உணவு நேரம்" },
    { time: "3:00 PM", activity: "மதிய நடைப்பயிற்சி" },
    { time: "6:00 PM", activity: "மாலை மருந்து" }
  ]);
  
  // Set appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("காலை வணக்கம்");
    else if (hour < 18) setGreeting("மதிய வணக்கம்");
    else setGreeting("மாலை வணக்கம்");
    
    // In a real app, this would come from user authentication
    setUserName("தாமஸ்");
  }, []);

  const announceWelcome = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${greeting}, ${userName}. உங்கள் எல்டர்அசிஸ்ட் டாஷ்போர்டிற்கு வரவேற்கிறோம்.`);
      utterance.rate = 0.9; // Slightly slower for better comprehension
      window.speechSynthesis.speak(utterance);
    }
  };

  // Announce welcome message on page load
  useEffect(() => {
    // Small delay to ensure screen reader doesn't conflict
    const timer = setTimeout(() => {
      announceWelcome();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [greeting, userName]);

  const navigateWithAnnouncement = (path: string, title: string) => {
    toast({
      title: `${title} திறக்கிறது`,
      description: `${title} பக்கத்திற்கு செல்கிறது.`,
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${title} பக்கம் திறக்கிறது.`);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    
    navigate(path);
  };

  return (
    <div className="animate-fade-in space-y-3 max-w-5xl mx-auto pb-4 px-1">
      <section className="text-center md:text-left">
        <h1 className="text-2xl md:text-4xl-accessible font-bold tracking-tight">{greeting}, {userName}</h1>
        <p className="text-lg md:text-2xl-accessible text-muted-foreground">
          உங்கள் தனிப்பட்ட டாஷ்போர்டிற்கு வரவேற்கிறோம்
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <Card className="accessible-card" onClick={() => navigateWithAnnouncement("/health", "ஆரோக்கிய டாஷ்போர்ட்")}>
          <CardHeader className="pb-1 p-2">
            <CardTitle className="text-lg md:text-2xl-accessible flex items-center">
              <HeartPulse className="mr-2 text-primary" size={22} />
              ஆரோக்கியம்
            </CardTitle>
            <CardDescription className="text-md">உங்கள் உடல்நிலையை கண்காணித்தல்</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-md">இதய துடிப்பு</p>
                <p className="text-xl md:text-3xl-accessible font-semibold">72 BPM</p>
              </div>
              <Activity size={36} className="text-primary/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="accessible-card" onClick={() => navigateWithAnnouncement("/alerts", "அறிவிப்புகள் & நினைவூட்டல்கள்")}>
          <CardHeader className="pb-1 p-2">
            <CardTitle className="text-lg md:text-2xl-accessible flex items-center">
              <Bell className="mr-2 text-primary" size={22} />
              நினைவூட்டல்கள்
            </CardTitle>
            <CardDescription className="text-md">இன்றைய அட்டவணை</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {todayActivities.slice(0, 2).map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-md font-medium">{item.time}</span>
                  <span className="text-md sm:text-right">{item.activity}</span>
                </div>
              ))}
              <p className="text-sm text-muted-foreground italic">+3 மேலும் செயல்பாடுகள்</p>
            </div>
          </CardContent>
        </Card>

        <Card className="accessible-card" onClick={() => navigateWithAnnouncement("/settings", "அமைப்புகள்")}>
          <CardHeader className="pb-1 p-2">
            <CardTitle className="text-lg md:text-2xl-accessible flex items-center">
              <UserRound className="mr-2 text-primary" size={22} />
              சுயவிவரம்
            </CardTitle>
            <CardDescription className="text-md">உங்கள் தகவல்</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between">
                <span className="text-md font-medium">அடுத்த சந்திப்பு</span>
                <span className="text-md">மே 15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-md font-medium">மருத்துவர்</span>
                <span className="text-md">டாக்டர் ஜான்சன்</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="accessible-card">
          <CardHeader className="p-2">
            <CardTitle className="text-lg md:text-2xl-accessible flex items-center">
              <Calendar className="mr-2 text-primary" size={22} />
              இன்றைய அட்டவணை
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {todayActivities.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col xs:flex-row justify-between items-start xs:items-center p-1.5 bg-secondary rounded-xl"
                >
                  <span className="text-md font-semibold">{item.time}</span>
                  <span className="text-md mt-0.5 xs:mt-0">{item.activity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex justify-center mt-3">
        <Button 
          size="lg" 
          className="accessible-button bg-destructive hover:bg-destructive/90 text-white text-md p-3 h-auto" 
          onClick={() => navigateWithAnnouncement("/emergency", "அவசர உதவி")}
        >
          <Bell className="mr-2" size={18} />
          அவசர உதவி
        </Button>
      </section>
    </div>
  );
};

export default Index;
