import React, {
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
import type { FC, ReactElement } from 'react';

function getMouseOffset(event: MouseEvent, target?: HTMLElement) {
  const bounds = (target || (event.target as HTMLElement)).getBoundingClientRect();
  return {
    x: event.clientX - bounds.x,
    y: event.clientY - bounds.y,
  };
}

const bound = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type TransferData = {
  layout: {
    w: number;
    h: number;
  };
  templateId: string
} & Record<string, any>;

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
    templateId: string
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
}

const LayoutItemComponent: FC<LayoutItemComponentProps> = ({
  layout,
  render,
  draggable = false,
  resizable = false,
  onLayoutChange,
  onLayoutChangeEnd,
}) => {
  const { getContainer, cols, rows } = useContext(GridLayoutContext);
  const elRef = useRef<HTMLDivElement>(null);
  const element = render(layout);
  const dragMouseDownClientXYRef = useRef<null | { clientX: number; clientY: number }>(null);
  const resizeMouseDownClientXYRef = useRef<null | { clientX: number; clientY: number }>(null);

  const draggableProps = draggable
    ? {
        onMouseDown(e: React.MouseEvent) {
          dragMouseDownClientXYRef.current = {
            clientX: e.clientX,
            clientY: e.clientY,
          };
        },
      }
    : {};

  useEffect(() => {
    if (!draggable) return;

    const getOffsets = (e: MouseEvent) => {
      const offset = {
        x: e.clientX - dragMouseDownClientXYRef.current!.clientX,
        y: e.clientY - dragMouseDownClientXYRef.current!.clientY,
      };

      const containerBounds = getContainer()!.getBoundingClientRect();
      const spanW = containerBounds.width / 12;
      const spanH = containerBounds.height / 12;
      const boundOffsetX = bound(
        offset.x,
        -layout.x * spanW,
        (cols - (layout.x + layout.w)) * spanW
      );
      const boundOffsetY = bound(
        offset.y,
        -layout.y * spanH,
        (rows - (layout.y + layout.h)) * spanH
      );
      const offsetXCells = Math.round(boundOffsetX / spanW);
      const offsetYCells = Math.round(boundOffsetY / spanH);

      return {
        offsetX: offset.x,
        offsetY: offset.y,
        boundOffsetX,
        boundOffsetY,
        offsetXCells,
        offsetYCells,
        spanW,
        spanH,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragMouseDownClientXYRef.current) return;

      const { offsetXCells, offsetYCells, boundOffsetX, boundOffsetY } = getOffsets(e);
      Object.assign(elRef.current!.style, {
        transform: `translate(${boundOffsetX}px, ${boundOffsetY}px)`,
      });
      onLayoutChange?.({
        ...layout,
        x: layout.x + offsetXCells,
        y: layout.y + offsetYCells,
      });
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (!dragMouseDownClientXYRef.current) return;

      const { offsetXCells, offsetYCells } = getOffsets(e);
      Object.assign(elRef.current!.style, {
        transform: `translate(0px, 0px)`,
      });
      onLayoutChangeEnd?.({
        ...layout,
        x: layout.x + offsetXCells,
        y: layout.y + offsetYCells,
      });
      dragMouseDownClientXYRef.current = null;
    };

    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseup', handleMouseUp);
    };
  }, [layout, draggable, onLayoutChange, onLayoutChangeEnd, cols, rows, getContainer]);

  useEffect(() => {
    if (!resizable) return;

    const getOffsets = (e: MouseEvent) => {
      const offset = {
        x: e.clientX - resizeMouseDownClientXYRef.current!.clientX,
        y: e.clientY - resizeMouseDownClientXYRef.current!.clientY,
      };

      const containerBounds = getContainer()!.getBoundingClientRect();
      const spanW = containerBounds.width / 12;
      const spanH = containerBounds.height / 12;

      // TODO: to simplify the bound computation
      const boundOffsetW = bound(
        offset.x,
        (-layout.w + 1) * spanW,
        (cols - (layout.x + layout.w)) * spanW
      );
      const boundOffsetH = bound(
        offset.y,
        (-layout.h + 1) * spanH,
        (rows - (layout.y + layout.h)) * spanH
      );

      const offsetWSpans = bound(
        layout.w + Math.round(boundOffsetW / spanW),
        layout.minW || 1,
        layout.maxW || cols
      ) - layout.w;
      const offsetHSpans = bound(
        layout.h + Math.round(boundOffsetH / spanH),
        layout.minH || 1,
        layout.maxH || rows
      ) - layout.h;

      return {
        offsetX: offset.x,
        offsetY: offset.y,
        boundOffsetW: offsetWSpans * spanW,
        boundOffsetH: offsetHSpans * spanH,
        offsetWSpans,
        offsetHSpans,
        spanW,
        spanH,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeMouseDownClientXYRef.current) return;

      const { offsetWSpans, offsetHSpans, spanW, spanH, boundOffsetW, boundOffsetH } =
        getOffsets(e);
      Object.assign(elRef.current!.style, {
        position: 'absolute',
        gridColumnEnd: 'auto',
        gridRowEnd: 'auto',
        width: `${layout.w * spanW + boundOffsetW}px`,
        height: `${layout.h * spanH + boundOffsetH}px`,
      });

      onLayoutChange?.({
        ...layout,
        w: layout.w + offsetWSpans,
        h: layout.h + offsetHSpans,
      });
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (!resizeMouseDownClientXYRef.current) return;

      const { offsetWSpans, offsetHSpans } = getOffsets(e);
      Object.assign(elRef.current!.style, {
        position: 'relative',
        gridColumnEnd: layout.x + layout.w + offsetWSpans + 1,
        gridRowEnd: layout.y + layout.h + offsetHSpans + 1,
        width: 'auto',
        height: 'auto',
      });
      onLayoutChangeEnd?.({
        ...layout,
        w: layout.w + offsetWSpans,
        h: layout.h + offsetHSpans,
      });
      resizeMouseDownClientXYRef.current = null;
    };

    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseup', handleMouseUp);
    };
  }, [layout, resizable, onLayoutChange, cols, rows, getContainer]);

  return (
    <div
      key={layout.id}
      ref={elRef}
      style={{
        position: 'relative',
        gridColumnStart: layout.x + 1,
        gridColumnEnd: layout.x + layout.w + 1,
        gridRowStart: layout.y + 1,
        gridRowEnd: layout.y + layout.h + 1,
        cursor: draggable ? 'move' : 'inherit',
      }}
      {...draggableProps}
    >
      {element}
      {resizable && (
        // TODO: adjust styles and allow custom resizeHandle
        <div
          className="resize-handle"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            border: '0px solid black',
            borderRightWidth: 5,
            borderBottomWidth: 5,
            width: 15,
            height: 15,
            cursor: 'se-resize',
          }}
          draggable={false}
          onMouseDown={(e) => {
            e.stopPropagation();

            resizeMouseDownClientXYRef.current = {
              clientX: e.clientX,
              clientY: e.clientY,
            };
          }}
        />
      )}
    </div>
  );
};

