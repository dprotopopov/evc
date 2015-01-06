
$(function() {
    var startupView = "View1";


    evc.app = new DevExpress.framework.html.HtmlApplication({
        namespace: evc,
        layoutSet: DevExpress.framework.html.layoutSets[evc.config.layoutSet],
        navigation: evc.config.navigation,
        commandMapping: evc.config.commandMapping
    });

    $(window).unload(function() {
        evc.app.saveState();
    });

    evc.app.router.register(":view/:id", { view: "View1", id: undefined });
    evc.app.navigate();
});