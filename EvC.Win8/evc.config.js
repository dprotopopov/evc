
// NOTE object below must be a valid JSON
window.evc = $.extend(true, window.evc, {
    "config": {
        "layoutSet": "split",
        "navigation": [
            {
                "title": "EvC",
                "onExecute": "#View1",
                "icon": "image"
            },
            {
                "title": "Mode",
                "onExecute": "#View2",
                "icon": "preferences"
            },
            {
                "title": "Help",
                "onExecute": "#Help",
                "icon": "help"
            },
            {
                "title": "About",
                "onExecute": "#About",
                "icon": "info"
            }
        ]
    }
});
