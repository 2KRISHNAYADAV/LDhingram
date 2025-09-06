import { Home, Search, Play, Heart, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show navigation on auth pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Search, path: '/search', label: 'Search' },
    { icon: Play, path: '/reels', label: 'Reels' },
    { icon: Heart, path: '/notifications', label: 'Notifications' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center p-2 transition-smooth group touch-target",
                isActive && "text-black"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 transition-smooth",
                  isActive ? "text-black" : "text-gray-600 group-hover:text-black"
                )} 
              />
              <span className={cn(
                "text-xs mt-1 font-medium transition-smooth",
                isActive ? "text-black" : "text-gray-600 group-hover:text-black"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;