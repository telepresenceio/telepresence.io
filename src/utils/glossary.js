import { getPathFromSlug, relativeToAbsUrl } from './urls';

export const GLOSSARY_URL = relativeToAbsUrl('learn/kubernertes-glossary');

export function useGlossaryArray({ pages }) {
  const lettersToWords = [];

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  alphabet.split('').forEach((letter) =>
    lettersToWords.push({
      letter,
      words: [],
    }),
  );

  pages.forEach(({ page }) => {
    const slug = page.fields.slug;
    const word = page.headings[0]?.value;

    if (!word) {
      return;
    }

    const letterIdx = alphabet.indexOf(slug.charAt(1));
    const path = getPathFromSlug(
      `/learn/kubernetes-glossary/${slug.substr(2)}`,
    );

    lettersToWords[letterIdx].words.push({
      word,
      path,
      // page.excerpt includes the h1, which often includes a "What is X?"
      // As we only want to show the brief definition for users, we exclude everything before the "?"
      excerpt: page.frontmatter?.description || page.excerpt?.split('?')[1],
    });
  });

  return lettersToWords;
}
