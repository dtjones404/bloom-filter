class BloomFilter {
  M: number;
  k: number;
  bits: number[];

  constructor(M, k) {
    this.M = M;
    this.k = k;
    this.bits = new Array(M).fill(0);
  }
  hash(s: string, key: number) {
    s = String(key) + s;
    let h = 0;
    for (const x of s) {
      h = (h << 5) - h;
      h += x.charCodeAt(0);
      h &= h;
    }
    return Math.abs(h % this.M);
  }
  add(s: string) {
    for (let i = 0; i < this.k; i++) {
      const bit = this.hash(s, i);
      this.bits[bit] = 1;
    }
  }
  check(s: string) {
    for (let i = 0; i < this.k; i++) {
      const bit = this.hash(s, i);
      if (!this.bits[bit]) return false;
    }
    return true;
  }
}

class BloomTester {
  bloomFilter: BloomFilter;

  constructor(bloomFilter: BloomFilter) {
    this.bloomFilter = bloomFilter;
  }
  getRandomInt(min: number, max: number) {
    return min + Math.floor(Math.random() * (max - min));
  }
  getRandomStr(minLength: number, maxLength: number) {
    let res = '';
    const strLength = this.getRandomInt(minLength, maxLength);
    for (let i = 0; i < strLength; i++) {
      const char = String.fromCharCode(97 + this.getRandomInt(0, 25));
      res += char;
    }
    return res;
  }
  test(n: number, minLength: number, maxLength: number) {
    let falsePositives = 0;
    for (let i = 0; i < n; i++) {
      const randomString = this.getRandomStr(minLength, maxLength);
      console.log(randomString);
      this.bloomFilter.add(randomString);
    }
    for (let i = 0; i < n; i++) {
      const randomString = this.getRandomStr(minLength, maxLength);
      console.log(randomString);
      if (this.bloomFilter.check(randomString)) falsePositives++;
    }
    return falsePositives / n;
  }
}
const bloom = new BloomFilter(1000, 3);
const bloomTester = new BloomTester(bloom);

console.log(bloomTester.test(100, 6, 12)); //theory predicts fp rate of 0.017%
