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
import { CloseButton, IconButton } from '@chakra-ui/react';
import { BsTrash3Fill } from 'react-icons/bs';
import { GridLayoutContext, Layout, mutateLayout } from '@/components/GridLayout';

interface LayoutItemComponentProps {
  layout: Layout;
  render: (layout: Layout) => ReactElement;
  draggable?: boolean;
  resizable?: boolean;
  onLayoutChange?: (newLayout: Layout) => void;
  onLayoutChangeEnd?: (newLayout: Layout) => void;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onDeleted?: () => void;
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

const DeleteButtonAnchor = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 32px;
  height: 32px;
  z-index: 1;
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

const LayoutItemComponent: FC<LayoutItemComponentProps> = ({
  layout,
  render,
  draggable = false,
  resizable = false,
  onLayoutChange,
  onLayoutChangeEnd,
  selected,
  onSelectedChange,
  onDeleted,
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
      {selected && (
        <DeleteButtonAnchor>
          {/*<CloseButton />*/}
          <IconButton
            size="sm"
            isRound={true}
            variant="solid"
            colorScheme="red"
            aria-label="Delete"
            // fontSize="12px"
            icon={<BsTrash3Fill />}
            onClick={onDeleted}
          />
        </DeleteButtonAnchor>
      )}

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

export default LayoutItemComponent;
