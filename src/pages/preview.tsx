import { FC } from 'react';
import styled from '@emotion/styled';
import DashboardPreview from '@/components/DashboardPreview';

const FullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;
// @deprecated
const Preview: FC = () => {
  return (
    <FullScreenContainer>
      <DashboardPreview />
    </FullScreenContainer>
  );
};

export default Preview;
