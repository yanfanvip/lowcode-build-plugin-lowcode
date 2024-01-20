const SUPPORTED_COMMAND = ['start', 'build'];

const COMMON_EXTERNALS = {
  react: 'var window.React',
  'react-dom': 'var window.ReactDOM',
  'prop-types': 'var window.PropTypes',
  '@alifd/next': 'var window.Next',
  '@alifd/meet': 'var window.Meet',
  '@ali/visualengine': 'var window.VisualEngine',
  '@ali/visualengine-utils': 'var window.VisualEngineUtils',
  '@ali/lowcode-engine': 'var window.AliLowCodeEngine',
  '@alilc/lowcode-engine': 'var window.AliLowCodeEngine',
  '@ali/lowcode-rax-renderer': 'var window.alilcLowcodeRaxRenderer',
  rax: 'var window.Rax',
  antd: 'var window.antd',
  '@alifd/lowcode-preset-plugin': 'var window.PluginLowcodeEditor',
  'monaco-editor/esm/vs/editor/editor.api': 'var window.monaco',
  'monaco-editor/esm/vs/editor/editor.main.js': 'var window.monaco',
};

const ALILC_COMMON_EXTERNALS = {
  ...COMMON_EXTERNALS,
  '@alifd/lowcode-preset-plugin': 'var window.LowcodePresetPlugin',
};

const DEFAULT_GROUPS = ['精选组件', '原子组件'];
const DEFAULT_CATEGORIES = [
  '基础元素',
  '布局容器类',
  '表格类',
  '表单详情类',
  '帮助类',
  '对话框类',
  '业务类',
  '通用',
  '引导',
  '信息输入',
  '信息展示',
  '信息反馈',
];

const STATIC_RESOURCES = {
  themeVariableUrl: '/theme-lowcode-dark.variables0.6.1.css',
  themeStyleUrl: '/theme-lowcode-dark.0.6.1.css',
  engineCoreCssUrl: '/lowcode-engine_1.1.11-beta.12.css',
  enginePresetCssUrl: '/lowcode-preset-plugin.css',
  engineExtCssUrl: '/lowcode-engine-ext.1.0.6.css',
  engineCoreJsUrl: '/lowcode-engine_1.1.11-beta.12.js',
  engineExtJsUrl: '/lowcode-engine-ext.1.0.6.js',
  enginePresetJsUrl: '/lowcode-preset-plugin.js'
};

const ALILC_STATIC_RESOURCES = {
  themeVariableUrl: '/theme-lowcode-light.variables.0.2.10.css',
  themeStyleUrl: '/theme-lowcode-light.0.2.1.css',
  engineCoreCssUrl: '/lowcode-engine_1.1.11-beta.12.css',
  engineExtCssUrl: '/lowcode-engine-ext.1.0.6.css',
  enginePresetCssUrl: '/lowcode-preset-plugin.css',
  engineCoreJsUrl: '/lowcode-engine_1.1.11-beta.12.js',
  engineExtJsUrl: '/lowcode-engine-ext.1.0.6.js',
  enginePresetJsUrl: '/lowcode-preset-plugin.js',
  raxRenderJsUrl: '/lowcode-rax-renderer.1.0.18.js',
  raxRenderCssUrl: '/lowcode-rax-renderer.1.0.18.css',
};

const STATIC_RESOURCES_MAP = {
  '@ali': STATIC_RESOURCES,
  '@alilc': ALILC_STATIC_RESOURCES,
};

const COMMON_EXTERNALS_MAP = {
  '@ali': COMMON_EXTERNALS,
  '@alilc': ALILC_COMMON_EXTERNALS,
};

const BASIC_LIBRARY_VERSION = {
  '@alifd/next': '1.25.23',
  '@alifd/meet': '2.6.3',
  antd: '4.23.0',
};
const COMPONENT_PROPS = [
  'componentName',
  'title',
  'description',
  'docUrl',
  'screenshot',
  'icon',
  'tags',
  'keywards',
  'devMode',
  'npm',

  'props',
  'configure',
  'snippets',
  'group',
  'category',
  'priority',
];

const UNPKG_BASE_URL_MAP = {
  '@ali': 'https://unpkg.alibaba-inc.com',
  '@alilc': '/',
};

const META_TYPES = ['', 'dev', 'web', 'mobile', 'design', 'sketch'];

module.exports = {
  SUPPORTED_COMMAND,
  COMMON_EXTERNALS,
  ALILC_COMMON_EXTERNALS,
  COMMON_EXTERNALS_MAP,
  DEFAULT_GROUPS,
  DEFAULT_CATEGORIES,
  STATIC_RESOURCES,
  ALILC_STATIC_RESOURCES,
  STATIC_RESOURCES_MAP,
  BASIC_LIBRARY_VERSION,
  COMPONENT_PROPS,
  UNPKG_BASE_URL_MAP,
  META_TYPES,
};
