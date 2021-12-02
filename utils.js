Object.defineProperty(Array.prototype, 'chunkIt', {
    value: function (chunkSize) {
        const R = [];
        for (var i = 0; i < this.length; i += chunkSize)
            R.push(this.slice(i, i + chunkSize));
        return R;
    }
});