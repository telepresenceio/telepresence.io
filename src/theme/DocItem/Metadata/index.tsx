import React from 'react';
import Metadata from '@theme-original/DocItem/Metadata';
import type MetadataType from '@theme/DocItem/Metadata';
import type {WrapperProps} from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from "@docusaurus/Head";
import {useLocation} from "@docusaurus/router";
import {useDoc} from '@docusaurus/plugin-content-docs/client';

type Props = WrapperProps<typeof MetadataType>;

export default function MetadataWrapper(props: Props): JSX.Element {
  const { siteConfig: {customFields}} = useDocusaurusContext()
  const { pathname } = useLocation();
  const { metadata } = useDoc();
  const vpath = pathname.replace(/^\/docs\//, `/docs/telepresence/${metadata.version}/`)
  const canonical = `${customFields['canonicalBaseUrl']}${vpath}`

  return (
    <>
      <Metadata {...props} />
      <Head>
        <link rel="canonical" href={canonical}/>
      </Head>
    </>
  );
}
