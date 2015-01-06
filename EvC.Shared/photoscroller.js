"use strict";

(function($) {

    // The ISO arithmetic speed has a useful property for photographers without the equipment for taking a metered light reading. 
    // Correct exposure will usually be achieved for a frontlighted scene in bright sun if the aperture of the lens is set to f/16 
    // and the shutter speed is the reciprocal of the ISO film speed (e.g. 1/100 second for 100 ISO film). 
    // This known as the sunny 16 rule.
    var getEv = function(arr, arr0) {
        var lnEv = 0.0;
        var values = [];
        values.push(parseFloat(arr[0]));
        values.push(parseFloat(arr[1].split('/')[1]));
        values.push(parseFloat(arr[2].split('/')[0]));
        values.push(parseFloat(arr[2].split('/')[1] || 1));
        values.push(parseFloat(arr[3]));
        values.push(parseFloat(arr0[0]));
        values.push(parseFloat(arr0[1].split('/')[1]));
        values.push(parseFloat(arr0[2].split('/')[0]));
        values.push(parseFloat(arr0[2].split('/')[1] || 1));
        values.push(parseFloat(arr0[3]));
        $.each([1, -2, 1, -1, 1, -1, 2, -1, 1, -1], function(index, element) {
            lnEv = lnEv + Math.log(values[index]) * element;
        });
        return lnEv / Math.LN2;
    };

    var getThreeEv = function(value) {
        return Math.round(3 * parseFloat(value));
    };

    var getNthThird = function(threeEv) {
        var n = Math.abs(parseInt(threeEv));
        var q = Math.floor(n / 3);
        var r = n - 3 * q;
        var result = [];
        if (threeEv > 0) result.push("+");
        if (threeEv < 0) result.push("-");
        result.push(String(q));
        if (threeEv != 0) result.push(["<sup style='line-height: normal;'><small>" + String(r) + "</small></sup>", "<sub style='line-height: normal;'><small>" + String(3) + "</small></sub>"].join('/'));
        return result.join(' ');
    };

    var getThreeEvs = function() {
        var arr = [];
        for (var i = 1024; i > -1024; i--) arr.push(i);
        return arr;
    };

    var threeEvs = getThreeEvs();
    var nthThirds = threeEvs.map(getNthThird);

    var threeEvDefaults = {
        readonly: [true, false, false, false, false],
        ev: {
            keys: threeEvs,
            values: nthThirds
        },
    };

    var cameraDefaults = {
        readonly: false,
        // Default options for the preset

        // Film speed is found from a plot of optical density vs. log of exposure for the film, 
        // known as the D–log H curve or Hurter–Driffield curve. There typically are five regions in the curve: 
        // the base + fog, the toe, the linear region, the shoulder, and the overexposed region. 
        // For black-and-white negative film, the “speed point” m is the point on the curve where density 
        // exceeds the base + fog density by 0.1 when the negative is developed so that a point n where 
        // the log of exposure is 1.3 units greater than the exposure at point m has a density 0.8 greater 
        // than the density at point m. The exposure Hm, in lux-s, is that for point m when the specified 
        // contrast condition is satisfied. 
        iso: {
            keys: [0.8, 1, 1.2, 1.6, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12500, 16000, 20000, 25000, 32000, 40000, 50000, 64000, 80000, 100000, 125000, 160000, 200000, 250000, 320000, 400000],
            values: [
                "0.8/<sub style='line-height: normal;'><small>0°</small></sub>",
                "1/<sub style='line-height: normal;'><small>1°</small></sub>",
                "1.2/<sub style='line-height: normal;'><small>2°</small></sub>",
                "1.6/<sub style='line-height: normal;'><small>3°</small></sub>",
                "2/<sub style='line-height: normal;'><small>4°</small></sub>",
                "2.5/<sub style='line-height: normal;'><small>5°</small></sub>",
                "3/<sub style='line-height: normal;'><small>6°</small></sub>",
                "4/<sub style='line-height: normal;'><small>7°</small></sub>",
                "5/<sub style='line-height: normal;'><small>8°</small></sub>",
                "6/<sub style='line-height: normal;'><small>9°</small></sub>",
                "8/<sub style='line-height: normal;'><small>10°</small></sub>",
                "10/<sub style='line-height: normal;'><small>11°</small></sub>",
                "12/<sub style='line-height: normal;'><small>12°</small></sub>",
                "16/<sub style='line-height: normal;'><small>13°</small></sub>",
                "20/<sub style='line-height: normal;'><small>14°</small></sub>",
                "25/<sub style='line-height: normal;'><small>15°</small></sub>",
                "32/<sub style='line-height: normal;'><small>16°</small></sub>",
                "40/<sub style='line-height: normal;'><small>17°</small></sub>",
                "50/<sub style='line-height: normal;'><small>18°</small></sub>",
                "64/<sub style='line-height: normal;'><small>19°</small></sub>",
                "80/<sub style='line-height: normal;'><small>20°</small></sub>",
                "100/<sub style='line-height: normal;'><small>21°</small></sub>",
                "125/<sub style='line-height: normal;'><small>22°</small></sub>",
                "160/<sub style='line-height: normal;'><small>23°</small></sub>",
                "200/<sub style='line-height: normal;'><small>24°</small></sub>",
                "250/<sub style='line-height: normal;'><small>25°</small></sub>",
                "320/<sub style='line-height: normal;'><small>26°</small></sub>",
                "400/<sub style='line-height: normal;'><small>27°</small></sub>",
                "500/<sub style='line-height: normal;'><small>28°</small></sub>",
                "640/<sub style='line-height: normal;'><small>29°</small></sub>",
                "800/<sub style='line-height: normal;'><small>30°</small></sub>",
                "1000/<sub style='line-height: normal;'><small>31°</small></sub>",
                "1250/<sub style='line-height: normal;'><small>32°</small></sub>",
                "1600/<sub style='line-height: normal;'><small>33°</small></sub>",
                "2000/<sub style='line-height: normal;'><small>34°</small></sub>",
                "2500/<sub style='line-height: normal;'><small>35°</small></sub>",
                "3200/<sub style='line-height: normal;'><small>36°</small></sub>",
                "4000/<sub style='line-height: normal;'><small>37°</small></sub>",
                "5000/<sub style='line-height: normal;'><small>38°</small></sub>",
                "6400/<sub style='line-height: normal;'><small>39°</small></sub>",
                "8000/<sub style='line-height: normal;'><small>40°</small></sub>",
                "10000/<sub style='line-height: normal;'><small>41°</small></sub>",
                "12500/<sub style='line-height: normal;'><small>42°</small></sub>",
                "16000/<sub style='line-height: normal;'><small>43°</small></sub>",
                "20000/<sub style='line-height: normal;'><small>44°</small></sub>",
                "25000/<sub style='line-height: normal;'><small>45°</small></sub>",
                "32000/<sub style='line-height: normal;'><small>46°</small></sub>",
                "40000/<sub style='line-height: normal;'><small>47°</small></sub>",
                "50000/<sub style='line-height: normal;'><small>48°</small></sub>",
                "64000/<sub style='line-height: normal;'><small>49°</small></sub>",
                "80000/<sub style='line-height: normal;'><small>50°</small></sub>",
                "100000/<sub style='line-height: normal;'><small>51°</small></sub>",
                "125000/<sub style='line-height: normal;'><small>52°</small></sub>",
                "160000/<sub style='line-height: normal;'><small>53°</small></sub>",
                "200000/<sub style='line-height: normal;'><small>54°</small></sub>",
                "250000/<sub style='line-height: normal;'><small>55°</small></sub>",
                "320000/<sub style='line-height: normal;'><small>56°</small></sub>",
                "400000/<sub style='line-height: normal;'><small>57°</small></sub>"
            ]
        },
        lx: {
            keys: [0.000001, 0.001, 0.01, 0.1, 1, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50, 64, 80, 100, 125, 160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500, 3200, 4000, 5000, 6400, 8000, 10000, 12500, 16000, 20000, 25000, 32000, 40000, 50000, 64000, 80000, 100000, 125000, 160000, 200000, 250000, 320000, 400000, 1000000],
            values: [
                "0.000<small>lx</small> <i class='wi wi-alien'></i>",
                "0.001<small>lx</small> <i class='wi wi-stars'></i>",
                "0.010<small>lx</small> <i class='icon-moonfull'></i>",
                "0.100<small>lx</small> <i class='icon-moonfirstquarter'></i>",
                "1.000<small>lx</small> <i class='icon-moonnew'></i>",
                "2<small>lx</small> <i class='wi'></i>",
                "2.5<small>lx</small> <i class='wi'></i>",
                "3<small>lx</small> <i class='wi'></i>",
                "4<small>lx</small> <i class='wi'></i>",
                "5<small>lx</small> <i class='wi'></i>",
                "6<small>lx</small> <i class='wi'></i>",
                "8<small>lx</small> <i class='wi'></i>",
                "10<small>lx</small> <i class='icon-candle'></i>",
                "12<small>lx</small> <i class='wi'></i>",
                "16<small>lx</small> <i class='wi'></i>",
                "20<small>lx</small> <i class='wi'></i>",
                "25<small>lx</small> <i class='wi'></i>",
                "32<small>lx</small> <i class='wi'></i>",
                "40<small>lx</small> <i class='wi wi-horizon'></i>",
                "50<small>lx</small> <i class='wi'></i>",
                "64<small>lx</small> <i class='wi'></i>",
                "80<small>lx</small> <i class='wi'></i>",
                "100<small>lx</small> <i class='wi'></i>",
                "125<small>lx</small> <i class='wi'></i>",
                "160<small>lx</small> <i class='wi'></i>",
                "200<small>lx</small> <i class='wi wi-cloudy'></i>",
                "250<small>lx</small> <i class='wi'></i>",
                "320<small>lx</small> <i class='wi'></i>",
                "400<small>lx</small> <i class='wi wi-horizon-alt'></i>",
                "500<small>lx</small> <i class='wi'></i>",
                "640<small>lx</small> <i class='wi'></i>",
                "800<small>lx</small> <i class='wi'></i>",
                "1000<small>lx</small> <i class='wi wi-day-cloudy'></i>",
                "1250<small>lx</small> <i class='wi'></i>",
                "1600<small>lx</small> <i class='wi'></i>",
                "2000<small>lx</small> <i class='wi wi-day-sunny-overcast'></i>",
                "2500<small>lx</small> <i class='wi'></i>",
                "3200<small>lx</small> <i class='wi'></i>",
                "4000<small>lx</small> <i class='wi'></i>",
                "5000<small>lx</small> <i class='wi'></i>",
                "6400<small>lx</small> <i class='wi'></i>",
                "8000<small>lx</small> <i class='wi'></i>",
                "10000<small>lx</small> <i class='wi wi-solar-eclipse'></i>",
                "12500<small>lx</small> <i class='wi'></i>",
                "16000<small>lx</small> <i class='wi'></i>",
                "20000<small>lx</small> <i class='wi'></i>",
                "25000<small>lx</small> <i class='wi'></i>",
                "32000<small>lx</small> <i class='wi'></i>",
                "40000<small>lx</small> <i class='wi'></i>",
                "50000<small>lx</small> <i class='wi'></i>",
                "64000<small>lx</small> <i class='wi'></i>",
                "80000<small>lx</small> <i class='wi'></i>",
                "100000<small>lx</small> <i class='wi wi-day-sunny'></i>",
                "125000<small>lx</small> <i class='wi'></i>",
                "160000<small>lx</small> <i class='wi'></i>",
                "200000<small>lx</small> <i class='wi'></i>",
                "250000<small>lx</small> <i class='wi'></i>",
                "320000<small>lx</small> <i class='wi'></i>",
                "400000<small>lx</small> <i class='wi'></i>",
                "1000000<small>lx</small> <i class='wi wi-lightning'></i>"
            ]
        },
        // The effective f-number is proportional to the ratio between the lens focal length and aperture diameter, 
        // the diameter itself being proportional to the square root of the aperture area. 
        // Thus, a lens set to f/1.4 allows twice as much light to strike the focal plane as a lens set to f/2. 
        // Therefore, each f-number factor of the square root of two (approximately 1.4) is also a stop, 
        // so lenses are typically marked in that progression: f/1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32, etc.
        aperture: {
            keys: ["f/1", "f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16", "f/18", "f/22", "f/32", "f/45", "f/64"],
            values: [
                "<sup style='line-height: normal;'><small>f</small></sup>/1",
                "<sup style='line-height: normal;'><small>f</small></sup>/1.4",
                "<sup style='line-height: normal;'><small>f</small></sup>/2",
                "<sup style='line-height: normal;'><small>f</small></sup>/2.8",
                "<sup style='line-height: normal;'><small>f</small></sup>/4",
                "<sup style='line-height: normal;'><small>f</small></sup>/5.6",
                "<sup style='line-height: normal;'><small>f</small></sup>/8",
                "<sup style='line-height: normal;'><small>f</small></sup>/11",
                "<sup style='line-height: normal;'><small>f</small></sup>/16",
                "<sup style='line-height: normal;'><small>f</small></sup>/18",
                "<sup style='line-height: normal;'><small>f</small></sup>/22",
                "<sup style='line-height: normal;'><small>f</small></sup>/32",
                "<sup style='line-height: normal;'><small>f</small></sup>/45",
                "<sup style='line-height: normal;'><small>f</small></sup>/64"
            ]
        },
        shutter: {
            keys: ["60", "45", "30", "15", "10", "5", "4", "3", "2", "1", "1/2", "1/3", "1/4", "1/5", "1/8", "1/10", "1/15", "1/30", "1/50", "1/60", "1/100", "1/125", "1/200", "1/250", "1/300", "1/400", "1/500", "1/600", "1/800", "1/1000"],
            values: [
                "60<small>s</small>",
                "45<small>s</small>",
                "30<small>s</small>",
                "15<small>s</small>",
                "10<small>s</small>",
                "5<small>s</small>",
                "4<small>s</small>",
                "3<small>s</small>",
                "2<small>s</small>",
                "1<small>s</small>",
                "<sup style='line-height: normal;'><small>1</small></sup>/2<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/3<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/4<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/5<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/8<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/10<small>s</small> <span class='glyphicons glyphicons-person'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/15<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/30<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/50<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/60<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/100<small>s</small> <span class='glyphicons glyphicons-person-walking'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/125<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/200<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/250<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/300<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/400<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/500<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/600<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/800<small>s</small> <span class='glyphicons'></span>",
                "<sup style='line-height: normal;'><small>1</small></sup>/1000<small>s</small> <span class='glyphicons glyphicons-person-running'></span>"
            ]
        },
    };

    var defaults = $.extend({
        readonly: [true, false, false, false, false],
    }, threeEvDefaults, cameraDefaults);

    var threeEvWheels = [
        [
            // Wheel groups array 
            // First wheel group
            {
                // Wheel object
                label: 'ev',
                keys: defaults.ev.keys,
                values: defaults.ev.values,
            },
        ]
    ];

    var cameraWheels = [
        [
            // Wheel groups array 
            // First wheel group
            {
                // Wheel object
                label: 'iso',
                keys: defaults.iso.keys,
                values: defaults.iso.values,
            },
            {
                // Wheel object
                label: 'aperture',
                keys: defaults.aperture.keys,
                values: defaults.aperture.values,
            },
            {
                // Wheel object
                label: 'shutter',
                keys: defaults.shutter.keys,
                values: defaults.shutter.values,
            },
            {
                // Wheel object
                label: 'lx',
                keys: defaults.lx.keys,
                values: defaults.lx.values,
            }
        ]
    ];
    var wheels = [threeEvWheels[0].concat(cameraWheels[0])];

    $.mobiscroll.presets.scroller.photoScroller = function(inst) {
        var orig = $.extend({}, inst.settings), // Make a copy of the original settings
            s = $.extend(inst.settings, defaults, orig), // Extend settings with preset defaults 
            elm = $(this); // 'this' refers to the DOM element on which the plugin is called
        // Custom preset logic which is executed
        // when the scroller instance is created, 
        // e.g. create the custom wheels

        return {
            // Typically a preset defines the 'wheels', 'formatResult', and 'parseValue' settings
            wheels: wheels,
            formatResult: function(data) {
                return data.join(' ');
            },
            parseValue: function() {
                return elm.val().split(' ');
            },
            // The preset may override any other core settings
            headerText: false
        };
    };

    $.mobiscroll.presets.scroller.threeEvScroller = function(inst) {
        var orig = $.extend({}, inst.settings), // Make a copy of the original settings
            s = $.extend(inst.settings, threeEvDefaults, orig), // Extend settings with preset defaults 
            elm = $(this); // 'this' refers to the DOM element on which the plugin is called
        // Custom preset logic which is executed
        // when the scroller instance is created, 
        // e.g. create the custom wheels

        return {
            // Typically a preset defines the 'wheels', 'formatResult', and 'parseValue' settings
            wheels: threeEvWheels,
            formatResult: function(data) {
                return data.join(' ');
            },
            parseValue: function() {
                return elm.val().split(' ');
            },
            // The preset may override any other core settings
            headerText: false
        };
    };

    $.mobiscroll.presets.scroller.cameraScroller = function(inst) {
        var orig = $.extend({}, inst.settings), // Make a copy of the original settings
            s = $.extend(inst.settings, cameraDefaults, orig), // Extend settings with preset defaults 
            elm = $(this); // 'this' refers to the DOM element on which the plugin is called
        // Custom preset logic which is executed
        // when the scroller instance is created, 
        // e.g. create the custom wheels

        return {
            // Typically a preset defines the 'wheels', 'formatResult', and 'parseValue' settings
            wheels: cameraWheels,
            formatResult: function(data) {
                return data.join(' ');
            },
            parseValue: function() {
                return elm.val().split(' ');
            },
            // The preset may override any other core settings
            headerText: false
        };
    };

    // Add this line if you want to be able to use your preset like 
    // $('#selector').mobiscroll().photoscroller() as a shorthand for 
    // $('#selector').mobiscroll({ preset: 'photoscroller' })
    $.mobiscroll.presetShort('photoScroller');
    $.mobiscroll.presetShort('threeEvScroller');
    $.mobiscroll.presetShort('cameraScroller');

    $.photoScroller = $.photoScroller || {};
    $.photoScroller.defaults = defaults;
    $.photoScroller.getEv = getEv;
    $.photoScroller.getThreeEv = getThreeEv;
    $.photoScroller.getNthThird = getNthThird;

})(jQuery);