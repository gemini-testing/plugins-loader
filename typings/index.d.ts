declare module "plugins-loader" {
    // An instance of test framework, e.g. hermione
    type Tool = unknown;
    type PluginOptions = Record<string, unknown>;

    export function load(tool: Tool, plugins: Record<string, boolean | PluginOptions>, prefix: string): void;
}
