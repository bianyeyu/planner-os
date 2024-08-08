import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Switch, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme as useMuiTheme,
} from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import LanguageIcon from '@mui/icons-material/Language';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { mode, setMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [selectedSetting, setSelectedSetting] = useState('personal');
  const muiTheme = useMuiTheme();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.value as 'light' | 'dark' | 'system');
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  const renderSettingContent = () => {
    switch (selectedSetting) {
      case 'personal':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>{t('settings.personalInfo')}</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }}>{t('settings.username')}</Typography>
              <TextField
                fullWidth
                variant="outlined"
                defaultValue="当前用户名"
                sx={{ maxWidth: 400 }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ mb: 1 }}>{t('settings.email')}</Typography>
              <TextField
                fullWidth
                variant="outlined"
                defaultValue="user@example.com"
                sx={{ maxWidth: 400 }}
              />
            </Box>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: muiTheme.palette.primary.main,
                color: muiTheme.palette.primary.contrastText,
                '&:hover': { bgcolor: muiTheme.palette.primary.dark },
                borderRadius: '20px',
                mb: 4
              }}
            >
              {t('settings.changePassword')}
            </Button>
          </Box>
        );
      case 'notifications':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>{t('settings.notifications')}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography>{t('settings.emailNotifications')}</Typography>
              <Switch defaultChecked />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography>{t('settings.inAppNotifications')}</Typography>
              <Switch defaultChecked />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography>{t('settings.pushNotifications')}</Typography>
              <Switch />
            </Box>
          </Box>
        );
      case 'theme':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>{t('settings.themeSettings')}</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="theme"
                name="theme"
                value={mode}
                onChange={handleModeChange}
              >
                <FormControlLabel value="dark" control={<Radio />} label={t('settings.darkMode')} />
                <FormControlLabel value="light" control={<Radio />} label={t('settings.lightMode')} />
                <FormControlLabel value="system" control={<Radio />} label={t('settings.systemMode')} />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 'language':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>{t('settings.languageSettings')}</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="language"
                name="language"
                value={language}
                onChange={handleLanguageChange}
              >
                <FormControlLabel value="zh" control={<Radio />} label={t('settings.chinese')} />
                <FormControlLabel value="en" control={<Radio />} label={t('settings.english')} />
              </RadioGroup>
            </FormControl>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', bgcolor: muiTheme.palette.background.default, color: muiTheme.palette.text.primary }}>
      <Box sx={{ width: 200, borderRight: `1px solid ${muiTheme.palette.divider}`, pr: 2 }}>
        <List>
          {[
            { id: 'personal', icon: <PersonIcon />, text: t('settings.personalInfo') },
            { id: 'notifications', icon: <NotificationsIcon />, text: t('settings.notifications') },
            { id: 'theme', icon: <PaletteIcon />, text: t('settings.themeSettings') },
            { id: 'language', icon: <LanguageIcon />, text: t('settings.languageSettings') },
          ].map((item) => (
            <ListItem
              button
              key={item.id}
              selected={selectedSetting === item.id}
              onClick={() => setSelectedSetting(item.id)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ flex: 1, p: 3, bgcolor: muiTheme.palette.background.paper }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>{t('settings.title')}</Typography>
        {renderSettingContent()}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: muiTheme.palette.primary.main, 
              color: muiTheme.palette.primary.contrastText, 
              '&:hover': { bgcolor: muiTheme.palette.primary.dark },
              borderRadius: '25px',
              px: 4,
              py: 1.5
            }}
          >
            {t('settings.saveChanges')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;