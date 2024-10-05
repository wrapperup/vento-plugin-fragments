import tmpl from "https://deno.land/x/vento@v1.12.10/mod.ts";
import fragments from "../mod.ts";
import { assertEquals } from "https://deno.land/std@0.205.0/assert/assert_equals.ts";

Deno.test("Simple fragment", () => {
  const code = `
    <h1>Hello!</h1>
    {{ fragment first }}<p>First fragment</p>{{ /fragment }}

    {{ description }}
    `;

  const env = tmpl();
  env.use(fragments());

  const tokens = env.tokenize(code, "test.vto#first");
  assertEquals(tokens, [
    ["string", "<p>First fragment</p>", 45],
  ]);
});

Deno.test("Double nested fragment", () => {
  const code = `
    <h1>Hello!</h1>
    {{ fragment first }}
      <p>First fragment</p>
      {{ fragment second }}<p>Second fragment</p>{{ /fragment }}
      <p>Bottom of first fragment</p>
    {{ /fragment }}

    {{ description }}
    `;

  const env = tmpl();
  env.use(fragments());

  {
    const tokens = env.tokenize(code, "test.vto#first");
    assertEquals(tokens, [
      [
        "string",
        "\n" +
        "      <p>First fragment</p>\n" +
        "      <p>Second fragment</p>\n" +
        "      <p>Bottom of first fragment</p>\n" +
        "    ",
        45,
      ],
    ]);
  }

  {
    const tokens = env.tokenize(code, "test.vto#second");
    assertEquals(tokens, [
      [
        "string",
        "<p>Second fragment</p>",
        101,
      ],
    ]);
  }
});

Deno.test("Complex nested fragment", () => {
  const code = `<h1>Hello!</h1>
    {{- fragment first -}}
      <p>First fragment</p>
      {{- fragment second }}<p>Second fragment</p>{{ /fragment -}}
      {{- fragment third -}}
        <p>Third fragment</p>
        {{- fragment fourth -}}<p>Fourth fragment</p>{{- /fragment -}}
      {{- /fragment -}}
      <p>Bottom of first fragment</p>
    {{- /fragment }}
    `;

  const env = tmpl();
  env.use(fragments());

  {
    const tokens = env.tokenize(code, "test.vto#first");
    assertEquals(tokens, [
      [
        "string",
        "<p>First fragment</p><p>Second fragment</p><p>Third fragment</p><p>Fourth fragment</p><p>Bottom of first fragment</p>",
        42,
      ],
    ]);
  }
  {
    const tokens = env.tokenize(code, "test.vto#second");
    assertEquals(tokens, [
      [
        "string",
        "<p>Second fragment</p>",
        99,
      ],
    ]);
  }
  {
    const tokens = env.tokenize(code, "test.vto#third");
    assertEquals(tokens, [
      [
        "string",
        "<p>Third fragment</p><p>Fourth fragment</p>",
        166,
      ],
    ]);
  }
  {
    const tokens = env.tokenize(code, "test.vto#fourth");
    assertEquals(tokens, [
      [
        "string",
        "<p>Fourth fragment</p>",
        228,
      ],
    ]);
  }
});

Deno.test("Fragment with data", () => {
  const code = `
    <h1>Hello!</h1>
    {{ fragment first }}<p>{{ name }}</p>{{ /fragment }}

    {{ description }}
    `;

  const env = tmpl();
  env.use(fragments());

  const tokens = env.tokenize(code, "test.vto#first");

  assertEquals(tokens, [
    [
      "string",
      "<p>",
      45,
    ],
    [
      "tag",
      "name",
      48,
    ],
    [
      "string",
      "</p>",
      58,
    ],
  ]);
});

Deno.test("Nested fragment with data", () => {
  const code = `
    <h1>Hello!</h1>
    {{ fragment first }}<span>{{ name }}</span>{{ fragment second }}<p>{{ description }}</p>{{ /fragment }}{{ /fragment }}

    {{ description }}
    `;

  const env = tmpl();
  env.use(fragments());

  {
    const tokens = env.tokenize(code, "test.vto#first");

    assertEquals(tokens, [
      [
        "string",
        "<span>",
        45,
      ],
      [
        "tag",
        "name",
        51,
      ],
      [
        "string",
        "</span><p>",
        61,
      ],
      [
        "tag",
        "description",
        92,
      ],
      [
        "string",
        "</p>",
        109,
      ],
    ]);
  }
  {
    const tokens = env.tokenize(code, "test.vto#second");

    assertEquals(tokens, [
      [
        "string",
        "<p>",
        89,
      ],
      [
        "tag",
        "description",
        92,
      ],
      [
        "string",
        "</p>",
        109,
      ],
    ]);
  }
});
