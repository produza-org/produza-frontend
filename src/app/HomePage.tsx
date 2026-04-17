import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useLanguage, type AppLanguage } from '@/contexts/LanguageContext';

export function HomePage() {
  const { t } = useTranslation();
  const { mode, toggleTheme } = useThemeMode();
  const { language, setLanguage } = useLanguage();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('app.title')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Button variant="contained" onClick={toggleTheme}>
          {mode === 'light' ? t('theme.dark') : t('theme.light')}
        </Button>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel id="language-label">{t('language.label')}</InputLabel>
          <Select
            labelId="language-label"
            value={language}
            label={t('language.label')}
            onChange={(e) => setLanguage(e.target.value as AppLanguage)}
          >
            <MenuItem value="pt">{t('language.pt')}</MenuItem>
            <MenuItem value="en">{t('language.en')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
