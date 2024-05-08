import React, {useState} from 'react';
import {Box, CssBaseline} from "@mui/material";
import TopBar from "@frontend-ai/app/layout/TopBar";
import Sidebar from "@frontend-ai/app/layout/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = (props: MainLayoutProps) => {

  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  const handleOpenSidebar = (sidebarOpenFromTopBar: boolean) => {
    setSideBarOpen(sidebarOpenFromTopBar);
  }

  return (
    <Box sx={{
      paddingTop: {
        xs: "56px",
        sm: "64px"
      },
      paddingLeft: {
        lg: "300px"
      },
      height: '100%',
      boxSizing: 'border-box',
      backgroundColor: (theme) => theme.palette.background.default,
      display: 'flex'
    }}>
      <CssBaseline/>
      <TopBar sidebarOpen={sideBarOpen} onOpenSidebar={handleOpenSidebar}/>
      <Sidebar open={sideBarOpen} onClose={() => setSideBarOpen(false)}/>
      <Box component={"main"} sx={{
        padding: "32px",
        minHeight: '100%',
        boxSizing: 'border-box',
        width: '100%',
        backgroundColor: (theme) => theme.palette.background.default
      }}>
        {props.children}
      </Box>
    </Box>
  );
};

export default MainLayout;