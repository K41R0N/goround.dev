/**
 * Type definitions for the Electron API exposed via contextBridge
 */
export interface ElectronAPI {
  // Platform detection
  platform: NodeJS.Platform;
  isElectron: true;

  // File dialogs
  dialog: {
    openFile: (options?: {
      title?: string;
      filters?: { name: string; extensions: string[] }[];
      multiple?: boolean;
    }) => Promise<string[] | null>;
    saveFile: (options?: {
      title?: string;
      defaultPath?: string;
      filters?: { name: string; extensions: string[] }[];
    }) => Promise<string | null>;
    openFolder: (options?: {
      title?: string;
      defaultPath?: string;
    }) => Promise<string | null>;
  };

  // File system operations
  fs: {
    readFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
    readBinaryFile: (filePath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
    writeFile: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>;
    writeBinaryFile: (filePath: string, base64Data: string) => Promise<{ success: boolean; error?: string }>;
    deleteFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
    exists: (filePath: string) => Promise<boolean>;
    readDir: (dirPath: string) => Promise<{
      success: boolean;
      data?: { name: string; isDirectory: boolean; isFile: boolean }[];
      error?: string;
    }>;
    mkdir: (dirPath: string) => Promise<{ success: boolean; error?: string }>;
    rmdir: (dirPath: string) => Promise<{ success: boolean; error?: string }>;
  };

  // App paths
  app: {
    getPath: (name: 'userData' | 'documents' | 'downloads' | 'home') => Promise<string>;
    getProjectsPath: () => Promise<string>;
    getTemplatesPath: () => Promise<string>;
    getFontsPath: () => Promise<string>;
  };

  // Shell operations
  shell: {
    openPath: (filePath: string) => Promise<string>;
    showItemInFolder: (filePath: string) => void;
    openExternal: (url: string) => Promise<void>;
  };

  // Export operations
  export: {
    saveSvg: (options: {
      svgContent: string;
      defaultName: string;
      projectPath?: string;
    }) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
    saveProjectFolder: (options: {
      projectName: string;
      carousels: {
        name: string;
        slides: { name: string; svgContent: string }[];
      }[];
    }) => Promise<{ success: boolean; exportPath?: string; canceled?: boolean; error?: string }>;
  };

  // Import operations
  import: {
    figmaSvg: () => Promise<{
      success: boolean;
      files?: { name: string; path: string; content: string }[];
      canceled?: boolean;
      error?: string;
    }>;
  };

  // Recent files
  recent: {
    get: () => Promise<{ path: string; name: string; timestamp: number }[]>;
    add: (projectPath: string, projectName: string) => Promise<{ success: boolean; error?: string }>;
    clear: () => Promise<{ success: boolean; error?: string }>;
  };

  // Menu event listeners
  onMenuEvent: (channel: string, callback: () => void) => () => void;
}

// Extend the Window interface globally
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
