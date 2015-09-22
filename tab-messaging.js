window.TabMessaging = window.TabMessaging || (function () {
    var locationOrigin = [location.protocol, '//', location.host, location.port ? ':' + location.port : ''].join('');

    function TabMessaging(config) {
        var self = this;
        self.origin = config.origin;
        self.path = config.path;

        self._handlers = {};
        self.proxy = buildProxy.call(self);

        window.addEventListener('message', function (e) {
            messageListener.call(self, e);
        });
    }

    TabMessaging.prototype.on = on;
    TabMessaging.prototype.send = send;

    function on(name, handler) {
        if (name && handler && typeof handler === 'function') {
            if (!this._handlers[name]) {
                this._handlers[name] = [];
            }
            this._handlers[name].push(handler);
        }
    }

    function send(name, payload) {
        if (this.isReady) {
            this.proxy.contentWindow.postMessage(JSON.stringify({ name: name, payload: payload }), this.origin);
        }
    }

    function buildProxy() {
        var proxy = document.createElement('iframe');
        var self = this;
        proxy.width = 0;
        proxy.height = 0;
        proxy.style.border = 0;
        proxy.className = 'tab-messaging';
        proxy.src = self.origin + self.path + '#' + encodeURIComponent(locationOrigin);
        proxy.addEventListener('load', function () {
            self.isReady = true;
        });
        document.body.appendChild(proxy);
        return proxy;
    }

    function messageListener(e) {
        var message,
            handlers;
        if (e.origin === this.origin) {
            message = JSON.parse(e.data);
            handlers = this._handlers[message.name];
            if (handlers) {
                handlers.forEach(function (handler) {
                    handler(message.payload);
                });
            }
        }
    }

    return TabMessaging;
})();

