import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Divider,
  Spacer,
  Skeleton,
  Center,
  IconButton,
  Icon,
  Grid,
  AvatarGroup,
  GridItem,
  Avatar,
  Heading,
  SystemProps,
} from '@chakra-ui/react';
import { useErrorToast } from '@/lib/customToast';

interface CardInfo {
  cardNo: string;
  cardName: string;
  startDate: string;
  endDate: string;
  status: string;
  color: string;
  owner: {
    name: string;
    avatar: string;
  };
  coOwners: any[];
}

const config = {
  monthBeforeToday: 1,
  monthAfterToday: 2,
  monthIndicatorRowNum: 1,
  dateIndicatorRowNum: 2,
  gridWidth: 48,
  cardFirstRowNum: 1,
  scrollOffset: 256,
};

const displayDates: string[] = [];
const startDate = moment().subtract(config.monthBeforeToday, 'month');
const endDate = moment().add(config.monthAfterToday, 'month');
while (startDate.isBefore(endDate)) {
  displayDates.push(startDate.format('YYYY-MM-DD'));
  startDate.add(1, 'day');
}

const Timeline = (props: SystemProps) => {
  const toastError = useErrorToast();
  const todayRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState([]);

  const loadCards = async () => {
    const res = await fetch(
      `/api/project_timeline?startDate=${displayDates[0]}`
    );
    if (res.status == 200) {
      const json = await res.json();
      const cards = json
        .filter((card: any) => card.startDate > displayDates[0])
        .filter((card: any) => card.startDate !== card.endDate);
      console.log(cards);
      setCards(cards);
    } else {
      toastError(await res.text());
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current && todayRef.current) {
      scrollContainerRef.current.scrollLeft =
        todayRef.current.offsetLeft - config.scrollOffset;
    }
  }, []);

  const renderCardGrid = (cardInfo: CardInfo, index: number) => {
    const colStart = displayDates.findIndex((d) =>
      moment(cardInfo.startDate).isSame(d)
    );
    const colEnd = displayDates.findIndex((d) =>
      moment(cardInfo.endDate).isSame(d)
    );
    return (
      <GridItem
        rowStart={config.cardFirstRowNum + index}
        colStart={colStart + 1}
        colEnd={colEnd + 2}
      >
        {renderCard(cardInfo)}
      </GridItem>
    );
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
            <Avatar
              w="36px"
              h="36px"
              name={card.owner.name}
              src={card.owner.avatar}
            />
            <Avatar w="36px" h="36px" name={card.coOwners[0]?.name} />
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
    const weekendBgItems: any[] = [];
    displayDates.forEach((date, index) => {
      if (moment(date).isoWeekday() === 6 || moment(date).isoWeekday() === 7)
        weekendBgItems.push(
          <GridItem
            colStart={index + 1}
            colEnd={index + 2}
            rowStart={1}
            rowEnd={cards.length + 1}
            backgroundColor="gray.100"
            zIndex="-3"
          />
        );
    });
    return weekendBgItems;
  };

  const renderMonthIndicatorGrids = (displayDates: string[]) => {
    const gridYearMonth: React.ReactNode[] = [];
    displayDates?.forEach((date, index) => {
      if (index == 0 || moment(date).date() == 1) {
        const monthYearStr = moment(date).format('MMMM YYYY');
        gridYearMonth.push(
          <GridItem
            left={0}
            position="sticky"
            backgroundColor="#FFF"
            key={monthYearStr}
            rowStart={config.monthIndicatorRowNum}
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
                backgroundColor: 'rgb(255, 255, 255)',
                '-webkit-mask-image':
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
      const isWeekend =
        moment(date).isoWeekday() === 6 || moment(date).isoWeekday() === 7;
      return (
        <GridItem
          key={date}
          id={date}
          display="flex"
          justifyContent="center"
          alignItems="center"
          rowStart={config.dateIndicatorRowNum}
          colStart={index + 1}
          borderY="1px solid"
          borderColor="gray.300"
          zIndex="-2"
          h="40px"
          backgroundColor={isWeekend ? 'gray.100' : 'white'}
        >
          {renderDayNumber(date)}
        </GridItem>
      );
    });
  };

  return (
    <Box
      minH="200px"
      w="100%"
      border="1px solid"
      borderRadius="8px"
      borderColor="gray.300"
      {...props}
    >
      <Flex
        h="100%"
        direction="column"
        overflowY="hidden"
        overflowX="scroll"
        borderColor="gray.300"
        scrollBehavior="smooth"
        ref={scrollContainerRef}
      >
        <Heading
          left="12px"
          position="sticky"
          marginX="12px"
          marginY="8px"
          size="md"
          color="gray.600"
        >
          Delivery Timeline:
        </Heading>
        <Box w={displayDates.length * config.gridWidth}>
          <Grid
            w={displayDates.length * config.gridWidth}
            templateColumns={`repeat(${displayDates.length}, 1fr)`}
          >
            {renderMonthIndicatorGrids(displayDates)}
            {/*{renderWeekendGrids(displayDates)}*/}
            {renderDateIndicatorGrids(displayDates)}
          </Grid>
        </Box>
        <Box
          flex="1"
          w={displayDates.length * config.gridWidth}
          overflowY="scroll"
        >
          {cards.length > 0 ? (
            <Grid
              h={cards.length * config.gridWidth}
              w={displayDates.length * config.gridWidth}
              templateColumns={`repeat(${displayDates.length}, 1fr)`}
            >
              {renderWeekendGrids(displayDates)}
              {cards.map((cardInfo, index) => renderCardGrid(cardInfo, index))}
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
