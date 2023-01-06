import get from "lodash/get";

export function computeCellClass(header, isTh = false) {
  const classes = [
    header.class,
    {
      "text-left": !["center", "right"].includes(header.align),
      "text-center": header.align === "center",
      "text-right": header.align === "right",
    },
  ];

  if (isTh) {
    classes.push(header.thClass);
  } else {
    classes.push(header.tdClass);
  }

  return classes;
}

export function getItemField(item, header) {
  let value = get(item, header.field);
  if (value === null) {
    value = "";
  }
  if (typeof header.formatter === "function") {
    value = header.formatter(value);
  }

  return value;
}
