"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/lib/store/preferences-store";

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "United Arab Emirates",
  "Brazil",
  "Other",
];

const TIMEZONES = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Asia/Dubai",
  "America/Sao_Paulo",
  "UTC",
];

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-white/25 focus:bg-white/[0.05]";
const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

export function StepProfile() {
  const profile = usePreferencesStore((s) => s.profile);
  const setProfile = usePreferencesStore((s) => s.setProfile);

  // Prefill timezone from the browser once, if not already set.
  useEffect(() => {
    if (!profile.timezone) {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) setProfile({ timezone: detected });
    }
  }, [profile.timezone, setProfile]);

  const timezoneOptions = profile.timezone && !TIMEZONES.includes(profile.timezone)
    ? [profile.timezone, ...TIMEZONES]
    : TIMEZONES;

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="ob-name" className={labelClass}>
          What should we call you?
        </label>
        <input
          id="ob-name"
          autoFocus
          value={profile.name}
          onChange={(e) => setProfile({ name: e.target.value })}
          placeholder="Your name"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ob-dob" className={labelClass}>
            Date of birth
          </label>
          <input
            id="ob-dob"
            type="date"
            value={profile.dob}
            onChange={(e) => setProfile({ dob: e.target.value })}
            className={`${fieldClass} [color-scheme:dark]`}
          />
        </div>
        <div>
          <label htmlFor="ob-country" className={labelClass}>
            Country
          </label>
          <select
            id="ob-country"
            value={profile.country}
            onChange={(e) => setProfile({ country: e.target.value })}
            className={fieldClass}
          >
            <option value="" disabled>
              Select…
            </option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c} className="bg-black">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="ob-tz" className={labelClass}>
          Timezone
        </label>
        <select
          id="ob-tz"
          value={profile.timezone}
          onChange={(e) => setProfile({ timezone: e.target.value })}
          className={fieldClass}
        >
          {timezoneOptions.map((tz) => (
            <option key={tz} value={tz} className="bg-black">
              {tz}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
