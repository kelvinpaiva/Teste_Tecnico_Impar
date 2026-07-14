import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const drawerWidth = 260;

const menuItems = [
  { to: '/', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
  { to: '/vehicles', label: 'Veículos', icon: <DirectionsCarFilledOutlinedIcon /> },
  { to: '/customers', label: 'Clientes', icon: <PeopleOutlinedIcon /> },
  { to: '/opportunities', label: 'Oportunidades', icon: <HandshakeOutlinedIcon /> },
];

export function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Typography variant="h6" color="primary">
          CarSales CRM
        </Typography>
      </Toolbar>
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.active': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': { color: 'inherit' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          {isMobile ? (
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant="subtitle1" color="text.secondary">
            CRM de venda de carros
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 1,
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          p: { xs: 2, md: 3 },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
