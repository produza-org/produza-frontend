import type { ReactNode } from 'react';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import {
  DrawerCloseButton,
  DrawerDeleteButton,
  DrawerEditButton,
  DrawerEyebrow,
  DrawerFooter,
  DrawerFooterActions,
  DrawerHairline,
  DrawerScrollArea,
  DrawerStatBlock,
  DrawerStatBlockEnd,
  DrawerStatLabel,
  DrawerStatValue,
  DrawerStatValueCompact,
  DrawerStatsCard,
  DrawerTitle,
  StyledDetailDrawer,
} from './EntityDetailDrawer.styled';

export type DrawerStat = {
  id: string;
  label: string;
  value: ReactNode;
  compact?: boolean;
};

export type EntityDetailDrawerProps = {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  closeAriaLabel: string;
  stats?: DrawerStat[];
  children?: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
};

export function EntityDetailDrawer({
  open,
  onClose,
  eyebrow,
  title,
  closeAriaLabel,
  stats = [],
  children,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: EntityDetailDrawerProps) {
  const visibleStats = stats.slice(0, 2);
  const hasStats = visibleStats.length > 0;
  const hasFooter = Boolean(onEdit || onDelete);

  return (
    <StyledDetailDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: false,
      }}
      slotProps={{
        backdrop: {
          onClick: onClose,
        },
      }}
    >
      <DrawerCloseButton aria-label={closeAriaLabel} onClick={onClose} size="small">
        <CloseOutlined fontSize="small" />
      </DrawerCloseButton>

      <DrawerScrollArea>
        <DrawerEyebrow component="span">{eyebrow}</DrawerEyebrow>
        <DrawerTitle component="h2">{title}</DrawerTitle>

        {hasStats ? (
          <DrawerStatsCard>
            {visibleStats.map((stat, index) => {
              const Block = index === 0 ? DrawerStatBlock : DrawerStatBlockEnd;
              const Value = stat.compact ? DrawerStatValueCompact : DrawerStatValue;
              return (
                <Block key={stat.id}>
                  <DrawerStatLabel>{stat.label}</DrawerStatLabel>
                  <Value component="div">{stat.value}</Value>
                </Block>
              );
            })}
          </DrawerStatsCard>
        ) : null}

        {hasStats ? <DrawerHairline /> : null}

        {children}
      </DrawerScrollArea>

      {hasFooter ? (
        <DrawerFooter>
          <DrawerFooterActions
            sx={{
              gridTemplateColumns:
                onEdit && onDelete ? '1fr 1fr' : '1fr',
            }}
          >
            {onEdit && editLabel ? (
              <DrawerEditButton
                variant="contained"
                disableElevation
                startIcon={<EditOutlined sx={{ fontSize: '1.1rem' }} />}
                onClick={onEdit}
              >
                {editLabel}
              </DrawerEditButton>
            ) : null}
            {onDelete && deleteLabel ? (
              <DrawerDeleteButton
                variant="outlined"
                startIcon={<DeleteOutlined sx={{ fontSize: '1.1rem' }} />}
                onClick={onDelete}
              >
                {deleteLabel}
              </DrawerDeleteButton>
            ) : null}
          </DrawerFooterActions>
        </DrawerFooter>
      ) : null}
    </StyledDetailDrawer>
  );
}
