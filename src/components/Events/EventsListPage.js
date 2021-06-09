import React from 'react';
import classnames from 'classnames';
import { Link } from 'gatsby';
import EventsImage from '../../assets/images/events.svg';
import EventCard from './EventCard';
import EventsListLatestNews from './EventsListLatestNews';
import Layout from '../Layout';
import NotFoundPage from '../../pages/404';
import PageHead from '../Head/PageHead';

import { BASE_URL } from '../../utils/urls';
import { getResourceForCard } from '../resources/FilteredResouces';

import Button from '../Button';
import Icon from '../Icon';

import styles from './EventsListPage.module.less';

export const eventCategories = [
  {
    name: 'event',
    text: 'Event',
    btnText: 'Event',
    color: 'blue',
    iconName: 'calendar',
    iconClassname: styles.calendarIcon,
    custom: false
  },
  {
    name: 'webinar',
    text: 'Webinar',
    btnText: 'Webinar',
    color: 'red',
    iconName: 'camera',
    custom: false
  },
  {
    name: 'developer-office-hours',
    text: 'Developer Office Hours',
    btnText: 'Developer Office Hours',
    color: 'purple',
    iconName: 'ambassador',
    iconClassname: styles.officeHoursIcon,
    custom: true
  },
  {
    name: 'meet-the-maintainers-sessions',
    text: 'Meet the Maintainers Sessions',
    btnText: 'Meet the Maintainers',
    color: 'red',
    iconName: 'chat-bubble',
    iconClassname: styles.meetTheMaintainers,
    custom: true
  },
  {
    name: 'oss-contributors-meetings',
    text: 'OSS Contributors Meetings',
    btnText: 'OSS Contributors Meetings',
    color: 'blue',
    iconName: 'calendar',
    iconClassname: styles.ossContributorsMeetings,
    custom: true
  },
  {
    name: 'ambassador-fest',
    text: 'Ambassador Fest',
    btnText: 'Ambassador Fest',
    color: 'green',
    iconName: 'tada',
    iconClassname: styles.ambassadorFest,
    custom: true
  }
];

const customEventCategories = eventCategories.filter(c => c.custom);

function getFeaturedEvents({ featuredEvents, allEvents }) {
  if (featuredEvents.length) {
    return featuredEvents.map(({ _id }) =>
      allEvents.find((ev) => ev._id === _id),
    );
  }
  // Getting featured events when editors don't set them manually:
  // If upcoming, we want to show the ones with the closest startDate
  const upcoming = allEvents.filter(
    (ev) => new Date(ev._parsedDate) > Date.now(),
  );
  if (upcoming.length) {
    // We want to prevent having 2 or less upcoming events that aren't in the featured section, so if upcoming.length <= 4, we'll include all of them as featured
    // Else, we can restrict to 2 and the upcoming section will have 2 or more cards, not breaking the layout
    return upcoming.slice(0, upcoming.length <= 4 ? 4 : 2);
  }
  // but if we don't have enough events to come, then we want to show the latest ones that are already passed
  return (
    // First we make a copy of the array to prevent mutating it
    Array.from(allEvents)
      // Then we reverse it to swap the order from (oldest to newest) to (newest to oldest)
      .reverse()
      // And finally get only 2 of them
      .slice(0, 2)
  );
}

function mergeAndOrderEventTypes(data) {
  const allEvents = [...data.events.nodes, ...data.webinars.nodes];
  const structuredEvents = allEvents.map((ev) => {
    // For regular events
    if (ev._type === 'event') {
      // We use the startDate as it's a more useful date for visitors looking for events to participate in
      return { ...ev, _parsedDate: ev.meta.startDate };
    }
    // For webinars
    if (ev._type === 'webinar') {
      // Get the latest date in the dates array
      // (most webinars have only one date, though)
      return {
        _id: ev._id,
        _type: ev._type,
        _parsedDate: (ev.meta.dates || []).sort()[0],
        _description: ev.meta.seoDescription,
        // We also want to massage the webinar's object to fit ResourceLink's format
        ...getResourceForCard(ev),
      };
    }
    return ev;
  });
  return structuredEvents.sort(
    (a, b) => new Date(a._parsedDate) - new Date(b._parsedDate),
  );
}

const getInfo = (rawTitle) => {
  const splitted = rawTitle?.split(':');
  return {
    category: splitted[0],
    title: splitted.length > 1 ? splitted[1] : splitted[0]
  }
};

const getType = (title) => {
  const idx = customEventCategories.findIndex(e => getInfo(title).category.indexOf(e.text) > -1 ? true : false);
  return idx > -1 ? customEventCategories[idx].name : 'event';
}

const getCardProps = (item) => {
  const { meta, _type } = item;
  if (_type === 'event') {
    const { excerpt, title, startDate, endDate, slug, url } = meta;
    return {
      excerpt,
      title: getInfo(title).title,
      startDate,
      endDate,
      url: slug?.current || url,
      type: getType(title)
    };
  }
  return {
    excerpt: item._description,
    startDate: item._parsedDate,
    title: getInfo(item.title).title,
    url: item.url,
    type: 'webinar',
  };
};

