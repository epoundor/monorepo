import { render, fireEvent } from "@testing-library/vue";
import HelloWorld from "../HelloWorld.vue";

test("hello fucking world", async () => {
  // The render method returns a collection of utilities to query your component.
  const { getByText } = render(HelloWorld, { props: { msg: "You did it!" } });

  // getByText returns the first matching node for the provided text, and
  // throws an error if no elements match or if more than one match is found.
  getByText("You did it!");
});
