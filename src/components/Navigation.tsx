
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
    { name: "Home", icon: Home, path: "/" },
    { name: "Health", icon: HeartPulse, path: "/health" },
    { name: "Alerts", icon: Bell, path: "/alerts" },
    { name: "Settings", icon: Settings, path: "/settings" },
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
          title: "Voice Navigation Unavailable",
          description: "Your browser does not support voice commands.",
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
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice Navigation Active",
          description: "Try saying: 'go to home', 'open health', etc.",
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
          title: "Voice Recognition Error",
          description: "Please try again later.",
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
        title: "Voice Navigation Error",
        description: "There was a problem starting voice navigation.",
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
    
    // Handle navigation commands
    if (command.includes('go to') || command.includes('open') || command.includes('show')) {
      for (const item of navItems) {
        if (command.includes(item.name.toLowerCase())) {
          navigate(item.path);
          toast({
            title: `Navigating to ${item.name}`,
            description: `Opening the ${item.name} page for you.`,
          });
          return;
        }
      }
    }
    
    // Handle emergency command
    if (command.includes('emergency') || command.includes('help')) {
      toast({
        title: "Emergency Assistance",
        description: "Contacting emergency services. Please stay calm.",
        variant: "destructive",
      });
      navigate('/emergency');
      return;
    }

    // If no command matched
    toast({
      title: "Voice Command Not Recognized",
      description: "Please try again with a valid command.",
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
        <div className="fixed top-0 left-0 right-0 bg-background z-50 flex items-center justify-between p-4 border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-2xl"
          >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </Button>
          <h1 className="text-2xl-accessible font-semibold">ElderAssist</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleListening}
            className={`voice-indicator ${isListening ? 'listening' : ''}`}
            aria-label={isListening ? "Stop voice navigation" : "Start voice navigation"}
          >
            {isListening ? <Mic size={24} className="text-white" /> : <MicOff size={24} />}
          </Button>
        </div>
      )}
      
      {/* Sidebar for navigation */}
      <div 
        className={`fixed left-0 top-0 bottom-0 bg-background border-r w-64 p-6 z-40 transition-transform duration-300 flex flex-col ${
          isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        } ${isMobile ? 'mt-16' : ''}`}
      >
        {!isMobile && (
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl-accessible font-semibold">ElderAssist</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={`voice-indicator ${isListening ? 'listening' : ''}`}
              aria-label={isListening ? "Stop voice navigation" : "Start voice navigation"}
            >
              {isListening ? <Mic size={24} className="text-white" /> : <MicOff size={24} />}
            </Button>
          </div>
        )}
        
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className="w-full justify-start text-xl p-4"
              onClick={() => {
                navigate(item.path);
                if (isMobile) setIsSidebarOpen(false);
              }}
            >
              <item.icon className="mr-3" size={24} />
              {item.name}
            </Button>
          ))}
        </nav>
        
        <div className="mt-auto pt-6 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start text-xl p-4"
            onClick={() => {
              navigate('/emergency');
              if (isMobile) setIsSidebarOpen(false);
            }}
          >
            <Bell className="mr-3 text-destructive" size={24} />
            Emergency
          </Button>
        </div>
      </div>
      
      {/* Main content area with proper spacing for sidebar */}
      <main className={`transition-all duration-300 min-h-screen ${
        isMobile ? 'pt-20 px-4' : 'ml-64 p-6'
      }`}>
        {/* This is where your page content will go */}
      </main>
    </>
  );
};

export default Navigation;
