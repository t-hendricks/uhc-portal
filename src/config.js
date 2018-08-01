
var config = {
    configData: {},
    fetchConfig: function() {
        return new Promise((resolve, reject) => {
            var that = this;
            fetch("/config/config.json").then((response) => {
                return response.json();
            }).then((data) => {
                that['configData'] = data;
                resolve();
            });
        });
    }
}

export default config;