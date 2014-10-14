(function(factory) {
    var L;
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Browserify
        L = require('leaflet');
        module.exports = factory(L);
    } else {
        // Browser globals
        if (typeof window.L === 'undefined') {
            throw 'Leaflet must be loaded first';
        }
        factory(window.L);
    }
}(function(L) {

    /**
     * A shim layer to disable interactive vector features and markers
     * without having to hide or update them. It basically propagates all
     * the mouse events straight to the map, bypassing the layers
     */
    L.Shim = L.Class.extend( /** @lends {L.Shim.prototype}  */ {

        includes: L.Mixin.Events,

        options: {
            className: 'leaflet-backdrop'
        },

        /**
         * @const
         * @type {Object}
         */
        statics: {
            EVENTS: 'click dblclick mouseover mouseout mousemove ' +
                'contextmenu touchstart touchend touchmove'
        },

        /**
         * @param  {Object} options
         *
         * @constructor
         * @extends {L.Mixin.Events}
         */
        initialize: function(options) {

            /**
             * Cached anchor point
             * @type {L.Point}
             */
            this._anchor = new L.Point(0, 0);

            L.Util.setOptions(this, options);
        },

        /**
         * @param {L.Map} map
         * @return {L.Shim} [description]
         */
        addTo: function(map) {
            this._map = map;
            map.addLayer(this);
            return this;
        },

        /**
         * @param  {L.Map} map
         */
        onAdd: function(map) {
            if (!this._container) {
                this._container = L.DomUtil.create('div', this.options.className);
                map._panes.popupPane.insertBefore(this._container,
                    map._panes.popupPane.firstChild);
            }
            L.DomEvent.on(this._container,
                L.Shim.EVENTS,
                this._propagateEvents, this);

            map.on('zoomend moveend', this._update, this);

            this._update();
        },

        /**
         * @param  {L.Map} map
         * @return {L.Shim}
         */
        removeFrom: function(map) {
            map.removeLayer(this);
            return this;
        },

        /**
         * Updates dom element
         */
        _update: function() {
            var size = this._map.getSize(),
                position = this._map.containerPointToLayerPoint(this._anchor),
                style = this._container.style;

            style.cursor = this._map._container.style.cursor;
            style.width = size.x + 'px';
            style.height = size.y + 'px';

            L.DomUtil.setPosition(this._container, position);
        },

        /**
         * @param  {L.Map} map
         */
        onRemove: function(map) {
            L.DomEvent.off(this._container, L.Shim.EVENTS,
                this._propagateEvents, this);
            if (this._container) {
                this._container.parentNode.removeChild(this._container);
                this._container = null;
            }
            this._map.off('zoomend moveend', this._update, this);
        },

        /**
         * Bypass the layers
         * @param  {Event} e
         */
        _propagateEvents: function(e) {
            this._map.fire(e.type, e);
        }
    });

    return L.Shim;

}));
