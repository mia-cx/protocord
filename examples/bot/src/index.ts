import {
  createAuthorizationService,
  createDiscordAuthorizationContext,
  createDiscordUserSubject,
} from "@protocord/permissions";
import { createSettingsRuntime, defineSettings } from "@protocord/settings";
import {
  Client,
  Events,
  GatewayIntentBits,
  SlashCommandBuilder,
  type Interaction,
} from "discord.js";
import {
  createActionRegistry,
  createDiscordInteractionProviders,
  getDiscordCommandRegistration,
  handleDiscordInteraction,
  slashCommand,
} from "protocord";

const guildId = process.env.DISCORD_GUILD_ID;
if (!guildId) throw new Error("Set DISCORD_GUILD_ID to your test server's ID.");

const permissions = createAuthorizationService({
  validateResource: ({ context }) => context.guildId === guildId,
  store: {
    listForContext: async () => [],
    listForObject: async () => [],
    upsert: async () => {
      throw new Error("This example has no custom rules.");
    },
    remove: async () => {
      throw new Error("This example has no custom rules.");
    },
  },
});

let count = 0;
const settings = createSettingsRuntime({
  definition: defineSettings<Interaction>({
    title: "Example bot settings",
    categories: [{
      id: "general",
      label: "General",
      authorize: async (interaction) => {
        if (!interaction.inCachedGuild() || interaction.guildId !== guildId) {
          return false;
        }
        const context = createDiscordAuthorizationContext({
          guild: interaction.guild,
        });
        const decision = await permissions.check({
          context,
          subject: createDiscordUserSubject(interaction.member, context),
          object: { objectType: "settings", objectId: "*" },
          verb: "manage",
        });
        return decision.allowed;
      },
      fields: [{
        kind: "button",
        id: "counter",
        label: "Counter",
        load: () => ({ value: String(count), buttonLabel: "Add one" }),
        mutate: () => {
          count += 1;
        },
      }],
    }],
  }),
  onError: console.error,
});

const actions = createActionRegistry({
  providers: createDiscordInteractionProviders(),
});
actions.registerAction({
  name: "ping",
  description: "Check that the bot responds",
  input: { parse: () => null, jsonSchema: { type: "null" } },
  triggers: [slashCommand({
    name: "ping",
    description: "Check that the bot responds",
    parse: () => null,
  })],
  availability: () => ({ available: true }),
  authorization: () => undefined,
  execute: async () => "Pong!",
});

const settingsCommand = new SlashCommandBuilder()
  .setName("settings")
  .setDescription("Open the example bot settings");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (readyClient) => {
  void (async () => {
    const guild = await readyClient.guilds.fetch(guildId);
    const commands = [
      ...getDiscordCommandRegistration(actions),
      settingsCommand.toJSON(),
    ];
    for (const command of commands) {
      await guild.commands.create(command);
    }
    console.log("Ready. Try /ping or /settings in your test server.");
  })().catch((error: unknown) => {
    console.error(error);
    readyClient.destroy();
    process.exitCode = 1;
  });
});
client.on(Events.InteractionCreate, (interaction) => {
  if (interaction.guildId !== guildId) return;
  void (async () => {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === "settings"
    ) {
      await settings.open(interaction, interaction, { categoryId: "general" });
    } else if (settings.matches(interaction)) {
      await settings.handle(interaction, interaction);
    } else {
      await handleDiscordInteraction(actions, interaction, undefined);
    }
  })().catch(console.error);
});

await client.login(process.env.DISCORD_TOKEN);
