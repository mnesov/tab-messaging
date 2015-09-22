# tab-messaging
Crossdomain messaging between browser tabs.

#### Technical info:
To provide crosstab and crossdomain messaging used proxy.html in an iframe, appended to each page.

All that proxies should be loaded from one, main domain.

To send message to another tab, page sends it to its proxy first, using postMessage function.

Then proxy share this message between similar proxies in other tabs by localStorage change event.

And finally each proxy deliver message to its parent page by postMessage.
