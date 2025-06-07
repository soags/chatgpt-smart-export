import { describe, it, expect } from "vitest";
import { normalizeTableAssistant } from "../src/transforms/normalizeTableAssistant";
import { createDomFromHtml } from "./createDomFromHtml";

describe("normalizeTableAssistant", () => {
  it("should preserve table content but remove wrappers", () => {
    const root = createDomFromHtml(`
<div>
  <div class="tableWrapper">
    <table>
      <thead><tr><th>Head</th></tr></thead>
      <tbody><tr><td>Body</td></tr></tbody>
    </table>
  </div>
</div>
`);
    normalizeTableAssistant(root);

    const table = root.querySelector("table");
    expect(table).toBeDefined();
    const th = table?.querySelector("th");
    const td = table?.querySelector("td");
    expect(th?.textContent).toBe("Head");
    expect(td?.textContent).toBe("Body");
  });
});
