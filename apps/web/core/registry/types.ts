export type ModuleManifest = {
  id: string;
  name: string;
  version: string;
  enabledByDefault?: boolean;
  nav?: Array<{label: string; href: string}>;
};
