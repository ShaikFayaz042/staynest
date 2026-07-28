import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DESTINATIONS = [
  { name: 'Goa, India', desc: 'Beaches & nightlife', icon: 'fa-umbrella-beach' },
  { name: 'Manali, Himachal', desc: 'Mountain escape', icon: 'fa-mountain' },
  { name: 'Jaipur, Rajasthan', desc: 'Palaces & heritage', icon: 'fa-landmark' },
  { name: 'Udaipur, Rajasthan', desc: 'City of lakes', icon: 'fa-water' },
  { name: 'Rishikesh, Uttarakhand', desc: 'Yoga & adventure', icon: 'fa-om' },
  { name: 'Munnar, Kerala', desc: 'Tea gardens', icon: 'fa-leaf' },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function Calendar({ month, year, selected, rangeStart, rangeEnd, onSelect }) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const isSel = (d) => selected && selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === d;
  const isInRange = (d) => {
    if (!rangeStart || !rangeEnd) return false;
    const current = new Date(year, month, d);
    return current > rangeStart && current < rangeEnd;
  };
  const today = new Date();
  const isPast = (d) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="flex-1">
      <div className="text-center font-semibold text-gray-900 dark:text-white mb-4">{MONTHS[month]} {year}</div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {cells.map((d, i) => {
          const isStart = rangeStart && rangeStart.getFullYear() === year && rangeStart.getMonth() === month && rangeStart.getDate() === d;
          const isEnd = rangeEnd && rangeEnd.getFullYear() === year && rangeEnd.getMonth() === month && rangeEnd.getDate() === d;
          const inRange = isInRange(d);
          const isRangeCell = isStart || isEnd || inRange;
          const wrapperBg = isRangeCell ? 'bg-black' : '';
          const wrapperRadius = isStart ? 'rounded-l-full' : isEnd ? 'rounded-r-full' : isRangeCell ? 'rounded-none' : '';

          return (
            <div
              key={i}
              className={`aspect-square ${!d ? '' : isRangeCell ? `p-0 ${wrapperRadius}` : 'p-0.5'} ${wrapperBg}`}
            >
              <button
                disabled={!d || isPast(d)}
                onClick={() => d && onSelect(new Date(year, month, d))}
                className={`w-full h-full text-sm transition-colors flex items-center justify-center ${
                  !d ? 'invisible' :
                  isPast(d) ? 'text-gray-300 dark:text-gray-600 line-through cursor-not-allowed rounded-full bg-transparent' :
                  isRangeCell ? 'bg-transparent text-white' :
                  'rounded-full text-gray-800 dark:text-gray-200 hover:border hover:border-gray-900 dark:hover:border-white bg-transparent'
                }`}
              >
                {d}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuestRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div>
        <div className="font-semibold text-gray-900 dark:text-white">{label}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          className="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >−</button>
        <span className="w-6 text-center text-gray-900 dark:text-white">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:border-gray-900 dark:hover:border-gray-300"
        >+</button>
      </div>
    </div>
  );
}

export default function SearchBar() {
  const [active, setActive] = useState(null); // 'where' | 'when' | 'who' | null
  const [where, setWhere] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [pickingOut, setPickingOut] = useState(false);
  const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const wrapRef = useRef(null);
  const whereRef = useRef(null);
  const whenRef = useRef(null);
  const whoRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setActive(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const checkInParam = params.get('checkIn');
    const checkOutParam = params.get('checkOut');
    const guestCount = parseInt(params.get('guests') || '0', 10);

    setWhere(q);
    setCheckIn(null);
    setCheckOut(null);
    setGuests((prev) => ({ ...prev, adults: guestCount > 0 ? guestCount : prev.adults }));

    if (checkInParam) {
      const date = new Date(checkInParam);
      if (!Number.isNaN(date.getTime())) setCheckIn(date);
    }
    if (checkOutParam) {
      const date = new Date(checkOutParam);
      if (!Number.isNaN(date.getTime())) setCheckOut(date);
    }
  }, [location.search]);

  useEffect(() => {
    const refMap = { where: whereRef, when: whenRef, who: whoRef };
    const el = active ? refMap[active]?.current : null;
    const wrap = wrapRef.current;
    if (!el || !wrap) {
      setPill((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const wr = wrap.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    setPill({ left: er.left - wr.left, width: er.width, opacity: 1 });
  }, [active]);

  const totalGuests = guests.adults + guests.children;
  const fmt = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

  const searchQuery = where.trim().toLowerCase();
  const filteredDestinations = searchQuery
    ? DESTINATIONS.filter((d) =>
        d.name.toLowerCase().includes(searchQuery) ||
        d.desc.toLowerCase().includes(searchQuery)
      )
    : DESTINATIONS;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (where.trim()) params.set('q', where.trim());
    if (checkIn) params.set('checkIn', checkIn.toISOString().slice(0, 10));
    if (checkOut) params.set('checkOut', checkOut.toISOString().slice(0, 10));
    if (totalGuests > 0) params.set('guests', totalGuests.toString());

    const searchPath = params.toString() ? `/?${params.toString()}` : '/';
    navigate(searchPath);
    setActive(null);
  };

  const dateLabel = checkIn && checkOut
    ? `${fmt(checkIn)} – ${fmt(checkOut)}`
    : checkIn ? `${fmt(checkIn)} – ?` : null;

  const guestLabel = totalGuests > 0
    ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${guests.infants ? `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}` : ''}`
    : null;

  const sectionCls = (key) =>
    `relative z-10 flex-1 text-left rounded-full min-w-0 px-4 lg:px-5 py-1.5 transition-colors ${
      active === key ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const handleDatePick = (d) => {
    if (!checkIn || pickingOut) {
      if (checkIn && d > checkIn) {
        setCheckOut(d);
        setPickingOut(false);
        setActive('who');
      } else {
        setCheckIn(d);
        setCheckOut(null);
        setPickingOut(true);
      }
    } else {
      if (d <= checkIn) {
        setCheckIn(d);
        setCheckOut(null);
      } else {
        setCheckOut(d);
        setPickingOut(false);
        setActive('who');
      }
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`hidden md:flex flex-1 max-w-lg lg:max-w-xl mx-auto h-12 items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-shadow duration-200 relative px-1 pt-2 pb-1 ${
        active ? 'bg-gray-100 dark:bg-gray-700 shadow-md' : 'shadow-sm hover:shadow-md'
      }`}
    >
      {/* Sliding pill */}
      <div
        className="absolute top-1 bottom-1 bg-white dark:bg-gray-600 rounded-full shadow-md pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${pill.left}px`,
          width: `${pill.width}px`,
          opacity: pill.opacity,
        }}
      />

      {/* Where */}
      <div ref={whereRef} className={sectionCls('where')} onClick={() => setActive('where')}>
        <div className="text-xs font-bold text-gray-900 dark:text-white">Where</div>
        <input
          type="text"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          onFocus={() => setActive('where')}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search destinations"
          className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      <div className={`h-8 w-px bg-gray-200 dark:bg-gray-600 shrink-0 transition-opacity duration-200 ${active === 'where' || active === 'when' ? 'opacity-0' : ''}`}></div>

      {/* When */}
      <button ref={whenRef} className={sectionCls('when')} onClick={() => { setActive('when'); setPickingOut(!!checkIn && !checkOut); }}>
        <div className="text-xs font-bold text-gray-900 dark:text-white">When</div>
        <div className={`text-sm truncate ${dateLabel ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {dateLabel || 'Add dates'}
        </div>
      </button>

      <div className={`h-8 w-px bg-gray-200 dark:bg-gray-600 shrink-0 transition-opacity duration-200 ${active === 'when' || active === 'who' ? 'opacity-0' : ''}`}></div>

      {/* Who + Search */}
      <div
        ref={whoRef}
        className={`relative z-10 flex items-center justify-between flex-1 pl-4 lg:pl-5 pr-1 rounded-full transition-colors min-w-0 ${
          active === 'who' ? '' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <button className="py-2 min-w-0 text-left flex-1" onClick={() => setActive('who')}>
          <div className="text-xs font-bold text-gray-900 dark:text-white">Who</div>
          <div className={`text-sm truncate ${guestLabel ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {guestLabel || 'Add guests'}
          </div>
        </button>
        <button onClick={handleSearch} className="bg-[#FF385C] text-white rounded-full px-3 py-2 hover:bg-[#d90b35] transition-all duration-300 flex items-center justify-center shadow-md gap-2 shrink-0" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <span className={`text-sm font-semibold overflow-hidden transition-all duration-300 hidden lg:inline-block ${active ? 'max-w-[60px] opacity-100' : 'max-w-0 opacity-0'}`}>
            Search
          </span>
        </button>
      </div>

      {/* Where Popover */}
      {active === 'where' && (
        <div className="absolute left-0 top-full mt-3 w-[420px] max-w-[95vw] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 z-50">
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Suggested destinations</div>
          <div className="max-h-72 overflow-y-auto">
            {filteredDestinations.length > 0 ? filteredDestinations.map((d) => (
              <button
                key={d.name}
                onClick={() => { setWhere(d.name); setActive('when'); }}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
                  <i className={`fa-solid ${d.icon}`}></i>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{d.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{d.desc}</div>
                </div>
              </button>
            )) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 p-3">No matching destinations found.</div>
            )}
          </div>
        </div>
      )}

      {/* When Popover */}
      {active === 'when' && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[720px] max-w-[95vw] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 z-50">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-chevron-left text-xs"></i>
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {pickingOut && checkIn ? 'Select check-out date' : 'Select check-in date'}
            </div>
            <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>
          <div className="flex gap-8">
            <Calendar
              month={viewMonth}
              year={viewYear}
              selected={pickingOut ? checkIn : (checkOut || checkIn)}
              rangeStart={checkIn}
              rangeEnd={checkOut}
              onSelect={handleDatePick}
            />
            <Calendar
              month={viewMonth === 11 ? 0 : viewMonth + 1}
              year={viewMonth === 11 ? viewYear + 1 : viewYear}
              selected={pickingOut ? checkIn : (checkOut || checkIn)}
              rangeStart={checkIn}
              rangeEnd={checkOut}
              onSelect={handleDatePick}
            />
          </div>
          {(checkIn || checkOut) && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {checkIn && <span><span className="font-semibold dark:text-white">Check-in:</span> {fmt(checkIn)}</span>}
                {checkOut && <span className="ml-4"><span className="font-semibold dark:text-white">Check-out:</span> {fmt(checkOut)}</span>}
              </div>
              <button
                onClick={() => { setCheckIn(null); setCheckOut(null); setPickingOut(false); }}
                className="text-sm font-semibold underline text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded"
              >Clear</button>
            </div>
          )}
        </div>
      )}

      {/* Who Popover */}
      {active === 'who' && (
        <div className="absolute right-0 top-full mt-3 w-[400px] max-w-[95vw] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 z-50">
          <GuestRow label="Adults" sub="Ages 13 or above" value={guests.adults} onChange={(v) => setGuests({ ...guests, adults: v })} />
          <GuestRow label="Children" sub="Ages 2 – 12" value={guests.children} onChange={(v) => setGuests({ ...guests, children: v })} />
          <GuestRow label="Infants" sub="Under 2" value={guests.infants} onChange={(v) => setGuests({ ...guests, infants: v })} />
          <GuestRow label="Pets" sub="Bringing a service animal?" value={guests.pets} onChange={(v) => setGuests({ ...guests, pets: v })} />
        </div>
      )}
    </div>
  );
}