export default ({ data, location }) => {
  // Prevent displaying this page when we don't have a published newsPg in the CMS
  if (!data.page) {
    return <NotFoundPage />;
  }
  const { meta, title, featuredEvents = [] } = data.page;
  const { featured, upcomingEvents, pastEvents } = React.useMemo(() => {
    const allEvents = mergeAndOrderEventTypes(data);
    const featured = getFeaturedEvents({
      featuredEvents,
      allEvents,
    });
    const featuredIds = featured.map(({ _id }) => _id);
    // Non-featured events are those not found in the featured array
    const nonFeatured = allEvents.filter(
      (ev) => featuredIds.indexOf(ev._id) < 0,
    );
    // Then we split non-featured between upcoming and pastEvents
    // We use a reduce method instead of a filter to avoid re-running the nonFeatured array
    const { upcoming: upcomingEvents, past: pastEvents } = nonFeatured.reduce(
      (acc, cur) => {
        // If later than now, the event is upcoming
        if (new Date(cur._parsedDate) > Date.now()) {
          return {
            ...acc,
            upcoming: [...acc.upcoming, cur],
          };
        }
        return {
          ...acc,
          // We put the cur in the first position in the array because we want to show latest to oldest, as opposed to the original oldest to latest of the array
          // The rationale is that we want the next upcoming events (oldest) but the latest past events (newest).
          past: [cur, ...acc.past],
        };
      },
      { upcoming: [], past: [] },
    );

    return {
      featured,
      upcomingEvents,
      pastEvents,
    };
  }, [featuredEvents, data]);

  const categories = location.pathname.split('/about-us/events/')[1];
  const actualCategory = categories ? categories.replace('/', '') : '';
  const filterByCategory = (events) => actualCategory === "" ? events : events.filter(e => getType(e.meta?.title || '') === actualCategory);

  const filterFeatured = filterByCategory(featured);
  const filterUpcomingEvents = filterByCategory(upcomingEvents);
  const filterPastEvents = filterByCategory(pastEvents);

  const getCard = (item) => {
    const eventProps = getCardProps(item);
    return <EventCard key={item._id} {...eventProps} />;
  };

  return (
    <>
      <PageHead
        meta={{
          ...meta,
          title,
        }}
        canonicalUrl={BASE_URL + 'about-us/events/'}
      />
      <Layout location={location}>
        <div className={styles.eventsPage}>
          <main className={styles.content}>
            <section className={classnames(styles.grid, styles.hero)}>
              <h1 className={styles.hero_title}>{title}</h1>
              <p className={styles.hero_body}>
                Join Ambassador Lab’s Developer Advocates and developers like
                you as they share best practices and give an inside look into
                how they work.
              </p>
              <img src={EventsImage} className={styles.hero_icon} width="290" height="196" />
            </section>
            <section className={styles.navCategoriesContent}>
              <nav>
                <ul className={styles.navCategories}>
                  <li className={`${actualCategory !== '' ? classnames(styles.disableCategory, styles.allEvents) : styles.allEvents}`}>
                    <Link to="/about-us/events/">All Events</Link>
                  </li>
                  {customEventCategories.map(category => (
                    <li key={category.name} className={`${category.name !== actualCategory ? classnames(styles.disableCategory, category.iconClassname) : category.iconClassname}`}>
                      <Link to={`/about-us/events/${category.name}`}>
                        <Icon name={category.iconName} /> {category.btnText}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className={styles.hero_links}>
                <a href="#upcomingEvents"><span>Upcoming Events</span> &darr;</a>
                <a href="#pastEvents"><span>Past Events</span> &darr;</a>
              </div>
            </section>
            {((filterFeatured && filterFeatured.length > 0) || (filterUpcomingEvents && filterUpcomingEvents.length > 0)) && <div
              className={classnames(styles.grid, styles.featuredSection)}
              id="upcomingEvents"
            >
              <div>
                <h2 className={styles.heading}>Upcoming Events</h2>
                {filterFeatured && filterFeatured.length > 0 && <section
                  className={styles.featured}
                  aria-label="Featured events and webinars"
                >
                  {filterFeatured.map(getCard)}
                </section>}
                {filterUpcomingEvents && filterUpcomingEvents.length > 0 && <section
                  className={styles.events}
                  aria-label="Upcoming events and webinars"
                >
                  {filterUpcomingEvents.map(getCard)}
                </section>}
              </div>
              <div className={styles.news}>
                <EventsListLatestNews />
              </div>
            </div>}
            <div className={styles.pastEvents} id="pastEvents">
              <div className={styles.grid}>
                {filterPastEvents && filterPastEvents.length > 0 && (
                  <>
                    <h2 className={styles.heading}>Past events and webinars</h2>
                    <div className={styles.events}>
                      {filterPastEvents.map(getCard)}
                    </div>
                  </>
                )}
                <div className={styles.missedEvents}>
                  <div className={styles.missedEvents_container}>
                    <div className={styles.missedEvents_header}>
                      <h2 className={styles.missedEvents_title}>
                        Missed a session?
                      </h2>
                      <Icon name="play-video" />
                    </div>
                    <p className={styles.missedEvents_text}>
                      Watch recordings of past events and webinars on the
                      Ambassador Labs YouTube channel.
                    </p>
                    <Button
                      color="red-outline"
                      size="sm"
                      to="https://www.youtube.com/playlist?list=PLZWpj-1-nsqXIjc7X3ySal97Y6mnSs3sV"
                    >
                      Browse all videos{' '}
                      <Icon
                        name="arrow"
                        className={styles.missedEvents_arrow}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </>
  );
};
