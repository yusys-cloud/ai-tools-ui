# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9527

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

### Modify
- .env.develpment
- utils/request.js  return res //yzq add
- main.js
```
import Avue from '@smallwei/avue'
import AvueFormDesign from '@sscfaith/avue-form-design'
Vue.use(Avue, {
  size: 'small',
  menuType: 'text'
})
Vue.use(AvueFormDesign)
```

### Links 
- [页面缓存](https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/tags-view.html#visitedviews-cachedviews)
