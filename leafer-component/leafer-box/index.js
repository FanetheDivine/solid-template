import { customElement as t } from "solid-element";
import { createMemo as r } from "solid-js";
t("leafer-box", {
  text: ""
}, (e) => ["leafer-box-", r(() => e.text)]);
