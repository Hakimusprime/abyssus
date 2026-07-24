import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase, type AbyssEvent } from '@/lib/supabase';

/**
 * Contexte d'evenements Abyssus.
 *
 * Lit les evenements Supabase et expose :
 *  - liveEvent      : evenement actuellement en cours (declenche le theme oppressant)
 *  - announcedEvent : evenement a venir dans les 48h (banniere d'annonce + tension legere)
 *  - themeClass     : classe CSS a poser sur <body> pour adapter l'ambiance
 *
 * La classe body est geree ici pour que toute l'app reagisse au boss/evenement.
 */

const ANNOUNCE_WINDOW_MS = 48 * 60 * 60 * 1000;

type EventContextValue = {
  liveEvent: AbyssEvent | null;
  announcedEvent: AbyssEvent | null;
  loading: boolean;
  refresh: () => void;
};

const EventContext = createContext<EventContextValue>({
  liveEvent: null,
  announcedEvent: null,
  loading: true,
  refresh: () => {},
});

function eventTypeOf(ev: AbyssEvent | null): 'boss' | 'special' {
  return ev?.event_type === 'special' ? 'special' : 'boss';
}

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AbyssEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const load = useCallback(async () => {
    const { data } = await supabase.from('events').select('*').eq('is_active', true).order('starts_at', { ascending: true });
    setEvents((data as AbyssEvent[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Re-evalue le statut (live / a venir) toutes les 30 s sans refetch.
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const { liveEvent, announcedEvent } = useMemo(() => {
    void tick; // dependance volontaire pour recalculer periodiquement
    const now = Date.now();
    let live: AbyssEvent | null = null;
    let announced: AbyssEvent | null = null;
    for (const ev of events) {
      const start = new Date(ev.starts_at).getTime();
      const end = new Date(ev.ends_at).getTime();
      if (start <= now && end > now) {
        if (!live) live = ev;
      } else if (start > now && start - now <= ANNOUNCE_WINDOW_MS) {
        if (!announced) announced = ev;
      }
    }
    return { liveEvent: live, announcedEvent: announced };
  }, [events, tick]);

  // Applique la classe de theme sur le body.
  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-boss', 'theme-special', 'theme-announce');
    if (liveEvent) {
      body.classList.add(eventTypeOf(liveEvent) === 'special' ? 'theme-special' : 'theme-boss');
    } else if (announcedEvent) {
      body.classList.add('theme-announce');
    }
    return () => body.classList.remove('theme-boss', 'theme-special', 'theme-announce');
  }, [liveEvent, announcedEvent]);

  const value = useMemo<EventContextValue>(
    () => ({ liveEvent, announcedEvent, loading, refresh: load }),
    [liveEvent, announcedEvent, loading, load]
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  return useContext(EventContext);
}
