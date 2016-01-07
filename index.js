"use strict";

var resolve = require('resolve');
var path = require('path');

module.exports = function (options) {
    options = options || {};

    function resolver(to, from) {
        return resolve.sync(to, {
            extensions: options.extensions || ['.css', '.scss'],
            basedir: path.dirname(from)
        });
    }

    return function importer(to, from) {
        var file;
        var parsed;

        // only attempt to resolve paths beginning with a ~
        if (to.indexOf('~') === 0) {
            to = to.substr(1);
            try {
                // try to find the file with the optional underscore prefix first
                parsed = path.parse(to);
                file = resolver(path.join(parsed.dir, '_' + parsed.base), from);
            } catch (e) {
                // try to find the file without the underscore
                file = resolver(to, from);
            }
        } else {
            file = to;
        }
        return { file: file };
    }
};
