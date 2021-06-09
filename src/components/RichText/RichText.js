import React from 'react';
import BlockContent from '@sanity/block-content-to-react';

import Link from '../Link';
import PageHero from '../PageHero';
import MediaColumns from '../MediaColumns';
import TitleCta from '../TitleCta';
import SideNote from '../SideNote';
import ResourceCards from '../resources/ResourceCards/ResourceCards';
import DoubleColumnLists from '../DoubleColumnLists';
import Embed from '../Embed';
import BodyImage from '../BodyImage';
import HubspotForm from '../HubspotForm';
import SocialSharingButtons from '../SocialSharingButtons';
import Anchor from '../Anchor/Anchor';
import ResourcePeopleBar from '../ResourcePeopleBar/ResourcePeopleBar';
import StyledRichText from '../StyledRichText/StyledRichText';
import DoubleColumnRichText from '../DoubleColumnRichText/DoubleColumnRichText';
import NewsEventsSection from '../NewsEvent/NewsEventsSection';
import PeopleSection from '../PeopleSection/PeopleSection';
import ComparisonTable from '../ComparisonTable/ComparisonTable';
import SideImage from '../SideImage/SideImage';
import LinksSection from '../LinksSection/LinksSection';
import LinksTable from '../LinksTable/LinksTable';
import TestimonialCarousel from '../TestimonialCarousel/TestimonialCarousel';
import BuzzBand from '../BuzzBand/BuzzBand';
import FeaturedEvents from '../Events/FeaturedEvents';
import FeaturedNews from '../News/FeaturedNews';
import FilteredResources from '../resources/FilteredResouces';
import SanityCodeBlock from '../CodeBlock/SanityCodeBlock';
import { CtaRow } from '../CTAs/CTAs';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';

// Quick helper for debugging props
// const Report = props => <pre>{JSON.stringify(props, null, 2)}</pre>;

const serializers = {
  marks: {
    blockLink: ({ children, mark }) => {
      return (
        <Link to={mark.url} target={mark.newWindow ? '_blank' : '_self'}>
          {children}
        </Link>
      );
    },
  },
  types: {
    mediaColumns: ({ node }) => <MediaColumns {...node} />,
    pageHero: ({ node }) => <PageHero {...node} />,
    titleCta: ({ node }) => <TitleCta {...node} />,
    sidenote: ({ node }) => <SideNote {...node} />,
    embed: ({ node }) => <Embed {...node} />,
    doubleColumnLists: ({ node }) => <DoubleColumnLists {...node} />,
    bodyImage: ({ node }) => <BodyImage {...node} />,
    resourceCards: ({ node }) => <ResourceCards {...node} />,
    newsEventsSection: ({ node }) => <NewsEventsSection {...node} />,
    hubspotForm: ({ node }) => <HubspotForm {...node} />,
    socialSharingButtons: ({ node }) => <SocialSharingButtons {...node} />,
    anchor: ({ node }) => <Anchor {...node} />,
    resourcePeopleBar: ({ node }) => <ResourcePeopleBar {...node} />,
    styledRichText: ({ node }) => <StyledRichText {...node} />,
    doubleColumnRichText: ({ node }) => <DoubleColumnRichText {...node} />,
    peopleSection: ({ node }) => <PeopleSection {...node} />,
    comparisonTable: ({ node }) => <ComparisonTable {...node} />,
    sideImage: ({ node }) => <SideImage {...node} />,
    linksSection: ({ node }) => <LinksSection {...node} />,
    linksTable: ({ node }) => <LinksTable {...node} />,
    featuredEvents: ({ node }) => <FeaturedEvents {...node} />,
    featuredNews: ({ node }) => <FeaturedNews {...node} />,
    testimonialCarousel: ({ node }) => <TestimonialCarousel {...node} />,
    buzzBand: ({ node }) => <BuzzBand {...node} />,
    filteredResources: ({ node }) => <FilteredResources {...node} />,
    code: ({ node }) => <SanityCodeBlock {...node} />,
    ctaRow: ({ node }) => <CtaRow {...node} />,
    breadcrumbs: ({ node }) => <Breadcrumbs {...node} />,
  },
};

export default ({ blocks = [], singleContainer = true, ...rest }) => {
  return (
    <BlockContent
      blocks={blocks}
      renderContainerOnSingleChild={singleContainer}
      serializers={serializers}
      {...rest}
    />
  );
};
