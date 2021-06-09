export function getTitle(meta) {
  return meta.seoTitle || `${meta.title} | Ambassador`;
}

export function getScripts(meta) {
  const { scripts = [] } = meta;
  const bodyStartScripts = scripts
    .filter(s => s.type === 'bodyStart')
    .map(s => s.script)
    .join('\n');
  const bodyEndScripts = scripts
    .filter(s => s.type === 'bodyEnd')
    .map(s => s.script)
    .join('\n');
  return {
    bodyStartScripts,
    bodyEndScripts,
  };
}

export function getPageInfo(meta) {
  return {
    title: getTitle(meta),
    ...getScripts(meta),
  };
}
