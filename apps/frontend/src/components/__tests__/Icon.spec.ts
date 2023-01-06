import { render, fireEvent } from "@testing-library/vue";
import Icon from "../Icon.vue";

test("good icon is display", async () => {
  // The render method returns a collection of utilities to query your component.
  const { getByTestId } = render(Icon, { props: { name: "dashboard" } });
  setInterval(() => getByTestId("dashboard"), 100);
});

test("display default", async () => {
  // The render method returns a collection of utilities to query your component.
  const { getByTestId } = render(Icon, { props: { name: "anything" } });
  setInterval(() => getByTestId("error"), 100);
});
