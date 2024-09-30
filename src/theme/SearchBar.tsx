import * as React from "react";
import {useEffect} from "react";
import Search from '@site/src/components/Search'

export default function SearchBar() {
	useEffect(() => {
		const script = document.createElement("script");
		document.head.append(script);
		script.src = "https://cse.google.com/cse.js?cx=c1eaf17d1db4e4ac8";
	}, []);

	return (
		<Search/>
	);
}
