// Type definitions for assets-webpack-plugin 0.1
// Definitions by: Paul Duguet <https://github.com/oztk> (heavily based on Chase Brewer's <https://github.com/chasepbrewer>)
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import { Plugin } from "webpack";

export = AssetsPlugin;

declare class AssetsPlugin extends Plugin {
    constructor(options?: AssetsPlugin.Options)
}

declare namespace AssetsPlugin {
    interface Options {
        // An absolute path for the root.
        root?: string;
        // Write logs to console.
        verbose?: boolean;
        // Use boolean "true" to test/emulate delete. (will not remove files).
        // (Default: "false", remove files)
        dry?: boolean;
        // Instead of removing whole path recursively,
        // remove all path's content with exclusion of provided
        // immediate children. Good for not removing shared files from
        // build directories.
        exclude?: string[];
    }
}
