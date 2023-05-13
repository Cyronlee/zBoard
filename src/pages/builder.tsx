import { ComponentType, FC, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { GridLayout, DragAndDropProvider, Draggable, Layout } from '@/components/GridLayout';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProjectTimelinePreview from '@/components/ProjectTimeline.preview.png';

const COMPONENTS: Record<
  string,
  {
    Component: ComponentType;
    preview: StaticImageData;
  }
> = {
  ProjectTimeline: {
    Component: ProjectTimeline,
    preview: ProjectTimelinePreview,
  },
};

const PageContainer: FC = () => {
  const [layouts, setLayouts] = useState<Layout[]>(() => []);

  return (
    <DragAndDropProvider>
      <div>
        <header style={{ height: 60, borderBottom: '1px solid #eee' }}></header>
        <div style={{ display: 'flex', height: `calc(100vh - 60px)` }}>
          {/* TODO: adjust styles */}
          <aside
            id="components"
            style={{ flex: 'none', width: 250, borderRight: '1px solid #eee', padding: 10 }}
          >
            <Draggable
              dropData={{
                templateId: 'ProjectTimeline',
                layout: {
                  w: 8,
                  minW: 2,
                  maxW: 10,
                  h: 7,
                  minH: 2,
                  maxH: 9,
                },
              }}
            >
              {/* TODO: adjust styles */}
              <div
                style={{
                  background: '#f3f3f3',
                  borderRadius: 14,
                  padding: 8,
                }}
              >
                <Image
                  src={ProjectTimelinePreview}
                  alt="ProjectTimeline preview"
                  draggable={false}
                />
              </div>
            </Draggable>
          </aside>
          <main style={{ flex: 1 }}>
            <GridLayout
              cols={12}
              rows={12}
              layouts={layouts}
              onLayoutsChange={(newLayouts) => setLayouts(newLayouts)}
              itemRender={(layout) => {
                const { Component } = COMPONENTS[layout.templateId];
                return <Component />;
              }}
              droppable
              draggable
              resizable
            />
          </main>
          <aside
            id="widget-config"
            // TODO: adjust styles
            style={{ flex: 'none', width: 250, borderLeft: '1px solid #eee' }}
          ></aside>
        </div>
      </div>
    </DragAndDropProvider>
  );
};

export default PageContainer