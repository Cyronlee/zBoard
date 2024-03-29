import { FC, ComponentProps, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { GridLayout } from '@/components/GridLayout';
import { usePageConfigStore } from '@/stores/pageConfig';
import { zBoardComponents } from '@/data/zBoardComponents';

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
        const { Component } = zBoardComponents.find(({ name }) => name === component)!;
        return <Component w="100%" h="100%" />;
      }}
    />
    // </Container>
  );
};

export default DashboardPreview;
