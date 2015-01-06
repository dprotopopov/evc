evc.View1 = function(params) {

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

    // The ISO arithmetic speed has a useful property for photographers without the equipment for taking a metered light reading. 
    // Correct exposure will usually be achieved for a frontlighted scene in bright sun if the aperture of the lens is set to f/16 
    // and the shutter speed is the reciprocal of the ISO film speed (e.g. 1/100 second for 100 ISO film). 
    // This known as the sunny 16 rule.
    var getEv = $.photoScroller.getEv;
    var getThreeEv = $.photoScroller.getThreeEv;

    var viewModel = {
        //  Put the binding properties here
        title: ko.computed(function() { return evc.modes[evc.mode0()].title; }, this),
        valueText: ko.observable(evc.valueText0()), // this property will hold the data
        threeEv: ko.observable(String(0)),
        isoCheckBoxState: ko.observable(false),
        apertureCheckBoxState: ko.observable(false),
        shutterCheckBoxState: ko.observable(false),
        lxCheckBoxState: ko.observable(false),
    };

    var updateValues = function(newThreeEv, newValueText, arr) {
        var bools = [];
        bools.push(viewModel.valueText() != newValueText);
        bools.push(viewModel.threeEv() != newThreeEv);
        bools.push(bools[0] || bools[1]);
        if (bools[0]) viewModel.valueText(newValueText);
        if (bools[1]) viewModel.threeEv(newThreeEv);
        bools[0] = bools[0] && $("#camera").mobiscroll('getInst') && $("#camera").val() != arr.join(' ');
        bools[1] = bools[1] && $("#threeEv").mobiscroll('getInst') && $("#threeEv").val() != [newThreeEv].join(' ');
        bools[2] = bools[2] && $("#scroller").mobiscroll('getInst') && $("#scroller").val() != [newThreeEv].concat(arr).join(' ');
        if (bools[0]) $("#camera").mobiscroll('setValue', arr, true, 1);
        if (bools[1]) $("#threeEv").mobiscroll('setValue', [newThreeEv], true, 1);
        if (bools[2]) $("#scroller").mobiscroll('setValue', [newThreeEv].concat(arr), true, 1);
    };

    var scrollerDefaults = {
        theme: 'mobiscroll',
        display: 'inline',
        layout: 'fixed',
        mode: 'scroller',
        showLabel: false,
        rows: 5,
        height: 40,
    };

    viewModel.scrollerOptions = $.extend({
        id: "#scroller",
        readonly: [true, false, false, false, false],
        onChange: function(newValueText, inst) {
            var arr0 = evc.valueText0().split(' ');
            var arr = newValueText.split(' ');
            arr.shift();
            newValueText = arr.join(' ');
            var newThreeEv = String(getThreeEv(getEv(arr, arr0)));
            updateValues(newThreeEv, newValueText, arr);
        },
    }, scrollerDefaults);

    viewModel.cameraOptions = $.extend({
        id: "#camera",
        readonly: false,
        onChange: function(newValueText, inst) {
            var arr0 = evc.valueText0().split(' ');
            var arr = newValueText.split(' ');
            var newThreeEv = String(getThreeEv(getEv(arr, arr0)));
            updateValues(newThreeEv, newValueText, arr);
        },
    }, scrollerDefaults);

    viewModel.threeEvOptions = $.extend({
        id: "#threeEv",
        readonly: true,
    }, scrollerDefaults);

    var switchDefaults = {
        onHtml: "<span class='fa fa-2x fa-unlock'></span>",
        offHtml: "<span class='fa fa-2x fa-lock'></span>",
        hint: "Lock/unlock",
        activeStateEnabled: false,
        width: '100%',
    };

    viewModel.dummyCheckBox = {
        activeStateEnabled: false,
    };

    var switches = [
        {
            html: ko.computed(function() { return viewModel.isoCheckBoxState() ? switchDefaults.onHtml : switchDefaults.offHtml; }, viewModel),
            value: viewModel.isoCheckBoxState,
            onClick: function() { viewModel.isoCheckBoxState(!viewModel.isoCheckBoxState()); },
        },
        {
            html: ko.computed(function() { return viewModel.apertureCheckBoxState() ? switchDefaults.onHtml : switchDefaults.offHtml; }, viewModel),
            value: viewModel.apertureCheckBoxState,
            onClick: function() { viewModel.apertureCheckBoxState(!viewModel.apertureCheckBoxState()); },
        },
        {
            html: ko.computed(function() { return viewModel.shutterCheckBoxState() ? switchDefaults.onHtml : switchDefaults.offHtml; }, viewModel),
            value: viewModel.shutterCheckBoxState,
            onClick: function() { viewModel.shutterCheckBoxState(!viewModel.shutterCheckBoxState()); },
        },
        {
            html: ko.computed(function() { return viewModel.lxCheckBoxState() ? switchDefaults.onHtml : switchDefaults.offHtml; }, viewModel),
            value: viewModel.lxCheckBoxState,
            onClick: function() { viewModel.lxCheckBoxState(!viewModel.lxCheckBoxState()); },
        }
    ];

    var buttonDefaults = {
        width: '100%',
        activeStateEnabled: false,
        setLx: function(value) {
            var inst = $('#scroller').mobiscroll('getInst');
            var arr0 = evc.valueText0().split(' ');
            var arr = viewModel.valueText().split(' ');
            var index = inst.settings.lx.keys.indexOf(parseFloat(value));
            arr[3] = String(inst.settings.lx.keys[index]);
            var newValueText = arr.join(' ');
            var newThreeEv = String(getThreeEv(getEv(arr, arr0)));
            updateValues(newThreeEv, newValueText, arr);
        },
    };
    var buttons = [
        {
            hint: "Bright sun",
            html: "<i style='font-size: 2em;' class='wi wi-day-sunny'></i>",
            onClick: function() { buttonDefaults.setLx(100000); },
        },
        {
            hint: "Sunny day",
            html: "<i style='font-size: 2em;' class='wi wi-solar-eclipse'></i>",
            onClick: function() { buttonDefaults.setLx(10000); },
        },
        {
            hint: "Day",
            html: "<i style='font-size: 2em;' class='wi wi-day-cloudy'></i>",
            onClick: function() { buttonDefaults.setLx(1000); },
        },
        {
            hint: "Cloudy day",
            html: "<i style='font-size: 2em;' class='wi wi-cloudy'></i>",
            onClick: function() { buttonDefaults.setLx(200); },
        },
        {
            hint: "Sunset/sunrise",
            html: "<i style='font-size: 2em;' class='wi wi-horizon'></i>",
            onClick: function() { buttonDefaults.setLx(40); },
        },
        {
            hint: "Candle",
            html: "<i style='font-size: 2em;' class='icon-candle'></i>",
            onClick: function() { buttonDefaults.setLx(10); },
        },
        {
            hint: "Moon",
            html: "<i style='font-size: 2em;' class='wi wi-night-clear'></i>",
            onClick: function() { buttonDefaults.setLx(1); },
        },
        {
            hint: "Stars",
            html: "<i style='font-size: 2em;' class='wi wi-stars'></i>",
            onClick: function() { buttonDefaults.setLx(0.001); },
        }
    ];

    viewModel.switchToolbarOptions4 = {
        height: '1em',
        items: switches.map(function(item) { return $.extend(item, switchDefaults); }),
        onItemClick: function(e) {
            e.itemData.onClick();
            $(e.itemElement).removeClass("dx-tab-selected");
        },
    };

    viewModel.switchToolbarOptions5 = {
        height: '1em',
        items: [viewModel.dummyCheckBox].concat(viewModel.switchToolbarOptions4.items),
        onItemClick: function(e) {
            e.itemData.onClick();
            $(e.itemElement).removeClass("dx-tab-selected");
        },
    };

    viewModel.buttonToolbarOptions = {
        height: '1em',
        items: buttons.map(function(item) { return $.extend(item, buttonDefaults); }),
        onItemClick: function(e) {
            e.itemData.onClick();
            $(e.itemElement).removeClass("dx-tab-selected");
        },
    };

    var forecastHeight = function() {
        return $(window).innerHeight()
            - $("header").outerHeight(true)
            - $(".main-menu").outerHeight(true)
            - $(".toolbar").outerHeight(true)
            - 2 * $("#buttons").outerHeight(true)
            - $("footer").outerHeight(true)
            - 40;
    };

    var setValue = function() {
        var arr0 = evc.valueText0().split(' ');
        var arr = viewModel.valueText().split(' ');
        var threeEv = String(getThreeEv(getEv(arr, arr0)));
        $("#scroller").mobiscroll('setValue', [threeEv].concat(arr), true, 1);
        $("#threeEv").mobiscroll('setValue', [threeEv], true, 1);
        $("#camera").mobiscroll('setValue', arr, true, 1);
    };

    var setOpientation = function() {
        if ($(window).width() >= $(window).height()) {
            $("#byColumn").hide();
            $("#byRow").show();
        } else {
            $("#byColumn").show();
            $("#byRow").hide();
        }
    };

    var greyDraw = function() {
        $.each(["#scroller", "#threeEv"], function(index, element) {
            var $items = $("div.dw-ul:first div.dw-i", $(element).next());
            var half = Math.floor($items.length / 2);
            $items.each(function(index, element) {
                $(element).css("position", "relative");
                if (index > half) $(element).css("color", "#eeeeee");
                var grey = 128 - Math.floor(256 * Math.atan(index - half) / Math.PI);
                var color = $("<div></div>").appendTo(element);
                $(color).css("position", "absolute");
                $(color).css("left", "1px");
                $(color).css("right", "1px");
                $(color).css("top", "1px");
                $(color).css("bottom", "1px");
                $(color).css("z-index", "-1000");
                $(color).css("background-color", "rgb(" + grey + "," + grey + "," + grey + ")");
            });
        });
    };
    viewModel.viewShown = function() {
        var height = forecastHeight();
        var rows = Math.max(4, parseInt(height / 40)) - 2;

        viewModel.scrollerOptions.rows = rows;
        viewModel.cameraOptions.rows = parseInt(rows / 2);
        viewModel.threeEvOptions.rows = rows - parseInt(rows / 2);

        $.each([viewModel.scrollerOptions, viewModel.threeEvOptions, viewModel.cameraOptions], function(index, element) {
            element.height = Math.max(32, parseInt(height / (rows + 2)));
            element.fixedWidth = $(".dx-layout").width();
            element.maxWidth = $(".dx-layout").width();
        });

        $("#scroller").mobiscroll().photoScroller(viewModel.scrollerOptions);
        $("#threeEv").mobiscroll().threeEvScroller(viewModel.threeEvOptions);
        $("#camera").mobiscroll().cameraScroller(viewModel.cameraOptions);

        $.each([viewModel.scrollerOptions, viewModel.threeEvOptions, viewModel.cameraOptions], function(index, element) {
            $("div.dw-i", $(element.id).next()).addClass("Oswald");
        });

        setValue();
        greyDraw();
        setOpientation();

        $("#toastContainer").dxToast('instance').show();
    };

    $(window).resize(function(event) {
        var height = forecastHeight();
        var rows = Math.max(4, parseInt(height / 40)) - 2;

        viewModel.scrollerOptions.rows = rows;
        viewModel.cameraOptions.rows = parseInt(rows / 2);
        viewModel.threeEvOptions.rows = rows - parseInt(rows / 2);

        $.each([viewModel.scrollerOptions, viewModel.threeEvOptions, viewModel.cameraOptions], function(index, element) {
            element.height = Math.max(32, parseInt(height / (rows + 2)));
            element.fixedWidth = $("#scrollViewContainer").width();
            element.maxWidth = $("#scrollViewContainer").width();
            $(element.id).mobiscroll("option", 'maxWidth', element.maxWidth);
            $(element.id).mobiscroll("option", 'fixedWidth', element.fixedWidth);
            $(element.id).mobiscroll("option", 'rows', element.rows);
            $(element.id).mobiscroll("option", 'height', element.height);
            $("div.dw-i", $(element.id).next()).addClass("Oswald");
        });

        setValue();
        greyDraw();
        setOpientation();

    });

    $(document).ready(function(event) {

        $("div.page").addClass("Oswald");

        var checkBoxStates = switches.map(function(item) { return item.value; });

        var keys = [
            $.photoScroller.defaults.iso.keys.map(function(item) { return String(item); }),
            $.photoScroller.defaults.aperture.keys.map(function(item) { return String(item); }),
            $.photoScroller.defaults.shutter.keys.map(function(item) { return String(item); }),
            $.photoScroller.defaults.lx.keys.map(function(item) { return String(item); })
        ];

        viewModel.timer = setInterval(function() {
            var inst = $('#scroller').mobiscroll('getInst');
            if (inst == 'undefined' || !inst) return;
            var settings = inst.settings;
            if (settings == 'undefined' || !settings) return;
            var deltaLt = [+1, -1, -1, +1];
            var deltaGt = [-1, +1, +1, -1];
            var newValueText = viewModel.valueText();
            var arr0 = evc.valueText0().split(' ');
            var arr = viewModel.valueText().split(' ');
            var threeEv = getThreeEv(getEv(arr, arr0));
            var newThreeEv = String(threeEv);
            $.each(checkBoxStates, function (i, element) {
                if (element()) {
                    var index = keys[i].indexOf(arr[i]);
                    if (threeEv < 0) index = Math.min(Math.max(0, index + deltaLt[i]), keys[i].length - 1);
                    if (threeEv > 0) index = Math.min(Math.max(0, index + deltaGt[i]), keys[i].length - 1);
                    arr[i] = String(keys[i][index]);
                    threeEv = getThreeEv(getEv(arr, arr0));
                    newThreeEv = String(threeEv);
                    newValueText = arr.join(' ');
                    console.log(newValueText + ":" + newThreeEv);
                }
            });
            updateValues(newThreeEv, newValueText, arr);
        }, 100);
    });

    evc.valueText0.subscribe(function(newValueText0) {
        var arr0 = newValueText0.split(' ');
        var arr = viewModel.valueText().split(' ');
        var newThreeEv = String(getThreeEv(getEv(arr, arr0)));
        viewModel.threeEv(newThreeEv);
        $("#scroller").mobiscroll('setValue', [newThreeEv].concat(arr), true, 1);
        $("#threeEv").mobiscroll('setValue', [newThreeEv], true, 1);
        $("#camera").mobiscroll('setValue', arr, true, 1);
    });

    return viewModel;
};