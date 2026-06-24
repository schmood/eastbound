/* wiki.js — deterministic Wikimedia Commons direct-image URL builder.
   Lets us reference any Commons file by name and get a CDN-served thumb URL
   (which renders + screenshots reliably, unlike the Special:FilePath redirect). */
(function (global) {
  function md5(str) {
    function rl(n, c) { return (n << c) | (n >>> (32 - c)); }
    function au(x, y) { var l = (x & 0xFFFF) + (y & 0xFFFF); var m = (x >> 16) + (y >> 16) + (l >> 16); return (m << 16) | (l & 0xFFFF); }
    function cmn(q, a, b, x, s, t) { return au(rl(au(au(a, q), au(x, t)), s), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function tb(s) { var n = s.length, arr = []; for (var i = 0; i < n * 8; i += 8) { arr[i >> 5] |= (s.charCodeAt(i / 8) & 0xFF) << (i % 32); } return arr; }
    function utf8(s) { return unescape(encodeURIComponent(s)); }
    function rh(num) { var s = '', j; for (j = 0; j <= 3; j++) { s += ((num >> (j * 8 + 4)) & 0x0F).toString(16) + ((num >> (j * 8)) & 0x0F).toString(16); } return s; }
    var x = tb(utf8(str)); var len = utf8(str).length * 8;
    x[len >> 5] |= 0x80 << (len % 32); x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
      var oa = a, ob = b, oc = c, od = d;
      a = ff(a, b, c, d, x[i + 0] || 0, 7, -680876936); d = ff(d, a, b, c, x[i + 1] || 0, 12, -389564586); c = ff(c, d, a, b, x[i + 2] || 0, 17, 606105819); b = ff(b, c, d, a, x[i + 3] || 0, 22, -1044525330);
      a = ff(a, b, c, d, x[i + 4] || 0, 7, -176418897); d = ff(d, a, b, c, x[i + 5] || 0, 12, 1200080426); c = ff(c, d, a, b, x[i + 6] || 0, 17, -1473231341); b = ff(b, c, d, a, x[i + 7] || 0, 22, -45705983);
      a = ff(a, b, c, d, x[i + 8] || 0, 7, 1770035416); d = ff(d, a, b, c, x[i + 9] || 0, 12, -1958414417); c = ff(c, d, a, b, x[i + 10] || 0, 17, -42063); b = ff(b, c, d, a, x[i + 11] || 0, 22, -1990404162);
      a = ff(a, b, c, d, x[i + 12] || 0, 7, 1804603682); d = ff(d, a, b, c, x[i + 13] || 0, 12, -40341101); c = ff(c, d, a, b, x[i + 14] || 0, 17, -1502002290); b = ff(b, c, d, a, x[i + 15] || 0, 22, 1236535329);
      a = gg(a, b, c, d, x[i + 1] || 0, 5, -165796510); d = gg(d, a, b, c, x[i + 6] || 0, 9, -1069501632); c = gg(c, d, a, b, x[i + 11] || 0, 14, 643717713); b = gg(b, c, d, a, x[i + 0] || 0, 20, -373897302);
      a = gg(a, b, c, d, x[i + 5] || 0, 5, -701558691); d = gg(d, a, b, c, x[i + 10] || 0, 9, 38016083); c = gg(c, d, a, b, x[i + 15] || 0, 14, -660478335); b = gg(b, c, d, a, x[i + 4] || 0, 20, -405537848);
      a = gg(a, b, c, d, x[i + 9] || 0, 5, 568446438); d = gg(d, a, b, c, x[i + 14] || 0, 9, -1019803690); c = gg(c, d, a, b, x[i + 3] || 0, 14, -187363961); b = gg(b, c, d, a, x[i + 8] || 0, 20, 1163531501);
      a = gg(a, b, c, d, x[i + 13] || 0, 5, -1444681467); d = gg(d, a, b, c, x[i + 2] || 0, 9, -51403784); c = gg(c, d, a, b, x[i + 7] || 0, 14, 1735328473); b = gg(b, c, d, a, x[i + 12] || 0, 20, -1926607734);
      a = hh(a, b, c, d, x[i + 5] || 0, 4, -378558); d = hh(d, a, b, c, x[i + 8] || 0, 11, -2022574463); c = hh(c, d, a, b, x[i + 11] || 0, 16, 1839030562); b = hh(b, c, d, a, x[i + 14] || 0, 23, -35309556);
      a = hh(a, b, c, d, x[i + 1] || 0, 4, -1530992060); d = hh(d, a, b, c, x[i + 4] || 0, 11, 1272893353); c = hh(c, d, a, b, x[i + 7] || 0, 16, -155497632); b = hh(b, c, d, a, x[i + 10] || 0, 23, -1094730640);
      a = hh(a, b, c, d, x[i + 13] || 0, 4, 681279174); d = hh(d, a, b, c, x[i + 0] || 0, 11, -358537222); c = hh(c, d, a, b, x[i + 3] || 0, 16, -722521979); b = hh(b, c, d, a, x[i + 6] || 0, 23, 76029189);
      a = hh(a, b, c, d, x[i + 9] || 0, 4, -640364487); d = hh(d, a, b, c, x[i + 12] || 0, 11, -421815835); c = hh(c, d, a, b, x[i + 15] || 0, 16, 530742520); b = hh(b, c, d, a, x[i + 2] || 0, 23, -995338651);
      a = ii(a, b, c, d, x[i + 0] || 0, 6, -198630844); d = ii(d, a, b, c, x[i + 7] || 0, 10, 1126891415); c = ii(c, d, a, b, x[i + 14] || 0, 15, -1416354905); b = ii(b, c, d, a, x[i + 5] || 0, 21, -57434055);
      a = ii(a, b, c, d, x[i + 12] || 0, 6, 1700485571); d = ii(d, a, b, c, x[i + 3] || 0, 10, -1894986606); c = ii(c, d, a, b, x[i + 10] || 0, 15, -1051523); b = ii(b, c, d, a, x[i + 1] || 0, 21, -2054922799);
      a = ii(a, b, c, d, x[i + 8] || 0, 6, 1873313359); d = ii(d, a, b, c, x[i + 15] || 0, 10, -30611744); c = ii(c, d, a, b, x[i + 6] || 0, 15, -1560198380); b = ii(b, c, d, a, x[i + 13] || 0, 21, 1309151649);
      a = ii(a, b, c, d, x[i + 4] || 0, 6, -145523070); d = ii(d, a, b, c, x[i + 11] || 0, 10, -1120210379); c = ii(c, d, a, b, x[i + 2] || 0, 15, 718787259); b = ii(b, c, d, a, x[i + 9] || 0, 21, -343485551);
      a = au(a, oa); b = au(b, ob); c = au(c, oc); d = au(d, od);
    }
    return rh(a) + rh(b) + rh(c) + rh(d);
  }

  // Build a CDN thumb URL for a Wikimedia Commons file name.
  function wikiImg(filename, width) {
    if (!filename) return null;
    var fn = filename.replace(/ /g, '_');
    var h = md5(fn);
    var enc = encodeURIComponent(fn);
    width = width || 1600;
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + h[0] + '/' + h[0] + h[1] + '/' + enc + '/' + width + 'px-' + enc;
  }

  global.wikiImg = wikiImg;
})(window);
