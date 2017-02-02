watchmen-plugin-statuspage
===

A plugin for [watchmen](https://github.com/iloire/watchmen) to forward status updates to [Atlassian's statuspage](https://www.statuspage.io/).

Environment variables
---

Config is set through env variables (same as with watchmen itself).

```sh
export WATCHMEN_STATUSPAGE_PAGE_ID='<your pageId>'
export WATCHMEN_STATUSPAGE_API_KEY ='<your API key>'
```

Do make sure that your service name in watchmen is identical to the component name in statuspage.io.

Keep in mind that statuspage.io's api is rate limited, see documentation [here](https://doers.statuspage.io/api/v1/).