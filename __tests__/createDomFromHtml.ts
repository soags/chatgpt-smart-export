import { JSDOM } from "jsdom";

export function createDomFromHtml(html: string): HTMLElement {
  const dom = new JSDOM(`${html}`);
  return dom.window.document.body;
}