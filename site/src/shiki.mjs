// Shiki transformer: drops each token color that repeats the <pre> default, so snippets stay small.
export const dropDefaultColor = {
  span(node) {
    const color = node.properties.style;
    const parentStyle = this.pre.properties.style;
    if (
      typeof color === 'string' &&
      color.startsWith('color:') &&
      typeof parentStyle === 'string' &&
      parentStyle.toLowerCase().split(';').includes(color.toLowerCase())
    ) {
      delete node.properties.style;
    }
  },
};
