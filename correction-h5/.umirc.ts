import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/stat', component: '@/pages/stat/index' },
  ],
  fastRefresh: {},
  proxy: {
    '/v1/stat': {
      target: 'http://example.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
});
