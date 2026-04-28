import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function AppFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        py: 1,
        px: 2,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {t('layout.footer.copyright', { year })}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {t('layout.footer.version', { version: '0.0.0' })}
      </Typography>
    </Box>
  );
}
