import { Typography, Box, Divider } from '@mui/material';

interface SectionDividerProps {
  data: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = (props) => {
  return (
    <Box paddingBottom={2} paddingTop={2}>
      <Typography variant='h5'>{props.data}</Typography>
      <Divider />
    </Box>
  );
};
