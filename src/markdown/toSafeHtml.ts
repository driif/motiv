import { fromHtml } from 'hast-util-from-html';
import { defaultSchema, sanitize } from 'hast-util-sanitize';
import { toHtml } from 'hast-util-to-html';
import { micromark } from 'micromark';

const schema = {
  ...defaultSchema,
  protocols: { ...defaultSchema.protocols, href: ['http', 'https', 'mailto', 'xmpp'] },
};

export function toSafeHtml(source: string) {
  return toHtml(sanitize(fromHtml(micromark(source), { fragment: true }), schema));
}
