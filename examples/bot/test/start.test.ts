import { spawnSync } from "node:child_process";

import { expect, it } from "vitest";

it("loads the compiled bot and reaches Discord login without a token", () => {
  const result = spawnSync(process.execPath, ["dist/index.js"], {
    encoding: "utf8",
    env: {
      ...process.env,
      DISCORD_GUILD_ID: "123456789012345678",
      DISCORD_TOKEN: "",
    },
    timeout: 5_000,
  });

  expect(result.error).toBeUndefined();
  expect(result.status).toBe(1);
  expect(result.stderr).toContain("Error [TokenInvalid]: An invalid token was provided.");
  expect(result.stderr).toContain("at Client.login");
});