export interface Layout {
  templateId: string;
  id: string;
  x: number;
  y: number;
  w: number;
  minW?: number
  maxW?: number
  h: number;
  minH?: number
  maxH?: number
}

const GridLayoutContext = createContext({
  layouts: [] as Layout[],
  cols: 12,
  rows: 12,
  getContainer: (() => null) as () => HTMLElement | null,
});

interface GridLayoutProps {
  fullPage?: boolean;
  cols: number;
  rows: number;
  itemRender: (layout: Layout) => ReactElement;
  droppable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  layouts: Layout[];
  onLayoutsChange: (newLayouts: Layout[]) => void;
  style?: React.CSSProperties;
}

export const GridLayout: FC<GridLayoutProps> = ({
  cols,
  rows,
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

  const droppableProps = droppable
    ? {
        onDragEnter: (e: React.DragEvent<HTMLElement>) => {
          e.preventDefault();
        },
        onDragOver: (e: React.DragEvent<HTMLElement>) => {
          e.preventDefault();
          if (!dropping) setDropping(true);
          e.dataTransfer.dropEffect = 'move';

          const { data, mouseOffset } = getContext(draggingItem!);
          const dropZoneMouseOffset = getMouseOffset(e as any, containerRef.current!);

          const containerBounds = containerRef.current!.getBoundingClientRect();
          const spanW = containerBounds.width / cols;
          const spanH = containerBounds.height / rows;

          const x = bound(Math.round((dropZoneMouseOffset.x - mouseOffset.x) / spanW), 0, cols - data.layout.w);
          const y = bound(
            Math.round((dropZoneMouseOffset.y - mouseOffset.y) / spanH),
            0,
            rows - data.layout.h
          );

          dropPositionRef.current.x = x;
          dropPositionRef.current.y = y;

          Object.assign(shadowRef.current!.style, {
            display: 'block',
            gridColumnStart: x + 1,
            gridRowStart: y + 1,
            gridColumnEnd: x + data.layout.w + 1,
            gridRowEnd: y + data.layout.h + 1,
          });
        },
        onDragLeave: (e: React.DragEvent<HTMLElement>) => {
          if (e.relatedTarget === shadowRef.current) return
          Object.assign(shadowRef.current!.style, {
            display: 'none',
          });
        },
        onDrop: (e: React.DragEvent<HTMLElement>) => {
          e.preventDefault();
          setDropping(false);

          const { data } = getContext(draggingItem!);
          onLayoutsChange([
            ...layouts,
            {
              id: `${data.templateId}-${Math.random()}`, // TODO: need redesign the computation?
              templateId: data.templateId,
              ...data.layout,
              ...dropPositionRef.current,
            },
          ]);
          Object.assign(shadowRef.current!.style, {
            display: 'none',
          });

          dropPositionRef.current.x = 0;
          dropPositionRef.current.y = 0;
        },
      }
    : {};

  return (
    <GridLayoutContext.Provider
      value={{
        layouts,
        cols,
        rows,
        getContainer: () => containerRef.current,
      }}
    >
      <div
        style={{
          ...(fullPage ? { width: '100vw', height: '100vh' } : { width: '100%', height: '100%' }),
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          position: 'relative',
          // TODO: replace with a design style
          background: `repeating-linear-gradient(0deg, transparent 0%, transparent calc(100% / 12 - 2px), #efefef calc(100% / 12)), repeating-linear-gradient(90deg, transparent 0%, transparent calc(100% / 12 - 2px), #efefef calc(100% / 12));`,
          ...style,
        }}
        {...droppableProps}
        ref={containerRef}
      >
        {layouts.map((layout) => (
          <LayoutItemComponent
            key={layout.id}
            layout={layout}
            render={itemRender}
            draggable={draggable}
            resizable={resizable}
            onLayoutChange={(newLayout) => {
              if (shadowRef.current) {
                Object.assign(shadowRef.current.style, {
                  display: 'block',
                  gridColumnStart: newLayout.x + 1,
                  gridRowStart: newLayout.y + 1,
                  gridColumnEnd: newLayout.x + newLayout.w + 1,
                  gridRowEnd: newLayout.y + newLayout.h + 1,
                });
              }
            }}
            onLayoutChangeEnd={(newLayout) => {
              Object.assign(shadowRef.current!.style, {
                display: 'none',
              });
              onLayoutsChange(
                layouts.map((layout) => (layout.id === newLayout.id ? newLayout : layout))
              );
            }}
          />
        ))}
        <div
          ref={shadowRef}
          id="dropping-shadow"
          style={{
            transition: '200ms',
            gridColumnStart: 1,
            gridRowStart: 1,
            background: 'blue',
            opacity: 0.1,
            display: 'none',
          }}
        />
      </div>
    </GridLayoutContext.Provider>
  );
};
