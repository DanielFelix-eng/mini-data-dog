import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(true);
  const [hovered, setHovered] = useState(false);

  const setHover = useCallback((isHovered) => {
    setHovered(isHovered);
    if (isHovered) setCollapsed(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
    setHovered(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ 
      collapsed: collapsed && !hovered, 
      setHover, 
      isHovered: hovered,
      toggleSidebar 
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}