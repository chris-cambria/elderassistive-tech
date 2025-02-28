
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Home, HeartPulse, Bell, Settings, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate, useLocation } from "react-router-dom";

// Add TypeScript declarations for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onstart: () => void;
  onend: () => void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Add declarations for browser-specific implementations
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

const Navigation = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const navItems = [
    { name: "முகப்பு", icon: Home, path: "/" },
    { name: "ஆரோக்கியம்", icon: HeartPulse, path: "/health" },
    { name: "நினைவூட்டல்கள்", icon: Bell, path: "/alerts" },
    { name: "அமைப்புகள்", icon: Settings, path: "/settings" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    try {
      // Check if the browser supports speech recognition
      if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        toast({
          title: "குரல் வழிசெலுத்தல் கிடைக்கவில்லை",
          description: "உங்கள் உலாவி குரல் கட்டளைகளை ஆதரிக்கவில்லை.",
          variant: "destructive",
        });
        return;
      }

      // Initialize speech recognition
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        throw new Error("Speech recognition not supported");
      }
      
      const recognition = new SpeechRecognitionAPI();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ta-IN'; // Setting to Tamil language
      
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "குரல் வழிசெலுத்தல் செயலில் உள்ளது",
          description: "இதைச் சொல்லி முயற்சிக்கவும்: 'முகப்புக்குச் செல்', 'ஆரோக்கியத்தைத் திற', போன்றவை.",
        });
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        processVoiceCommand(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "குரல் அங்கீகாரப் பிழை",
          description: "பின்னர் மீண்டும் முயற்சிக்கவும்.",
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast({
        title: "குரல் வழிசெலுத்தல் பிழை",
        description: "குரல் வழிசெலுத்தலைத் தொடங்குவதில் சிக்கல் ஏற்பட்டது.",
        variant: "destructive",
      });
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    
    // Handle navigation commands - using Tamil words
    if (command.includes('செல்') || command.includes('திற') || command.includes('காட்டு')) {
      if (command.includes('முகப்பு') || command.includes('முதல்')) {
        navigate('/');
        toast({
          title: "முகப்புக்கு செல்கிறது",
          description: "முகப்பு பக்கத்தை உங்களுக்காகத் திறக்கிறது.",
        });
        return;
      }
      
      if (command.includes('ஆரோக்கிய')) {
        navigate('/health');
        toast({
          title: "ஆரோக்கியத்திற்கு செல்கிறது",
          description: "ஆரோக்கியப் பக்கத்தை உங்களுக்காகத் திறக்கிறது.",
        });
        return;
      }
      
      if (command.includes('நினைவூட்டல்') || command.includes('அறிவிப்பு')) {
        navigate('/alerts');
        toast({
          title: "நினைவூட்டல்களுக்கு செல்கிறது",
          description: "நினைவூட்டல்கள் பக்கத்தை உங்களுக்காகத் திறக்கிறது.",
        });
        return;
      }
      
      if (command.includes('அமைப்பு')) {
        navigate('/settings');
        toast({
          title: "அமைப்புகளுக்கு செல்கிறது",
          description: "அமைப்புகள் பக்கத்தை உங்களுக்காகத் திறக்கிறது.",
        });
        return;
      }
    }
    
    // Handle emergency command
    if (command.includes('அவசர') || command.includes('உதவி')) {
      toast({
        title: "அவசர உதவி",
        description: "அவசர சேவைகளைத் தொடர்பு கொள்கிறது. தயவுசெய்து அமைதியாக இருக்கவும்.",
        variant: "destructive",
      });
      navigate('/emergency');
      return;
    }

    // If no command matched
    toast({
      title: "குரல் கட்டளை அங்கீகரிக்கப்படவில்லை",
      description: "செல்லுபடியாகும் கட்டளையுடன் மீண்டும் முயற்சிக்கவும்.",
      variant: "default",
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <>
      {/* Mobile header with menu button */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-background z-50 flex items-center justify-between p-3 border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-2xl"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          <h1 className="text-xl font-semibold truncate">எல்டர்அசிஸ்ட்</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleListening}
            className={`voice-indicator ${isListening ? 'listening' : ''}`}
            aria-label={isListening ? "குரல் வழிசெலுத்தலை நிறுத்து" : "குரல் வழிசெலுத்தலைத் தொடங்கு"}
          >
            {isListening ? <Mic size={20} className="text-white" /> : <MicOff size={20} />}
          </Button>
        </div>
      )}
      
      {/* Sidebar for navigation */}
      <div 
        className={`fixed left-0 top-0 bottom-0 bg-background border-r w-64 p-4 z-40 transition-transform duration-300 flex flex-col ${
          isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        } ${isMobile ? 'mt-14' : ''}`}
      >
        {!isMobile && (
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">எல்டர்அசிஸ்ட்</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={`voice-indicator ${isListening ? 'listening' : ''}`}
              aria-label={isListening ? "குரல் வழிசெலுத்தலை நிறுத்து" : "குரல் வழிசெலுத்தலைத் தொடங்கு"}
            >
              {isListening ? <Mic size={20} className="text-white" /> : <MicOff size={20} />}
            </Button>
          </div>
        )}
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className="w-full justify-start text-lg p-3"
              onClick={() => {
                navigate(item.path);
                if (isMobile) setIsSidebarOpen(false);
              }}
            >
              <item.icon className="mr-2" size={20} />
              {item.name}
            </Button>
          ))}
        </nav>
        
        <div className="mt-auto pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start text-lg p-3"
            onClick={() => {
              navigate('/emergency');
              if (isMobile) setIsSidebarOpen(false);
            }}
          >
            <Bell className="mr-2 text-destructive" size={20} />
            அவசர உதவி
          </Button>
        </div>
      </div>
      
      {/* Main content area with proper spacing for sidebar */}
      <main className={`transition-all duration-300 min-h-screen ${
        isMobile ? 'pt-16 px-3' : 'ml-64 p-5'
      }`}>
        {/* This is where your page content will go */}
      </main>
    </>
  );
};

export default Navigation;
