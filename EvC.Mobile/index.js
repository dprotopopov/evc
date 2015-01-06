
$(function() {
    var startupView = "View1";

    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });

    if(DevExpress.devices.real().platform === "win8") {
        $("body").css("background-color", "#000");
    }

    document.addEventListener("deviceready", onDeviceReady, false);
    
    function onDeviceReady() {
        navigator.splashscreen.hide();
        if (window.devextremeaddon != null ) {
            window.devextremeaddon.setup();
        }
        document.addEventListener("backbutton", onBackButton, false);
    }

    function onBackButton() {
        DevExpress.processHardwareBackButton();
    }

    function onNavigatingBack(e) {
        if(e.isHardwareButton && !evc.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "tizen":
                tizen.application.getCurrentApplication().exit();
                break;
            case "android":
                navigator.app.exitApp();
                break;
            case "win8":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }

    evc.app = new DevExpress.framework.html.HtmlApplication({
        namespace: evc,
        layoutSet: DevExpress.framework.html.layoutSets[evc.config.layoutSet],
        navigation: evc.config.navigation,
        commandMapping: evc.config.commandMapping
    });

    $(window).unload(function() {
        evc.app.saveState();
    });

    evc.app.router.register(":view/:id", { view: startupView, id: undefined });
    evc.app.on("navigatingBack", onNavigatingBack);
    evc.app.navigate();
});