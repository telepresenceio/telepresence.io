import React from 'react';
import classnames from 'classnames';
import { navigate } from 'gatsby';

import Layout from '../../Layout';
import PageHead from '../../Head/PageHead';
import ResourceLink from '../../resources/ResourceLink';

import { BASE_URL } from '../../../utils/urls';
import { useResourcesFiltering } from './resourcesFiltering';

import styles from './styles.module.less';

function CheckIcon() {
  return (
    <svg
      className={styles.topicCheck}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path stroke="#5F3EFF" strokeWidth="2" d="M1 1h18v18H1z" />
      <path strokeWidth="0" fill="#fff" d="M13 0h7v10h-7z" />
      <path stroke="#5F3EFF" strokeWidth="2.5" d="M5 10l3.5 3.5L19 3" />
    </svg>
  );
}

const SideArrow = ({ isLeft = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: isLeft ? `scaleX(-1)` : undefined }}
    viewBox="0 0 24 24"
  >
    <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
  </svg>
);

const Pagination = ({ curPage, pageCount, setPage }) => {
  return (
    <div className={styles.pagination}>
      {curPage !== 1 && (
        <button
          className={styles.prevButton}
          onClick={() => setPage(curPage - 1)}
        >
          <span className="visually-hidden">Go to previous page</span>
          <SideArrow isLeft={true} />
        </button>
      )}
      <div className={styles.pageNumber}>
        <span className="visually-hidden">Page</span> {curPage} out of{' '}
        {pageCount}
      </div>
      {curPage < pageCount && (
        <button
          className={styles.nextButton}
          onClick={() => setPage(curPage + 1)}
        >
          <span className="visually-hidden">Go to next page</span>
          <SideArrow />
        </button>
      )}
    </div>
  );
};

export default ({ data, location, pageContext }) => {
  const {
    topics,
    types,
    allResources,
    filteredResources,
    chosenFilters,
    chooseFilter,
    resultsHeadingRef,
  } = useResourcesFiltering(data, location);

  const hasFilters = chosenFilters.topics.length || chosenFilters.types.length;
  const { pageCount, currentPage, total } = pageContext;

  const selectedAmount = filteredResources.length;

  const setPage = (page) => {
    let url = page !== 1 ? `/resources/${page}` : `/resources/`;
    navigate(url);
  };

  return (
    <>
      <PageHead
        meta={{
          title: 'Resources | Ambassador',
          seoDescription:
            'A resource library for learning about how to build cloud native applications on Kubernetes, focusing on implementing a comprehensive, self-service edge stack.',
        }}
        canonicalUrl={BASE_URL + 'resources/'}
        schema={{
          type: 'resourcesPage',
          resources: allResources,
        }}
      />
      <Layout location={location}>
        <main>
          <section className={styles.hero}>
            <h1>Ambassador's Resource Library</h1>
            <p>
              Everything you need to know about building a Kubernetes platform,
              getting traffic into your cluster, and using the Ambassador Edge
              Stack
            </p>
          </section>
          <div className={styles.wrapper}>
            <aside className={styles.sidebar}>
              <h2>Filter resources:</h2>
              <section>
                <h3>Content types</h3>
                <div>
                  {types.map(({ svg, title }) => (
                    <button
                      className={classnames(
                        chosenFilters.types.indexOf(title) >= 0
                          ? styles.typeBtnActive
                          : '',
                        styles.typeBtn
                      )}
                      key={title}
                      onClick={chooseFilter({ title, filterKey: 'types' })}
                    >
                      <div dangerouslySetInnerHTML={{ __html: svg }}></div>{' '}
                      {title}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3>Topics</h3>
                <div>
                  {topics.map(({ title }) => (
                    <button
                      key={title}
                      onClick={chooseFilter({ title, filterKey: 'topics' })}
                      className={classnames(
                        chosenFilters.topics.indexOf(title) >= 0
                          ? styles.topicBtnActive
                          : '',
                        styles.topicBtn
                      )}
                    >
                      <CheckIcon />
                      {title}
                    </button>
                  ))}
                </div>
              </section>
            </aside>
            <section className={styles.results}>
              <h2 className={styles.resultsHeading} ref={resultsHeadingRef}>
                {!hasFilters ? (
                  <>
                    <strong>{total}</strong> resources available (page{' '}
                    {currentPage} of {pageCount})
                  </>
                ) : (
                  <>
                    <strong>{selectedAmount}</strong> resource
                    {selectedAmount > 1 && 's'} matched (out of {total})
                  </>
                )}
              </h2>
              <div className={styles.resultsContainer}>
                {filteredResources.map(({ id, ...res }) => (
                  <ResourceLink key={id} {...res} />
                ))}
              </div>
              {/* Pagination only makes sense in the context of no filters */}
              {!hasFilters && (
                <Pagination
                  curPage={currentPage}
                  pageCount={pageCount}
                  setPage={setPage}
                />
              )}
            </section>
          </div>
        </main>
      </Layout>
    </>
  );
};
