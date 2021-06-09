// https://github.com/gatsbyjs/gatsby/issues/10174#issuecomment-442513501
module.exports = (content, vars) => {
  return content.replace(/\$(\S+)\$/g, (match, key) => {
		const value = vars[key];
		if (typeof value !== 'undefined') {
			return value;
		}
		return match; // guards against some unintentional prefix
	});
};
