import React from 'react';
import { Popover } from 'antd';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import allLocales from '@fullcalendar/core/locales-all';
import FullCalendarCellCard from './FullCalendarCellCard.component';
import { getColorByType } from './utils';
import moment from 'moment';

import styles from './styles.module.scss';

const MyFullCalendar = ({ data }) => {
  const renderEventContent = (eventInfo) => (
    <Popover content={<FullCalendarCellCard data={eventInfo.event._def.extendedProps} />} title="" trigger="click">
      <div className={styles.event}>
        <div>{eventInfo.event.title}</div>
      </div>
    </Popover>
  );

  // const eventMouseEnter = ({ event }) => {
  //   console.log('eventMouseEnter');
  //   event.setProp('backgroundColor', '#4FC172');
  // }
  // const eventMouseLeave = ({ event }) => {
  //   console.log('eventMouseLeave');
  //   event.setProp('backgroundColor', '#FF6D78');
  // }

  const renderDayCellContent = ({ date }) => date.getUTCDate();

  const dateFormat = 'YYYY-MM-DD';
  data = data?.map((value) => {
    let className = '';
    switch (value.category) {
      case '开发者活动/竞赛':
        className = 'activity';
        break;
      case 'meetup':
        className = 'meetup';
        break;
      default:
        className = 'other';
    }
    const classNames = [styles[className]];
    return {
      ...value,
      start: value.startDate,
      end: moment(value.endDate, dateFormat).add(1, 'days').format(dateFormat),
      // 4D is hex(30% * 255)
      color: getColorByType(value.category) + '4D',
      textColor: '#1e2b37',
      card: value,
      classNames,
    };
  });
  return (
    <FullCalendar
      locales={allLocales}
      locale="zh" // the initial locale
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={data}
      // dateClick={handleDateClick}
      eventContent={renderEventContent}
      dayCellContent={renderDayCellContent}
      headerToolbar={{
        start: 'title', // will normally be on the left. if RTL, will be on the right
        center: '',
        end: 'prev,next', // will normally be on the right. if RTL, will be on the left
      }}
      contentHeight="auto"
    />
  );
};

export default MyFullCalendar;
