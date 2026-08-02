// date-parser.js — best-effort flexible date-of-birth parser.
//
// Patients (and a hurried receptionist on a phone) type the DOB in whatever
// shape they remember: 9/11/1959, 09-11-59, 1959-11-09, "9 de noviembre de
// 1959", 09.11.1959, 09111959… The old parser accepted ONLY `dd/mm/yyyy` and
// silently dropped everything else (Andrés' Android complaint, 2026-06-25).
//
// This normalizes any reasonable Argentine DOB to ISO `yyyy-mm-dd`, doing its
// best to disambiguate, and rejecting only the genuinely impossible (out of a
// sane birth-year range, invalid calendar day, or a future date).
//
// Universal module: works as a classic <script> (window.SanaDates), as an ES
// module consumer via the global, and as CommonJS (node --test).
(function (root) {
  'use strict';

  var MIN_YEAR = 1900;            // nobody alive was born before this in practice
  var MONTHS = {
    ene: 1, enero: 1, jan: 1, january: 1,
    feb: 2, febrero: 2, february: 2,
    mar: 3, marzo: 3, march: 3,
    abr: 4, abril: 4, apr: 4, april: 4,
    may: 5, mayo: 5,
    jun: 6, junio: 6, june: 6,
    jul: 7, julio: 7, july: 7,
    ago: 8, agosto: 8, aug: 8, august: 8,
    sep: 9, sept: 9, septiembre: 9, setiembre: 9, september: 9,
    oct: 10, octubre: 10, october: 10,
    nov: 11, noviembre: 11, november: 11,
    dic: 12, diciembre: 12, dec: 12, december: 12
  };

  function currentYear() {
    // Date.now() is unavailable in workflow scripts but fine in the browser/node.
    return new Date().getFullYear();
  }

  function daysInMonth(y, m) {
    return new Date(y, m, 0).getDate(); // m is 1-based; day 0 of next month
  }

  // Expand a 2-digit year, biased so the result is a plausible birth date
  // (never in the future). The century can't be picked from the year alone:
  // when 2000+yy IS the current year, the full date decides (e.g. '09/11/26'
  // during mid-2026 must mean 1926 — 2026-11-09 hasn't happened). So try the
  // 2000s candidate and, if the whole date is rejected, retry the 1900s.
  function withExpandedYear(yy, attempt) {
    var c2000 = 2000 + yy;
    if (c2000 <= currentYear()) {
      var iso = attempt(c2000);
      if (iso) return iso;
    }
    return attempt(1900 + yy);
  }

  // Build + validate a (y, m, d) triple. Returns ISO or null.
  function build(y, m, d) {
    if (!(y >= MIN_YEAR && y <= currentYear())) return null;
    if (!(m >= 1 && m <= 12)) return null;
    if (!(d >= 1 && d <= daysInMonth(y, m))) return null;
    var iso = pad4(y) + '-' + pad2(m) + '-' + pad2(d);
    // reject future dates (a DOB can't be after today)
    if (iso > isoToday()) return null;
    return iso;
  }

  function pad2(n) { return String(n).padStart(2, '0'); }
  function pad4(n) { return String(n).padStart(4, '0'); }
  function isoToday() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  // Given two small numbers that are day/month in some order, pick the most
  // likely (day, month). Argentine convention is day-first, so prefer that;
  // only swap when day-first is impossible but month-first works.
  function orderDayMonth(a, b, year) {
    var dm = build(year, b, a);   // a=day, b=month  (dd/mm — preferred)
    if (dm) return dm;
    var md = build(year, a, b);   // a=month, b=day  (fallback)
    if (md) return md;
    return null;
  }

  /**
   * Parse a free-form date string into ISO `yyyy-mm-dd`, or null if it can't be
   * made into a sane birth date. Forgiving about separators, order, 2-digit
   * years, and Spanish/English month names.
   */
  function parseFlexibleDate(input) {
    if (input == null) return null;
    var s = String(input).trim().toLowerCase();
    if (!s) return null;

    // 1) Month-name form: "9 de noviembre de 1959", "9 nov 1959", "nov 9 1959"
    var nameRe = /([a-záéíóúñ]{3,})/i;
    if (nameRe.test(s)) {
      var monMatch = s.match(/(ene|enero|feb|febrero|mar|marzo|abr|abril|may|mayo|jun|junio|jul|julio|ago|agosto|sep|sept|setiembre|septiembre|oct|octubre|nov|noviembre|dic|diciembre|jan|january|february|march|april|june|july|august|september|october|november|december)/);
      if (monMatch) {
        var mon = MONTHS[monMatch[1]];
        var nums = (s.match(/\d+/g) || []).map(Number);
        if (mon && nums.length >= 2) {
          // one number is the day (1..31), the other the year
          var day = null, yr = null;
          for (var i = 0; i < nums.length; i++) {
            if (nums[i] > 31 || String(nums[i]).length === 4) yr = nums[i];
            else if (day === null) day = nums[i];
          }
          if (yr === null) { // maybe a 2-digit year sits among them
            for (var j = 0; j < nums.length; j++) if (nums[j] !== day) { yr = nums[j]; break; }
          }
          if (day !== null && yr !== null) {
            var isoN = yr < 100
              ? withExpandedYear(yr, function (y) { return build(y, mon, day); })
              : build(yr, mon, day);
            if (isoN) return isoN;
          }
        }
      }
      // a stray word but no usable month → fall through to numeric parsing
    }

    // 2) Pure numeric, no separators: ddmmyyyy / yyyymmdd / ddmmyy
    var digitsOnly = s.replace(/[^\d]/g, '');
    if (/^\d+$/.test(s.replace(/\s/g, '')) && digitsOnly.length === s.replace(/\s/g, '').length) {
      if (digitsOnly.length === 8) {
        // try ddmmyyyy first (AR), then yyyymmdd
        var d8 = orderDayMonth(+digitsOnly.slice(0, 2), +digitsOnly.slice(2, 4), +digitsOnly.slice(4));
        if (d8) return d8;
        var y8 = build(+digitsOnly.slice(0, 4), +digitsOnly.slice(4, 6), +digitsOnly.slice(6));
        if (y8) return y8;
        return null;
      }
      if (digitsOnly.length === 6) {
        var d6 = withExpandedYear(+digitsOnly.slice(4), function (y) {
          return orderDayMonth(+digitsOnly.slice(0, 2), +digitsOnly.slice(2, 4), y);
        });
        if (d6) return d6;
        return null;
      }
      // an 8-or-6 thing is all we can guess from a bare digit run
      return null;
    }

    // 3) Separated groups: split on / - . space, take the numeric chunks
    var parts = s.split(/[^\d]+/).filter(Boolean);
    if (parts.length === 3) {
      var n0 = +parts[0], n1 = +parts[1], n2 = +parts[2];
      // ISO-ish: first chunk is a 4-digit year → yyyy-mm-dd
      if (parts[0].length === 4) {
        var isoFirst = build(n0, n1, n2);
        if (isoFirst) return isoFirst;
        return build(n0, n2, n1); // tolerate yyyy-dd-mm
      }
      // last chunk is the year (2 or 4 digits)
      if (parts[2].length === 4) return orderDayMonth(n0, n1, n2);
      return withExpandedYear(n2, function (y) { return orderDayMonth(n0, n1, y); });
    }
    if (parts.length === 2) {
      // day + month, year unknown → can't make a DOB
      return null;
    }

    return null;
  }

  // ISO yyyy-mm-dd -> dd/mm/yyyy for display. '' on miss.
  function isoToArg(iso) {
    var m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? (m[3] + '/' + m[2] + '/' + m[1]) : '';
  }

  // Whole-number age from an ISO DOB, or null.
  function ageFromIso(iso) {
    var m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return null;
    var now = new Date();
    var a = now.getFullYear() - Number(m[1]);
    var md = (now.getMonth() + 1 - Number(m[2])) || (now.getDate() - Number(m[3]));
    if (md < 0) a -= 1;
    return a >= 0 && a < 130 ? a : null;
  }

  // The human-facing hint that tells the user the format we prefer.
  var FORMAT_HINT = 'Ej: 09/11/1959 (día/mes/año). También vale 9-11-1959 o "9 de noviembre de 1959".';

  var api = { parseFlexibleDate: parseFlexibleDate, isoToArg: isoToArg, ageFromIso: ageFromIso, FORMAT_HINT: FORMAT_HINT };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.SanaDates = api;
})(typeof window !== 'undefined' ? window : globalThis);
