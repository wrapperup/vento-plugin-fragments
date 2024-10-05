import { Environment, Token } from "../deps.ts";

// Re-merge string tokens that were split up by fragment tags
function mergeStringTokens(tokens: Token[]) {
  let i = 0;
  while (i < tokens.length) {
    if (tokens[i][0] === "string") {
      const j = i + 1;
      while (j < tokens.length && tokens[j][0] === "string") {
        tokens[i][1] += tokens[j][1];
        tokens.splice(j, 1);
      }
    }
    i++;
  }
}

function filterFragments(tokens: Token[]) {
  const filtered = tokens.filter((token) =>
    token[0] !== "tag" ||
    (!token[1].trim().startsWith("fragment ") &&
      token[1].trim() !== "/fragment")
  );

  mergeStringTokens(filtered);

  return filtered;
}

function fragmentPreprocessor(
  _env: Environment,
  tokens: Token[],
  path?: string,
): Token[] | undefined {
  if (!path || !path.includes("#")) {
    // Filter out all fragment tags
    return filterFragments(tokens);
  }

  const splitPath = path.split("#");

  if (splitPath.length !== 2) {
    throw new Error('Fragment query has multiple "#" characters: ' + path);
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

  let depth = 0;
  while (indexEnd < tokens.length) {
    const token = tokens[indexEnd];
    if (token[0] === "tag" && token[1].startsWith("fragment ")) {
      depth++;
    } else if (token[0] === "tag" && token[1] === "/fragment") {
      depth--;
    }
    if (depth <= -1) {
      const fragment = tokens.slice(indexStart, indexEnd);
      return filterFragments(fragment);
    }
    indexEnd++;
  }

  throw new Error("Couldn't find end of fragment \"" + fragment + '"');
}

export default function fragments() {
  return (env: Environment) => {
    env.tokenPreprocessors.push(fragmentPreprocessor);
  };
}
