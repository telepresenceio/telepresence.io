import Layout from "@theme/Layout";
import React from "react";

type LayoutProps = {
	children?: React.ReactNode;
	title?: string;
	description?: string;
}

const LayoutWrapper: React.FC<LayoutProps> = ({title, description, children}) => {
	return <Layout title={title} description={description}>
		{children}
	</Layout>
}

export default LayoutWrapper;