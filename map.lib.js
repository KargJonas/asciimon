class MapLoader {
  static load(path, compressed = false, callback) {
    fetch(path)
      .then(res => res.text())
      .then(txt => compressed ? MapLoader.decompress(txt) : txt)
      .then(txt => txt
        .split("\n")
        .map(row => row.split("")))
      .then(callback);
  }

  static compress(raw) {
    let last;
    let amount = 0;
    let compressed = "";

    last = raw[1];

    for (let i = 0; i < raw.length; i++) {
      if (raw[i] == last) {
        amount++;
      }
      else {
        compressed += `${ last.charCodeAt(0) },${ amount };`;
        amount = 1;
        last = raw[i];
      }
    }

    return compressed;
  }

  static decompress(compressed) {
    const data = compressed.split(/[;,]/);
    let raw = "";

    for (let i = 0; i < data.length; i += 2) {
      raw += String.fromCharCode(data[i]).repeat(data[i + 1]);
    }

    return raw;
  }
}