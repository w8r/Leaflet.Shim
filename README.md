Leaflet.Shim
============

A shim layer to disable interactive vector features and markers without having to hide or update them. It basically propagates all the mouse events straight to the map, bypassing the layers.

Particularly useful to accompany controls like [Leaflet.Measure](https://github.com/jtreml/leaflet.measure), while having some features on the map that will respond to clicks or won't propagate events essential for the drawing process.
