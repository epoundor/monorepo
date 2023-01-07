function pascalCase(str: string) {
  return str.replace(
    /(\w)(\w*)/g,
    (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
  );
}

export { pascalCase };
