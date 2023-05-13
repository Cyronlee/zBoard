import React, {
  FC,
  ReactElement,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMemoizedFn } from 'ahooks';
import styled from '@emotion/styled';

function getMouseOffset(event: MouseEvent, target?: HTMLElement) {
  const bounds = (target || (event.target as HTMLElement)).getBoundingClientRect();
  return {
    x: event.clientX - bounds.x,
    y: event.clientY - bounds.y,
  };
}

const bound = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const mutateLayout = ({
  container,
  rows,
  cols,
  columnGap = 0,
  rowGap = 0,
  padding = 0,
  layout,
  offset,
  type,
}: {
  container: HTMLElement;
  rows: number;
  cols: number;
  columnGap?: number;
  rowGap?: number;
  padding?: number;
  layout: {
    x: number;
    y: number;
    w: number;
    minW?: number;
    maxW?: number;
    h: number;
    minH?: number;
    maxH?: number;
  };
  offset: {
    x: number;
    y: number;
  };
  type: 'move' | 'resize';
}) => {
  const containerBounds = container.getBoundingClientRect();
  const clientSpanWidth = (containerBounds.width - padding * 2 - columnGap * (cols - 1)) / cols;
  const clientSpanHeight = (containerBounds.height - padding * 2 - rowGap * (rows - 1)) / rows;

  const getColSpan = (offsetX: number) =>
    Math.round((offsetX + columnGap) / (clientSpanWidth + columnGap));
  const getDistanceByColSpan = (colSpan: number) =>
    colSpan * clientSpanWidth + (colSpan - 1) * columnGap;
  const getOffsetByColSpan = (colSpan: number) => colSpan * clientSpanWidth + colSpan * columnGap;
  const getRowSpan = (offsetY: number) =>
    Math.round((offsetY + rowGap) / (clientSpanHeight + rowGap));
  const getDistanceByRowSpan = (rowSpan: number) =>
    rowSpan * clientSpanHeight + (rowSpan - 1) * rowGap;
  const getOffsetByRowSpan = (rowSpan: number) => rowSpan * clientSpanHeight + rowSpan * rowGap;

  if (type === 'move') {
    const boundOffsetX = bound(
      offset.x,
      getOffsetByColSpan(-layout.x),
      getOffsetByColSpan(cols - (layout.x + layout.w))
    );
    const offsetXSpan = getColSpan(boundOffsetX);
    const nextLayoutX = layout.x + offsetXSpan;

    const boundOffsetY = bound(
      offset.y,
      getOffsetByRowSpan(-layout.y),
      getOffsetByRowSpan(rows - (layout.y + layout.h))
    );
    const offsetYSpan = getRowSpan(boundOffsetY);
    const nextLayoutY = layout.y + offsetYSpan;

    return {
      x: nextLayoutX,
      y: nextLayoutY,
      w: layout.w,
      h: layout.h,
      boundingRect: {
        left: getOffsetByColSpan(layout.x) + boundOffsetX + padding,
        top: getOffsetByRowSpan(layout.y) + boundOffsetY + padding,
        width: getDistanceByColSpan(layout.w),
        height: getDistanceByRowSpan(layout.h),
      },
    };
  }

  const boundOffsetW = bound(
    offset.x,
    getDistanceByColSpan(Math.max(1, layout.minW || 1) - layout.w),
    getDistanceByColSpan(Math.min(cols - (layout.x + layout.w), (layout.maxW || cols) - layout.w))
  );
  const offsetWSpan = getColSpan(boundOffsetW);
  const nextLayoutW = layout.w + offsetWSpan;

  const boundOffsetH = bound(
    offset.y,
    getDistanceByRowSpan(Math.max(1, layout.minH || 1) - layout.h),
    getDistanceByRowSpan(Math.min(rows - (layout.y + layout.h), (layout.maxH || rows) - layout.h))
  );
  const offsetHSpan = getRowSpan(boundOffsetH);
  const nextLayoutH = layout.h + offsetHSpan;

  return {
    x: layout.x,
    y: layout.y,
    w: nextLayoutW,
    h: nextLayoutH,
    boundingRect: {
      left: getOffsetByColSpan(layout.x) + padding,
      top: getOffsetByRowSpan(layout.y) + padding,
      width: getDistanceByColSpan(layout.w) + boundOffsetW,
      height: getDistanceByRowSpan(layout.h) + boundOffsetH,
    },
  };
};

