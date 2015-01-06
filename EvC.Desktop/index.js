
$(function() {
    var startupView = "View1";

    DevExpress.devices.current("desktop");

    evc.app = new DevExpress.framework.html.HtmlApplication({
        namespace: evc,
        layoutSet: DevExpress.framework.html.layoutSets[evc.config.layoutSet],
        mode: "webSite",
        navigation: evc.config.navigation,
        commandMapping: evc.config.commandMapping
    });

    $(window).unload(function() {
        evc.app.saveState();
    });

    evc.app.router.register(":view/:id", { view: startupView, id: undefined });
    evc.app.navigate();
});