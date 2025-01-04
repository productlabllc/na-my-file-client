export const getMarkDownFile = async (name?: string, language?: string) => {
  const mdFile = await import(`../assets/md-translations/${name}/${language}.md`);

  const text = await fetch(mdFile.default).then((response) => response.text());

  return text;
};