type TransferData = {
  layout: {
    w: number;
    h: number;
  };
  component: string;
  [key: string]: any;
};

interface ItemContext {
  data: TransferData;
  element: HTMLElement;
  mouseOffset: {
    x: number;
    y: number;
  };
}

export const DragDropContext = createContext({
  draggingItem: null as null | string,
  setDraggingItem: (() => {}) as Dispatch<SetStateAction<string | null>>,
  setContext: (() => {}) as (id: string, itemContext: ItemContext) => void,
  getContext: (() => {}) as unknown as (id: string) => ItemContext,
  removeContext: (() => {}) as (id: string) => void,
});

export const DragAndDropProvider: FC<PropsWithChildren> = ({ children }) => {
  const [draggingItem, setDraggingItem] = useState<null | string>(null);
  const contextsRef = useRef<Record<string, any>>({});

  const contextValue = useMemo(
    () => ({
      draggingItem,
      setDraggingItem,
      setContext(id: string, data: any) {
        contextsRef.current[id] = data;
      },
      getContext(id: string) {
        return contextsRef.current[id];
      },
      removeContext(id: string) {
        delete contextsRef.current[id];
      },
    }),
    [draggingItem]
  );

  return <DragDropContext.Provider value={contextValue}>{children}</DragDropContext.Provider>;
};

interface DraggableProps<T = {}> {
  dropData?: {
    layout: { w: number; h: number; minW?: number; maxW?: number; minH?: number; maxH?: number };
    component: string;
  } & T;
}

export const Draggable: FC<{ children: JSX.Element } & DraggableProps> = ({
  children,
  dropData,
}) => {
  const { setContext, removeContext, setDraggingItem, draggingItem } = useContext(DragDropContext);
  const id = useId();
  const mouseOffsetRef = useRef({
    x: 0,
    y: 0,
  });
  const mouseDownPosition = useRef<null | { clientX: number; clientY: number }>(null);

  return cloneElement<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>>(
    children,
    {
      ...children.props,
      style: {
        ...children.props.style,
        cursor: 'move',
      },
      draggable: true,
      onMouseDown(e) {
        mouseOffsetRef.current = getMouseOffset(e as any);
        mouseDownPosition.current = {
          clientX: e.clientX,
          clientY: e.clientY,
        };
      },
      onDragStart(e) {
        // this is a hack for firefox
        // Firefox requires some kind of initialization
        // which we can do by adding this attribute
        // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
        e.dataTransfer.setData('text/plain', '');

        e.dataTransfer.effectAllowed = 'move';
        setDraggingItem(id);
        setContext(id, {
          data: dropData!,
          element: e.target as HTMLElement,
          mouseOffset: mouseOffsetRef.current,
        });
      },
      onDragEnd() {
        if (draggingItem === id) {
          setDraggingItem(null);
        }
        removeContext(id);
      },
    }
  );
};

interface LayoutItemComponentProps {
  layout: Layout;
  render: (layout: Layout) => ReactElement;
  draggable?: boolean;
  resizable?: boolean;
  onLayoutChange?: (newLayout: Layout) => void;
  onLayoutChangeEnd?: (newLayout: Layout) => void;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}

const LayoutWrapper = styled('div', {
  shouldForwardProp: (propName) => !['draggable', 'layout'].includes(propName),
})<{
  layout: Layout;
  draggable: boolean;
  selected?: boolean;
}>`
  position: relative;
  grid-area: ${({ layout }) =>
    `${layout.y + 1}/${layout.x + 1}/${layout.y + layout.h + 1}/${layout.x + layout.w + 1}`};
  cursor: ${({ draggable, selected }) => (draggable && selected ? 'move' : 'inherit')};
  // ${({ selected }) => selected && 'filter: drop-shadow(#0bc5ea 0px 0px 1px);'};
  ${({ selected }) => selected && 'box-shadow: 1px 1px 1px #0bc5ea, -1px -1px 1px #0bc5ea;'};
`;

const ResizeHandle = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
  border: 0px solid black;
  border-right-width: 5px;
  border-bottom-width: 5px;
  width: 15px;
  height: 15px;
  cursor: se-resize;
