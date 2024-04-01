import React, { useEffect } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import {
  Button,
  IconButton,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  List,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useToast,
} from '@chakra-ui/react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import omit from 'lodash/omit';
import { DragAndDropProvider, Draggable, GridLayout } from '@/components/GridLayout';
import { GrConfigure } from 'react-icons/gr';
import { PageConfigState, usePageConfigStore } from '@/stores/pageConfig';
import { getPageConfig } from './api/page_config';
import { ArrowBackIcon, SettingsIcon } from '@chakra-ui/icons';

import { useRouter } from 'next/router';
import { zBoardComponents } from '@/data/zBoardComponents';

const ComponentItem = styled.div`
  /* TODO: adjust styles */
  margin-bottom: 10px;
  border-radius: 14px;
  padding: 8px;
  background: #f3f3f3;
`;
const HEADER_HEIGHT = 60;
const Header = styled.header`
  height: ${HEADER_HEIGHT}px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 30px;
`;

const Container = styled.div`
  display: flex;
  height: calc(100vh - ${HEADER_HEIGHT}px);
`;
const LeftAside = styled.aside`
  flex: none;
  width: 250px;
  border-right: 1px solid #eee;
  padding: 10px;
  overflow: auto;
`;
const Main = styled.main`
  flex: 1;
`;
const RightAside = styled.aside`
  flex: none;
  width: 250px;
  border-left: 1px solid #eee;
  overflow: auto;
`;

export const getServerSideProps: GetServerSideProps<{
  pageConfigFromServer: Partial<PageConfigState['pageConfig']> & { version: number };
}> = async () => {
  return {
    props: {
      pageConfigFromServer: await getPageConfig(),
    },
  };
};

export default function Builder({
  pageConfigFromServer,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const toast = useToast();
  const router = useRouter();
  const { pageConfig, setPageConfig, setVersion } = usePageConfigStore();

  useEffect(() => {
    usePageConfigStore.persist.rehydrate();
    const { version } = usePageConfigStore.getState();

    if (pageConfigFromServer.version && pageConfigFromServer.version > version) {
      setVersion(pageConfigFromServer.version);
      setPageConfig(omit(pageConfigFromServer, 'version'));
    }
  }, []);

  const getConfig = async () => {
    const res = await fetch('/api/page_config');
    return await res.json();
  };

  const publish = async () => {
    await fetch('/api/page_config', {
      method: 'POST',
      body: JSON.stringify(pageConfig),
    });

    const { version: newVersion } = await getConfig();
    setVersion(newVersion);
    toast({
      title: 'Publish successfully!',
      status: 'success',
      duration: 3000,
      position: 'top',
    });

    router.push('/');
  };

  const LayoutSettings = () => (
    <Popover>
      <PopoverTrigger>
        <IconButton aria-label="Layout Settings" icon={<SettingsIcon />} />
        {/*<Button size="sm" ml="10px" flex="none">*/}
        {/*  <GrConfigure style={{ fontSize: 18 }}></GrConfigure>*/}
        {/*</Button>*/}
      </PopoverTrigger>
      <PopoverContent minWidth="240px" width="240px">
        <PopoverBody>
          <List spacing="10px">
            <ListItem>
              <InputGroup size="sm">
                <InputLeftAddon borderLeftRadius="md" width="80px">
                  rows
                </InputLeftAddon>
                <NumberInput
                  borderRadius="md"
                  min={1}
                  value={pageConfig.rows}
                  onChange={(_, rows) => setPageConfig({ rows })}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup size="sm" flex="none">
                <InputLeftAddon borderLeftRadius="md" width="80px">
                  cols
                </InputLeftAddon>
                <NumberInput
                  borderRadius="md"
                  min={1}
                  value={pageConfig.cols}
                  onChange={(_, cols) => setPageConfig({ cols })}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            </ListItem>
            <ListItem>
              <InputGroup size="sm" flex="none">
                <InputLeftAddon borderLeftRadius="md" width="80px">
                  rowGap
                </InputLeftAddon>
                <NumberInput
                  borderRadius="md"
                  min={0}
                  value={pageConfig.rowGap || 0}
                  onChange={(_, rowGap) => setPageConfig({ rowGap })}
                >
                  <NumberInputField />
                </NumberInput>
                <InputRightAddon>px</InputRightAddon>
              </InputGroup>
            </ListItem>
            <ListItem unselectable="on">
              <InputGroup size="sm" flex="none">
                <InputLeftAddon borderLeftRadius="md" width="80px">
                  colGap
                </InputLeftAddon>
                <NumberInput
                  borderRadius="md"
                  min={0}
                  value={pageConfig.columnGap || 0}
                  onChange={(_, columnGap) => setPageConfig({ columnGap })}
                >
                  <NumberInputField />
                </NumberInput>
                <InputRightAddon>px</InputRightAddon>
              </InputGroup>
            </ListItem>
            <ListItem unselectable="on">
              <InputGroup size="sm" flex="none">
                <InputLeftAddon borderLeftRadius="md" width="80px">
                  padding
                </InputLeftAddon>
                <NumberInput
                  borderRadius="md"
                  min={0}
                  value={pageConfig.padding || 0}
                  onChange={(_, padding) => setPageConfig({ padding })}
                >
                  <NumberInputField />
                </NumberInput>
                <InputRightAddon>px</InputRightAddon>
              </InputGroup>
            </ListItem>
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );

  const unusedComponents = zBoardComponents.filter(
    (component) => !pageConfig.layouts.some((layout) => layout.component === component.name)
  );

  return (
    <DragAndDropProvider>
      <div>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton
              aria-label="Back"
              icon={<ArrowBackIcon />}
              onClick={() => router.push('/')}
            />
            <Text fontSize="xl" fontWeight="bold">
              Customize homepage
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutSettings />
            {/*<Button size="md" title="Preview" onClick={() => window.open('/preview')}>*/}
            {/*  Preview*/}
            {/*</Button>*/}
            <Button size="md" title="Publish" colorScheme="blue" onClick={publish}>
              Publish
            </Button>
          </div>
        </Header>
        <Container>
          <LeftAside id="components">
            {unusedComponents.length === 0 ? (
              <Text>No more component here...</Text>
            ) : (
              unusedComponents.map(({ name, preview, layout }) => {
                return (
                  <Draggable
                    key={name}
                    dropData={{
                      component: name,
                      layout,
                    }}
                  >
                    <ComponentItem>
                      <Text>{name}</Text>
                      <Image src={preview} alt="ProjectTimeline preview" draggable={false} />
                    </ComponentItem>
                  </Draggable>
                );
              })
            )}
          </LeftAside>
          <Main>
            <GridLayout
              cols={pageConfig.cols}
              rows={pageConfig.rows}
              layouts={pageConfig.layouts}
              onLayoutsChange={(layouts) => setPageConfig({ layouts })}
              itemRender={({ component }) => {
                const { Component } = zBoardComponents.find(({ name }) => name === component)!;
                return <Component w="100%" h="100%" />;
              }}
              rowGap={pageConfig.rowGap}
              columnGap={pageConfig.columnGap}
              padding={pageConfig.padding}
              droppable
              draggable
              resizable
            />
          </Main>
          {/*TODO*/}
          {/*<RightAside id="widget-config"></RightAside>*/}
        </Container>
      </div>
    </DragAndDropProvider>
  );
}
