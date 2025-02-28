
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, Pill, Check, X, Plus, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Alerts = () => {
  const { toast } = useToast();
  // Sample reminder data
  const [reminders, setReminders] = useState([
    { 
      id: 1, 
      title: "காலை மருந்து", 
      time: "8:00 AM", 
      type: "medication", 
      details: "லிசினோப்ரில் 10mg தண்ணீருடன் எடுக்கவும்",
      active: true,
      completed: false
    },
    { 
      id: 2, 
      title: "மருத்துவர் சந்திப்பு", 
      time: "10:30 AM", 
      type: "appointment", 
      details: "டாக்டர் ஜான்சன் - இரத்த அழுத்த பரிசோதனை",
      active: true,
      completed: false
    },
    { 
      id: 3, 
      title: "மதிய நடைப்பயிற்சி", 
      time: "2:00 PM", 
      type: "activity", 
      details: "தொகுப்பில் 30 நிமிட நடைப்பயிற்சி",
      active: true,
      completed: false
    },
    { 
      id: 4, 
      title: "மாலை மருந்து", 
      time: "7:00 PM", 
      type: "medication", 
      details: "இரவு உணவுக்குப் பிறகு மெட்ஃபார்மின் 500mg எடுக்கவும்",
      active: true,
      completed: false
    },
    { 
      id: 5, 
      title: "குடும்பத்தை அழைக்க", 
      time: "5:00 PM", 
      type: "social", 
      details: "மகளுடன் வீடியோ அழைப்பு",
      active: true,
      completed: true
    }
  ]);
  
  const [voiceRemindersEnabled, setVoiceRemindersEnabled] = useState(true);

  const announcePageLoad = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("அறிவிப்புகள் மற்றும் நினைவூட்டல்கள் பக்கம். இன்றைக்கு உங்களுக்கு நினைவூட்டல்கள் உள்ளன. குரல் நினைவூட்டல்கள் இயக்கப்பட்டுள்ளன.");
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

  const handleVoiceRemindersToggle = () => {
    setVoiceRemindersEnabled(!voiceRemindersEnabled);
    
    toast({
      title: voiceRemindersEnabled ? "குரல் நினைவூட்டல்கள் முடக்கப்பட்டன" : "குரல் நினைவூட்டல்கள் இயக்கப்பட்டன",
      description: voiceRemindersEnabled 
        ? "நினைவூட்டல்களுக்கான குரல் அறிவிப்புகளை இனி பெற மாட்டீர்கள்." 
        : "நினைவூட்டல்களுக்கான குரல் அறிவிப்புகளை இப்போது பெறுவீர்கள்.",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        voiceRemindersEnabled 
          ? "குரல் நினைவூட்டல்கள் அணைக்கப்பட்டன." 
          : "குரல் நினைவூட்டல்கள் இயக்கப்பட்டன."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleReminderActive = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, active: !reminder.active }
        : reminder
    ));
    
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      toast({
        title: reminder.active ? "நினைவூட்டல் முடக்கப்பட்டது" : "நினைவூட்டல் இயக்கப்பட்டது",
        description: `"${reminder.title}" ${reminder.active ? "முடக்கப்பட்டது" : "இயக்கப்பட்டது"}.`,
      });
    }
  };

  const toggleReminderCompleted = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
    
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      const newStatus = !reminder.completed;
      toast({
        title: newStatus ? "நினைவூட்டல் முடிக்கப்பட்டது" : "நினைவூட்டல் மீண்டும் திறக்கப்பட்டது",
        description: `"${reminder.title}" ${newStatus ? "முடிக்கப்பட்டதாக" : "முடிக்கப்படாததாக"} குறிக்கப்பட்டுள்ளது.`,
        variant: "default",
      });
      
      if ('speechSynthesis' in window && voiceRemindersEnabled) {
        const utterance = new SpeechSynthesisUtterance(
          newStatus 
            ? `${reminder.title} முடிக்கப்பட்டதாக குறிக்கப்பட்டது.` 
            : `${reminder.title} முடிக்கப்படாததாக குறிக்கப்பட்டது.`
        );
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const addDemoReminder = () => {
    const newReminder = {
      id: Math.max(...reminders.map(r => r.id)) + 1,
      title: "செடிகளுக்கு நீர் ஊற்ற", 
      time: "4:30 PM", 
      type: "activity", 
      details: "உள் செடிகளுக்கு நீர் ஊற்ற",
      active: true,
      completed: false
    };
    
    setReminders([...reminders, newReminder]);
    
    toast({
      title: "புதிய நினைவூட்டல் சேர்க்கப்பட்டது",
      description: `"${newReminder.title}" உங்கள் நினைவூட்டல்களில் சேர்க்கப்பட்டுள்ளது.`,
      variant: "default",
    });
    
    if ('speechSynthesis' in window && voiceRemindersEnabled) {
      const utterance = new SpeechSynthesisUtterance(
        `புதிய நினைவூட்டல் சேர்க்கப்பட்டது: ${newReminder.time} மணிக்கு ${newReminder.title}.`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper function to get icon for reminder type
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "medication": return <Pill className="h-6 w-6 text-blue-500" />;
      case "appointment": return <Calendar className="h-6 w-6 text-violet-500" />;
      case "activity": return <Clock className="h-6 w-6 text-green-500" />;
      case "social": return <Volume2 className="h-6 w-6 text-amber-500" />;
      default: return <Bell className="h-6 w-6 text-primary" />;
    }
  };

  const getTypeBadge = (type: string) => {
    let className = "";
    let typeName = "";
    
    switch(type) {
      case "medication": 
        className = "bg-blue-100 text-blue-800"; 
        typeName = "மருந்து";
        break;
      case "appointment": 
        className = "bg-violet-100 text-violet-800"; 
        typeName = "சந்திப்பு";
        break;
      case "activity": 
        className = "bg-green-100 text-green-800"; 
        typeName = "செயல்பாடு";
        break;
      case "social": 
        className = "bg-amber-100 text-amber-800"; 
        typeName = "சமூக";
        break;
      default: 
        className = "bg-primary/20 text-primary-foreground";
        typeName = type;
    }
    
    return (
      <Badge variant="outline" className={`text-lg px-3 py-1 ${className}`}>
        {typeName}
      </Badge>
    );
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-12 px-4">
      <section className="text-center md:text-left">
        <h1 className="text-4xl-accessible font-bold tracking-tight">அறிவிப்புகள் & நினைவூட்டல்கள்</h1>
        <p className="text-2xl-accessible text-muted-foreground mt-2">
          உங்கள் தினசரி அட்டவணையையும் நினைவூட்டல்களையும் நிர்வகிக்கவும்
        </p>
      </section>

      <Card className="accessible-card">
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl-accessible">குரல் நினைவூட்டல்கள்</CardTitle>
              <CardDescription className="text-xl mt-1">
                குரல் அறிவிப்புகளை இயக்கவும் அல்லது முடக்கவும்
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <Switch 
                id="voice-mode" 
                checked={voiceRemindersEnabled}
                onCheckedChange={handleVoiceRemindersToggle}
              />
              <label htmlFor="voice-mode" className="text-xl">
                {voiceRemindersEnabled ? "இயக்கப்பட்டது" : "முடக்கப்பட்டது"}
              </label>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl-accessible font-semibold">இன்றைய நினைவூட்டல்கள்</h2>
          <Button 
            onClick={addDemoReminder}
            className="text-lg px-6 py-2"
          >
            <Plus className="mr-2 h-5 w-5" />
            நினைவூட்டல் சேர்
          </Button>
        </div>
        
        <div className="space-y-6">
          {reminders.map(reminder => (
            <Card 
              key={reminder.id} 
              className={`accessible-card transition-all ${
                !reminder.active ? 'opacity-60' : 
                reminder.completed ? 'border-green-300 bg-green-50' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 flex-shrink-0">
                      {getTypeIcon(reminder.type)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className={`text-2xl font-medium mb-2 ${reminder.completed ? 'line-through' : ''}`}>
                        {reminder.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-xl text-muted-foreground">{reminder.time}</span>
                        {getTypeBadge(reminder.type)}
                      </div>
                      <p className="text-xl mt-2 break-words">{reminder.details}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mt-4 lg:mt-0 justify-end">
                    <Button
                      variant={reminder.completed ? "outline" : "default"}
                      size="icon"
                      className="h-14 w-14"
                      onClick={() => toggleReminderCompleted(reminder.id)}
                      title={reminder.completed ? "முடிக்கப்படாதது என குறிக்க" : "முடிக்கப்பட்டது என குறிக்க"}
                    >
                      <Check className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-14 w-14"
                      onClick={() => toggleReminderActive(reminder.id)}
                      title={reminder.active ? "நினைவூட்டலை முடக்கு" : "நினைவூட்டலை இயக்கு"}
                    >
                      {reminder.active ? <Bell className="h-6 w-6" /> : <X className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Alerts;
