
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Page not found. The page you're looking for doesn't exist. You can return to the home page using the button below."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [location.pathname]);

  const goHome = () => {
    navigate("/");
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Going back to home page.");
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="accessible-card max-w-md w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-3xl-accessible font-bold flex items-center justify-center">
            <AlertTriangle className="mr-2 text-amber-500" size={32} />
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-2xl text-center text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Button 
            onClick={goHome}
            className="w-full text-xl py-6"
            size="lg"
          >
            <Home className="mr-2" size={24} />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
