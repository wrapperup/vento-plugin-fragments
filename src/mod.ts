import { Environment, Token } from "../deps.ts";

function fragmentPreprocessor(
  _env: Environment,
  tokens: Token[],
  path?: string,
): Token[] | undefined {
  if (!path || !path.includes("#")) {
    // Filter out all fragment tags
    return tokens.filter((token) =>
      token[0] !== "tag" || !token[1].startsWith("fragment "),
    );
  }

  const splitPath = path.split("#");

  if (splitPath.length !== 2) {
    throw new Error("Fragment query has multiple \"'#\" characters: " + path);
  }

  const [_, fragment] = splitPath;

  let indexStart = 0;
  while (indexStart < tokens.length) {
    const token = tokens[indexStart];

    if (token[0] === "tag" && token[1] === "fragment " + fragment) {
      // Found fragment, remove it and return the rest of the tokens
      indexStart++;
      break;
    }
    indexStart++;
  }

  if (indexStart >= tokens.length) {
    throw new Error("Couldn't find fragment \"" + fragment + '"');
  }

  let indexEnd = indexStart;

  while (indexEnd < tokens.length) {
    const token = tokens[indexEnd];
    if (token[0] === "tag" && token[1] === "/fragment") {
      const fragment = tokens.slice(indexStart, indexEnd);
      return fragment;
    }
    indexEnd++;
  }

  throw new Error("Couldn't find end of fragment \"" + fragment + '"');
}

export function fragmentPlugin() {
  return (env: Environment) => {
    env.tokenPreprocessors.push(fragmentPreprocessor);
  };
}
