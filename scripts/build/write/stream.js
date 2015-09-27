/*global module,require*/

(function stream(module, require) {
    "use strict";

    var _util = require('util'),
        DuplexStream = require('stream').Duplex,
        Buffer = require('buffer').Buffer;

    var Stream = function Stream(enc) {
        this._data = '';
        this._encoding = enc;

        DuplexStream.call(this);
    };

    _util.inherits(Stream, DuplexStream);

    Stream.prototype._read = function() {
        this.unshift(this._data);
        this.push(null);
    };

    Stream.prototype._write = function(chunk, enc, next) {
        var _writeData;
        if(Buffer.isBuffer(chunk)) {
            _writeData = chunk.toString(this._encoding);
        }

        this.unshift(_writeData);

        this.emit('write', _writeData);
        next();
    };

    //Stream.prototype._read = function(data) {
    //    DuplexStream._read(data);
    //};
    //
    //Stream.prototype.

    module.exports = {
        Stream: Stream
    };

})(module, require);
