import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { buildPageBreadcrumbs } from '@/shared/components/page/buildPageBreadcrumbs';
import { matchPageBreadcrumbs } from '@/shared/components/page/matchPageBreadcrumbs';

export function PageBreadcrumbs() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pathname } = useLocation();
  const p = theme.palette.produza;

  const items = useMemo(
    () => buildPageBreadcrumbs(matchPageBreadcrumbs(pathname)),
    [pathname]
  );

  return (
    <Breadcrumbs
      aria-label={t('layout.breadcrumbs.ariaLabel')}
      maxItems={3}
      itemsBeforeCollapse={0}
      separator={
        <NavigateNextIcon sx={{ fontSize: 16, color: p.onSurfaceVariant }} />
      }
      sx={{
        mb: 0,
        '& .MuiBreadcrumbs-ol': { flexWrap: 'wrap', rowGap: 0.5 },
        '& .MuiBreadcrumbs-separator': { mx: 0.5 },
      }}
    >
      {items.map((item) => {
        const label = t(item.labelKey);
        if (item.to == null) {
          return (
            <Typography
              key={`${item.labelKey}-current`}
              component="span"
              aria-current="page"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: p.onSurface,
                lineHeight: 1.4,
              }}
            >
              {label}
            </Typography>
          );
        }

        return (
          <Link
            key={`${item.labelKey}-${item.to}`}
            component={RouterLink}
            to={item.to}
            underline="hover"
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: p.onSurfaceVariant,
              lineHeight: 1.4,
            }}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
