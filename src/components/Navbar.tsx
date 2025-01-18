import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiBell,
  FiChevronDown,
  FiBookOpen,
  FiPhone,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FaTachometerAlt, FaSignOutAlt, FaFileAlt } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navbar() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNotifications();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user) return;
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("name, profile_image_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      if (!user) return;
      const { data: notifications, error } = await supabase
        .from("notifications")
        .select("id, title, message, created_at")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications(notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    const isDark = savedMode === "dark";
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
      <div className="container flex h-16 items-center px-4 justify-between">
        {/* Logo and Sidebar Trigger */}
        <div className="flex items-center">
          <SidebarTrigger className="mr-4 hidden md:block" />
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
          >
            Sakshatkar
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </Button>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/news")} className="flex items-center space-x-2">
            <FiBookOpen className="w-6 h-6" />
            <span>News</span>
          </Button>
          <Button variant="ghost" onClick={() => navigate("/contact")} className="flex items-center space-x-2">
            <FiPhone className="w-6 h-6" />
            <span>Contact</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative">
                <FiBell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id}>
                    <span className="font-medium">{notification.title}</span>
                    <span>{notification.message}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <Button variant="ghost" onClick={toggleDarkMode}>
            {isDarkMode ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
          </Button>

          {/* User Profile */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <img
                    src={profile?.profile_image_url || "/placeholder.svg"}
                    alt="User Profile"
                    className="w-8 h-8 object-cover rounded-full"
                  />
                  <span>{profile?.name || user.email}</span>
                  <FiChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <FaTachometerAlt className="mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <hr className="border-t border-gray-300" />
                
                <DropdownMenuItem onClick={() => navigate("/policy")}>
                  <FaFileAlt style={{ marginRight: '8px' }} />
                  Policy
                </DropdownMenuItem>
                <hr className="border-t border-gray-300" />
                
                <DropdownMenuItem onClick={handleLogout}>
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 p-4 md:hidden">
            <Button variant="ghost" onClick={() => navigate("/news")} className="w-full">
              News
            </Button>
            <Button variant="ghost" onClick={() => navigate("/contact")} className="w-full">
              Contact
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
