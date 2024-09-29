import React, { useState, useEffect } from 'react'

function ClientOnly({ children, ...delegated }) {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);
	if (!hasMounted) {
		return (<div>Loading...</div>);
	}
	return (
		<div {...delegated}>
		{children}
		</div>
	);
}

export default ClientOnly