`;

const DroppingShadow = styled.div`
  transition: 200ms;
  grid-area: 1/1 / auto/auto;
  background: linear-gradient(to left, #7928ca, #ff0080);
  opacity: 0.1;
  display: none;
`;

const LayoutItemComponent: FC<LayoutItemComponentProps> = ({
  layout,
  render,
  draggable = false,
  resizable = false,
  onLayoutChange,
  onLayoutChangeEnd,
  selected,
  onSelectedChange,
}) => {
  const { getContainer, cols, rows, columnGap, rowGap, padding } = useContext(GridLayoutContext);
  const elRef = useRef<HTMLDivElement>(null);
  const element = render(layout);
  const mouseDownMetaRef = useRef<null | {
    clientX: number;
    clientY: number;
    type: 'move' | 'resize';
  }>(null);

  const draggableProps = draggable
    ? {
        onMouseDown(e: React.MouseEvent) {
          e.stopPropagation();
          if (!selected) return;
          mouseDownMetaRef.current = {
            clientX: e.clientX,
            clientY: e.clientY,
            type: 'move',
          };
        },
      }
    : null;

  const getNewLayoutByOffset = useMemoizedFn(
    (
      offset: {
        x: number;
        y: number;
      },
      type: 'move' | 'resize'
    ) => {
      return mutateLayout({
        container: getContainer()!,
        rows,
        cols,
        columnGap,
        rowGap,
        padding,
        layout,
        offset,
        type,
      });
    }
  );

  useEffect(() => {
    if (!draggable && !resizable) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      if (!mouseDownMetaRef.current) return;

      const { clientX, clientY, type } = mouseDownMetaRef.current;
      const { x, y, w, h, boundingRect } = getNewLayoutByOffset(
        {
          x: e.clientX - clientX,
          y: e.clientY - clientY,
        },
        type
      );

      Object.assign(elRef.current!.style, {
        position: 'absolute',
        width: `${boundingRect.width}px`,
        height: `${boundingRect.height}px`,
        left: `${boundingRect.left}px`,
        top: `${boundingRect.top}px`,
        gridArea: 'auto',
      });
      onLayoutChange?.({
        ...layout,
        x,
        y,
        w,
        h,
      });
    };
    const handleMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      if (!mouseDownMetaRef.current) return;

      const { clientX, clientY, type } = mouseDownMetaRef.current;
      const { x, y, w, h } = getNewLayoutByOffset(
        {
          x: e.clientX - clientX,
          y: e.clientY - clientY,
        },
        type
      );

      Object.assign(elRef.current!.style, {
        position: 'relative',
        width: 'auto',
        height: 'auto',
        left: 'auto',
        top: 'auto',
        gridArea: `${y + 1}/${x + 1}/${y + h + 1}/${x + w + 1}`,
      });
      onLayoutChangeEnd?.({
        ...layout,
        x,
        y,
        w,
        h,
      });
      mouseDownMetaRef.current = null;
    };

    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseup', handleMouseUp);
    };
  }, [layout, draggable, resizable, onLayoutChange, onLayoutChangeEnd, getNewLayoutByOffset]);

  return (
    <LayoutWrapper
      key={layout.id}
      ref={elRef}
      layout={layout}
      draggable={draggable}
      selected={selected}
      {...draggableProps}
      onClick={(e) => {
        e.stopPropagation();
        if (!draggable && !resizable) return;
        if (!selected) onSelectedChange?.(true);
      }}
    >
      {element}
      {resizable && selected && (
        // TODO: adjust styles and allow custom resizeHandle
        <ResizeHandle
          draggable={false}
          onMouseDown={(e) => {
            e.stopPropagation();

            mouseDownMetaRef.current = {
              clientX: e.clientX,
              clientY: e.clientY,
              type: 'resize',
            };
          }}
        />
      )}
    </LayoutWrapper>
  );
};

export interface Layout {
  component: string;
  id: string;
  x: number;
  y: number;
  w: number;
  minW?: number;
  maxW?: number;
  h: number;
  minH?: number;
  maxH?: number;
}

const GridLayoutContext = createContext({
  layouts: [] as Layout[],
  padding: 0,
  cols: 12,
  rows: 12,
  columnGap: 0,
  rowGap: 0,
  getContainer: (() => null) as () => HTMLElement | null,
});

interface GridLayoutProps {
  fullPage?: boolean;
  cols: number;
  rows: number;
  padding?: number;
  columnGap?: number;
  rowGap?: number;
  itemRender: (layout: Layout) => ReactElement;
  droppable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  layouts: Layout[];
  onLayoutsChange?: (newLayouts: Layout[]) => void;
  style?: React.CSSProperties;
}

export const GridLayout: FC<GridLayoutProps> = ({
  cols,
  rows,
  columnGap = 0,
  rowGap = 0,
  padding = 0,
  itemRender,
  fullPage = false,
  droppable = false,
  draggable = false,
  resizable = false,
  layouts,
  onLayoutsChange,
  style,
}) => {
  const { getContext, draggingItem } = useContext(DragDropContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const [dropping, setDropping] = useState(false);
  const dropPositionRef = useRef({
    x: 0,
    y: 0,
  });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const showShadow = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => {
    if (!shadowRef.current) return;

    Object.assign(shadowRef.current.style, {
      display: 'block',
      gridArea: `${y + 1}/${x + 1}/${y + h + 1}/${x + w + 1}`,
    });
  };
  const hideShadow = () => {
    if (!shadowRef.current) return;

    Object.assign(shadowRef.current.style, {
      display: 'none',
    });
  };

  const droppableProps = droppable
    ? {
        onDragEnter: (e: React.DragEvent<HTMLElement>) => {
          e.preventDefault();
        },
        onDragOver: (e: React.DragEvent<HTMLElement>) => {
          e.preventDefault();
          if (!dropping) setDropping(true);
          e.dataTransfer.dropEffect = 'move';

          if (!draggingItem) return;
          const { data, mouseOffset } = getContext(draggingItem!);
          const dropZoneMouseOffset = getMouseOffset(e as any, containerRef.current!);

          const { x, y, w, h } = mutateLayout({
            container: containerRef.current!,
            rows,
            cols,
            rowGap,
            columnGap,
            layout: {
              ...data.layout,
              x: 0,
              y: 0,
            },
            offset: {
              x: dropZoneMouseOffset.x - mouseOffset.x,
              y: dropZoneMouseOffset.y - mouseOffset.y,
            },
            type: 'move',
          });

          dropPositionRef.current.x = x;
          dropPositionRef.current.y = y;

          showShadow({
            x,
            y,
            w,
            h,
          });
        },
        onDragLeave: (e: React.DragEvent<HTMLElement>) => {
          if (e.relatedTarget === shadowRef.current) return;

          hideShadow();
        },
        onDrop: (e: React.DragEvent<HTMLElement>) => {
          e.preventDefault();
          setDropping(false);

          if (!draggingItem) return;
          const { data } = getContext(draggingItem);
          onLayoutsChange?.([
            ...layouts,
            {
              id: `${data.component}-${Math.random()}`, // TODO: need redesign the computation?
              component: data.component,
              ...data.layout,
              ...dropPositionRef.current,
            },
          ]);
          hideShadow();

          dropPositionRef.current.x = 0;
          dropPositionRef.current.y = 0;
        },
      }
    : null;

  const removeSelectedItem = useMemoizedFn(() => {
    if (!selectedItem) return;

    onLayoutsChange?.(layouts.filter((layout) => layout.id !== selectedItem));
    setSelectedItem(null);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Backspace') {
        removeSelectedItem();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <GridLayoutContext.Provider
      value={{
        layouts,
        cols,
        rows,
        columnGap,
        rowGap,
        padding,
        getContainer: () => containerRef.current,
      }}
    >
      <div
        style={{
          ...(fullPage ? { width: '100vw', height: '100vh' } : { width: '100%', height: '100%' }),
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridGap: `${rowGap}px ${columnGap}px`,
          position: 'relative',
          padding,
          ...style,
        }}
        {...droppableProps}
        ref={containerRef}
        onClick={() => {
          setSelectedItem(null);
        }}
      >
        {layouts.map((layout) => (
          <LayoutItemComponent
            key={layout.id}
            layout={layout}
            render={itemRender}
            draggable={draggable}
            resizable={resizable}
            onLayoutChange={({ x, y, w, h }) => {
              showShadow({
                x,
                y,
                w,
                h,
              });
              document.body.style.userSelect = 'none';
            }}
            onLayoutChangeEnd={(newLayout) => {
              hideShadow();
              onLayoutsChange?.(
                layouts.map((layout) => (layout.id === newLayout.id ? newLayout : layout))
              );
              document.body.style.userSelect = 'auto';
            }}
            selected={selectedItem === layout.id}
            onSelectedChange={(selected) => {
              if (selected) return setSelectedItem(layout.id);

              setSelectedItem(null);
            }}
          />
        ))}
        <DroppingShadow ref={shadowRef} />
      </div>
    </GridLayoutContext.Provider>
  );
};
