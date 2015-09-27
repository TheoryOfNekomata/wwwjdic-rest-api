/*global module,require*/

(function stream(module, require) {
    "use strict";

    var _util = require('util'),
        Duplex = require('stream').Duplex,
        PassThrough = require('stream').PassThrough,
        Buffer = require('buffer').Buffer;

    var Stream = function Stream(options) {
        if(!(this instanceof Stream)) {
            return new Stream(options);
        }

        Duplex.call(this, options);
        this.inRStream = new PassThrough();
        this.outWStream = new PassThrough();
        this.leftHandlersSetup = false;

        //this._data = '';
        //this._encoding = options.encoding;
    };

    _util.inherits(Stream, Duplex);

    Stream.prototype._write = function(chunk, enc, cb) {
        this.inRStream.write(chunk, enc, cb);
    };

    Stream.prototype.setupLeftHandlers = function(n) {
        var self = this;
        self.leftHandlersSetup = true;
        self.outWStream
            .on('readable', function() {
                self.readLeft(n);
            })
            .on('end', function() {
                self.push(null);
            });
    };

    Stream.prototype.readLeft = function(n) {
        var chunk;
        while(null !== (chunk = this.outWStream.read(n))) {
            if(!this.push(chunk)) {
                break;
            }
        }
    };

    Stream.prototype._read = function(n) {
        if(!this.leftHandlersSetup) {
            return this.setupLeftHandlers(n);
        }

        this.readLeft(n);
    };

    //Stream.prototype._read = function(size) {
    //    var self = this;
    //
    //    function readable() {
    //        var chunk;
    //        while((chunk = self.outWStream.read(size))) {
    //            if(!self.push(chunk)) {
    //                break;
    //            }
    //        }
    //        self.removeListener('end', end);
    //    }
    //
    //    function end() {
    //        self.push(null);
    //        self.removeListener('readable', readable);
    //    }
    //
    //    //self.unshift(self._data);
    //    //self.push(null);
    //    self
    //        .once('readable', readable)
    //        .once('end', end);
    //};
    //
    //Stream.prototype._write = function(chunk, enc, next) {
    //    var _writeData;
    //    if(Buffer.isBuffer(chunk)) {
    //        _writeData = chunk.toString(this._encoding);
    //    }
    //
    //    this.emit('data', _writeData);
    //    this.unshift(_writeData);
    //    next(null, _writeData);
    //};

    //Stream.prototype._read = function(data) {
    //    DuplexStream._read(data);
    //};
    //
    //Stream.prototype.

    module.exports = {
        Stream: Stream
    };

})(module, require);
