import React, { useState, useRef, useEffect, ReactNode, useMemo } from 'react';
import moment from 'moment';
import {
  Box,
  Flex,
  Text,
  Skeleton,
  Center,
  Grid,
  AvatarGroup,
  GridItem,
  Avatar,
  Heading,
  SystemProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { orderBy } from 'lodash';
import { useErrorToast } from '@/lib/customToast';
import { projectTimelineConfig } from '@/../config/project_timeline.config';

interface OwnerItem {
  name: string;
  avatar: string;
}

interface CardInfo {
  cardNo: string;
  cardName: string;
  startDate: string;
  endDate: string;
  status: string;
  color: string;
  owner: OwnerItem;
  coOwners: OwnerItem[];
}

const renderConfig = {
  monthBeforeToday: 1,
  monthAfterToday: 2,
  monthIndicatorRowNum: 1,
  dateIndicatorRowNum: 2,
  gridWidth: 48,
  cardFirstRowNum: 1,
  scrollOffset: 512,
};

const preparedDisplayDates: string[] = [];
const startDateMoment = moment().subtract(renderConfig.monthBeforeToday, 'month');
const startDate = startDateMoment.format('YYYY-MM-DD');
const endDateMoment = moment().add(renderConfig.monthAfterToday, 'month');
const endDate = endDateMoment.format('YYYY-MM-DD');
while (startDateMoment.isBefore(endDateMoment)) {
  preparedDisplayDates.push(startDateMoment.format('YYYY-MM-DD'));
  startDateMoment.add(1, 'day');
}

/** card1.startDate < card2.startDate */
const canPlaceToOneLine = (card1: CardInfo, card2: CardInfo, gapDays: number) => {
  return moment(card1.endDate).add(gapDays, 'days').isBefore(card2.startDate);
};
const getCompactTimelines = (cards: CardInfo[]) => {
  const sortedCards = orderBy(cards, 'startDate');
  const lines: CardInfo[][] = [];

  for (const card of sortedCards) {
    let placed = false;
    for (const line of lines) {
      if (canPlaceToOneLine(line.at(-1)!, card, 2)) {
        line.push(card);
        placed = true;
        break;
      }
    }

    if (placed) continue;
    lines.push([card]);
  }

  return lines.reverse();
};

const Timeline = (props: SystemProps) => {
  const toastError = useErrorToast();
  const todayRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [cards, setCards] = useState<CardInfo[]>([]);
  const [displayDates, setDisplayDates] = useState<string[]>([]);

  const gridBgColor = useColorModeValue('#FFF', 'gray.800');
  const weekendGridBgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.400');
  const headColor = useColorModeValue('gray.600', 'gray.300');

  const loadCards = async () => {
    const res = await fetch(`/api/project_timeline?start_date=${startDate}&end_date=${endDate}`);
    if (res.status == 200) {
      const json = await res.json();
      const cards = json
        .filter((card: CardInfo) => card.startDate > startDate)
        .filter((card: CardInfo) => card.startDate !== card.endDate);
      setCards(cards);
    } else {
      toastError(await res.text());
    }
  };

  useEffect(() => {
    setDisplayDates(preparedDisplayDates);
    loadCards().then(() => {
      if (scrollContainerRef.current && todayRef.current) {
        scrollContainerRef.current.scrollLeft =
          todayRef.current.offsetLeft - renderConfig.scrollOffset;
      }
    });
  }, []);

  const renderCardGrid = (cardInfo: CardInfo, index: number) => {
    const colStart = displayDates.findIndex((d) => moment(cardInfo.startDate).isSame(d));
    const colEnd = displayDates.findIndex((d) => moment(cardInfo.endDate).isSame(d));
    return (
      <GridItem
        key={cardInfo.cardNo}
        rowStart={renderConfig.cardFirstRowNum + index}
        colStart={colStart + 1}
        colEnd={colEnd + 2}
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
      >
        {renderCard(cardInfo)}
      </GridItem>
    );
  };

  const renderTimeline = (cards: CardInfo[], index: number) => {
    return cards.map((card) => renderCardGrid(card, index));
  };

  const renderCard = (card: CardInfo) => {
    return (
      <Flex
        bgColor={`#${card.color}`}
        color="white"
        p="2px"
        h="40px"
        borderWidth="1px"
        borderRadius="20px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex ml={2} flexDirection="column" alignItems="start">
          <Text fontSize="md" noOfLines={1}>
            {`[${card.cardNo}] ${card.cardName}`}
          </Text>
        </Flex>
        {/*<Avatar w="24px" h="24px" name={cardInfo.owner} />*/}
        {card.owner && (
          <AvatarGroup>
            <Avatar w="36px" h="36px" name={card.owner.name} src={card.owner.avatar} />
            <Avatar
              w="36px"
              h="36px"
              name={card.coOwners[0]?.name}
              src={card.coOwners[0]?.avatar}
            />
          </AvatarGroup>
        )}
      </Flex>
    );
  };

  const renderDayNumber = (date: string) => {
    const dayNumber = moment(date).date();
    const isToday = moment(date).isSame(moment(), 'day');
    if (isToday) {
      return (
        <Center
          ref={todayRef}
          w="24px"
          h="24px"
          color="white"
          backgroundColor="red.500"
          borderRadius="100%"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            left: '11px',
            top: 0,
            // height: cards.length * 42 + 28,
            height: '400px',
            width: '2px',
            backgroundColor: 'red.500',
            zIndex: -1,
          }}
        >
          {dayNumber}
        </Center>
      );
    }
    return <Center>{dayNumber}</Center>;
  };

  const renderWeekendGrids = (displayDates: string[]) => {
    const weekendBgItems: ReactNode[] = [];
    displayDates.forEach((date, index) => {
      if (moment(date).isoWeekday() === 6 || moment(date).isoWeekday() === 7)
        weekendBgItems.push(
          <GridItem
            key={date}
            colStart={index + 1}
            colEnd={index + 2}
            rowStart={1}
            rowEnd={cards.length + 1}
            backgroundColor={weekendGridBgColor}
            zIndex="-3"
          />
        );
    });
    return weekendBgItems;
  };

  const renderMonthIndicatorGrids = (displayDates: string[]) => {
    const gridYearMonth: ReactNode[] = [];
    displayDates?.forEach((date, index) => {
      if (index == 0 || moment(date).date() == 1) {
        const monthYearStr = moment(date).format('MMMM YYYY');
        gridYearMonth.push(
          <GridItem
            left={0}
            position="sticky"
            bgColor={gridBgColor}
            key={monthYearStr}
            rowStart={renderConfig.monthIndicatorRowNum}
            colStart={index + 1}
            colSpan={3}
            h="40px"
          >
            <Flex
              h="100%"
              alignItems="center"
              justifyContent="flex-start"
              ml="12px"
              fontWeight="bold"
              _before={{
                content: '""',
                position: 'absolute',
                top: '0px',
                left: '-20px',
                width: '20px',
                height: '100%',
                backgroundColor: gridBgColor,
                WebkitMaskImage:
                  'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%)',
              }}
            >
              {monthYearStr}
            </Flex>
          </GridItem>
        );
      }
    });
    return gridYearMonth;
  };

  const renderDateIndicatorGrids = (displayDates: string[]) => {
    return displayDates?.map((date, index) => {
      const isWeekend = moment(date).isoWeekday() === 6 || moment(date).isoWeekday() === 7;
      return (
        <GridItem
          key={date}
          id={date}
          display="flex"
          justifyContent="center"
          alignItems="center"
          rowStart={renderConfig.dateIndicatorRowNum}
          colStart={index + 1}
          borderY="1px solid"
          borderColor={borderColor}
          zIndex="-2"
          h="40px"
          backgroundColor={isWeekend ? weekendGridBgColor : gridBgColor}
        >
          {renderDayNumber(date)}
        </GridItem>
      );
    });
  };

  const lines = useMemo(() => getCompactTimelines(cards), [cards]);

  return (
    <Box
      minH="200px"
      w="100%"
      border="1px solid"
      borderRadius="8px"
      borderColor={borderColor}
      {...props}
    >
      <Flex
        h="100%"
        direction="column"
        overflowY="hidden"
        overflowX="scroll"
        borderColor={borderColor}
        scrollBehavior="smooth"
        ref={scrollContainerRef}
      >
        <Heading
          left="12px"
          position="sticky"
          marginX="12px"
          marginY="8px"
          size="md"
          color={headColor}
        >
          {projectTimelineConfig.title || 'Delivery Timeline'}
        </Heading>
        <Box w={displayDates.length * renderConfig.gridWidth}>
          <Grid
            w={displayDates.length * renderConfig.gridWidth}
            templateColumns={`repeat(${displayDates.length}, 1fr)`}
          >
            {renderMonthIndicatorGrids(displayDates)}
            {renderDateIndicatorGrids(displayDates)}
          </Grid>
        </Box>
        <Box flex="1" w={displayDates.length * renderConfig.gridWidth} overflowY="scroll">
          {cards.length > 0 ? (
            <Grid
              h={cards.length * renderConfig.gridWidth}
              w={displayDates.length * renderConfig.gridWidth}
              templateColumns={`repeat(${displayDates.length}, 1fr)`}
            >
              {renderWeekendGrids(displayDates)}
              {lines.map((cards, index) => renderTimeline(cards, index))}
            </Grid>
          ) : (
            <Skeleton w="100%" h="100%"></Skeleton>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Timeline;
