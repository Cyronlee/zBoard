import { extendTheme } from '@chakra-ui/react';

import { colors } from './colors';
import { config } from './config';

const customTheme = extendTheme({
  colors,
  config,
});

export default customTheme;
