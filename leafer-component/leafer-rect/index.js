import { customElement as t } from "solid-element";
import { createMemo as r } from "solid-js";
t("leafer-rect", {
  text: ""
}, (e) => ["leafer-rect-", r(() => e.text)]);
