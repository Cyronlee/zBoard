import { FC, ComponentProps, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { GridLayout } from '@/components/GridLayout';
import { usePageConfigStore } from '@/stores/pageConfig';
import { zBoardWidgets } from '@/widgets';
import { Box } from '@chakra-ui/react';
import GrayBox from '@/components/ui/GrayBox';

const Container = styled.div`
  width: 100vw;
  height: 100%;
`;

const DashboardPreview: FC = () => {
  const {
    pageConfig: { rows, cols, rowGap, columnGap, layouts, padding },
  } = usePageConfigStore();

  useEffect(() => {
    usePageConfigStore.persist.rehydrate();
  }, []);

  return (
    // <Container>
    <GridLayout
      rows={rows}
      cols={cols}
      rowGap={rowGap}
      columnGap={columnGap}
      padding={padding}
      layouts={layouts}
      itemRender={({ component }) => {
        const widget = zBoardWidgets.find(({ name }) => name === component);
        return widget ? (
          <widget.Component w="100%" h="100%" />
        ) : (
          <GrayBox>{component} Widget Not found</GrayBox>
        );
      }}
    />
    // </Container>
  );
};

export default DashboardPreview;
