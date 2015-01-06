evc.View2 = function(params) {

    evc.modes = evc.modes || {
        sunny16: {
            title: 'Sunny 16 Rule',
            valueText: "100 f/16 1/100 10000",
            description: "On a sunny day set aperture to f/16 and shutter speed to the [reciprocal of the] ISO film speed [or ISO setting] for a subject in direct sunlight."
        },
        looney11: {
            title: 'Looney 11 Rule',
            valueText: "100 f/11 1/100 1",
            description: "For astronomical photos of the moon's surface, set aperture to f/11 and shutter speed to the [reciprocal of the] ISO film speed [or ISO setting]."
        },
        ground0: {
            title: 'Ground Zero',
            valueText: "0.8 f/1 1 1",
            description: "Arithmetic EV calculation."
        },
        custom: {
            title: 'Custom rule',
            description: "Define your own rule ;)"
        }
    };

    try {
        var valueText0 = localStorage.getItem("valueText0") || evc.modes.sunny16.valueText;
        evc.valueText0 = evc.valueText0 || ko.observable(valueText0); // this property will hold the data
    } catch (e) {
        evc.valueText0 = evc.valueText0 || ko.observable(evc.modes.sunny16.valueText); // this property will hold the data
    }

    try {
        var mode0 = localStorage.getItem("mode0") || "sunny16";
        evc.mode0 = evc.mode0 || ko.observable(mode0); // this property will hold the data
    } catch (e) {
        evc.mode0 = evc.mode0 || ko.observable("sunny16"); // this property will hold the data
    }

    var viewModel = {
//  Put the binding properties here

    };

    var modes = [];
    for (var k in evc.modes) {
        modes.push(String(k));
        console.log(String(k));
    }

    viewModel.radioGroupOptions = {
        items: modes.map(function(item) { return { text: evc.modes[item].title, mode: item }; }),
        layout: 'vertical',
        selectedIndex: modes.indexOf(evc.mode0()),
        value: evc.mode0,
        valueExpr: 'mode',
        onItemClick: function (e) {
            viewModel.radioGroupOptions.value(e.itemData[viewModel.radioGroupOptions.valueExpr]);
        },
    };

    viewModel.cameraOptions = {
        id: "#camera0",
        theme: 'mobiscroll',
        display: 'inline',
        showLabel: false,
        layout: 'fixed',
        mode: 'scroller',
        rows: 5,
        height: 40,
        readonly: false,
        onChange: function(newValueText0, inst) {
            if (evc.valueText0() == newValueText0) return;
            evc.valueText0(newValueText0);
        },
    };

    viewModel.textAreaOptions = {
        value: ko.computed(function() { return evc.modes[evc.mode0()].description; }, this),
        readOnly: true,
    };

    viewModel.viewShown = function() {
        viewModel.cameraOptions.readonly = (evc.mode0() != "custom");
        $.each([viewModel.cameraOptions], function(index, element) {
            element.fixedWidth = $(".dx-layout").width();
            element.maxWidth = $(".dx-layout").width();
        });

        $("#camera0").mobiscroll().cameraScroller(viewModel.cameraOptions);
        $("#camera0").mobiscroll('setValue', evc.valueText0().split(' '), true, 1);
        $("div.dw-i", $("#camera0").next()).addClass("Oswald");

        $("#toastContainer").dxToast('instance').show();
    };

    $(window).resize(function(event) {

        $.each([viewModel.cameraOptions], function(index, element) {
            element.fixedWidth = $("#scrollViewContainer").width();
            element.maxWidth = $("#scrollViewContainer").width();
            $(element.id).mobiscroll("option", 'maxWidth', element.maxWidth);
            $(element.id).mobiscroll("option", 'fixedWidth', element.fixedWidth);
            $("div.dw-i", $(element.id).next()).addClass("Oswald");
        });

    });

    $(document).ready(function(event) {

        $("div.page").addClass("Oswald");

    });

    evc.valueText0.subscribe(function(newValueText0) {
        try {
            localStorage.setItem("valueText0", newValueText0);
        } catch (e) {
        }
    });

    evc.mode0.subscribe(function(newMode0) {
        switch (newMode0) {
        case "custom":
            viewModel.cameraOptions.readonly = false;
            break;
        default:
            viewModel.cameraOptions.readonly = true;
            evc.valueText0(evc.modes[newMode0].valueText);
            break;
        }
        $('#camera0').mobiscroll('option', 'readonly', viewModel.cameraOptions.readonly);
        $("#camera0").mobiscroll('setValue', evc.valueText0().split(' '), true, 1);
        $("div.dw-i", $("#camera0").next()).addClass("Oswald");
        try {
            localStorage.setItem("mode0", newMode0);
        } catch (e) {
        }
    });

    return viewModel;
};