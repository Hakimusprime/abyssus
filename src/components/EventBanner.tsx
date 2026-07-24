import { Link } from 'react-router-dom';
import { Skull, Sparkles, AlertTriangle } from 'lucide-react';
import { useEvents } from '@/context/EventContext';

/**
 * Banniere globale d'evenement. S'affiche en haut du contenu :
 *  - boss en cours      : rouge, pulsation, appel a l'action
 *  - event special      : violet
 *  - boss a venir (48h)  : annonce discrete
 */
export default function EventBanner() {
  const { liveEvent, announcedEvent } = useEvents();

  if (liveEvent) {
    const special = liveEvent.event_type === 'special';
    return (
      <Link
        to="/events"
        className={`event-banner ${special ? 'event-banner-special' : 'event-banner-boss'}`}
      >
        {special ? <Sparkles className="w-5 h-5 event-pulse shrink-0" /> : <Skull className="w-5 h-5 event-pulse shrink-0" />}
        <span className="font-display font-semibold uppercase tracking-wide">
          {special ? 'Evenement Special' : 'Boss en cours'}
        </span>
        <span className="truncate opacity-90">— {liveEvent.title}</span>
        <span className="ml-auto text-xs opacity-80 shrink-0 hidden sm:inline">+{liveEvent.bonus_xp} XP · Affronter →</span>
      </Link>
    );
  }

  if (announcedEvent) {
    const when = new Date(announcedEvent.starts_at);
    return (
      <Link to="/events" className="event-banner event-banner-announce">
        <AlertTriangle className="w-5 h-5 event-pulse shrink-0" />
        <span className="font-display font-semibold uppercase tracking-wide">Menace imminente</span>
        <span className="truncate opacity-90">— {announcedEvent.title}</span>
        <span className="ml-auto text-xs opacity-80 shrink-0 hidden sm:inline">
          {when.toLocaleString()}
        </span>
      </Link>
    );
  }

  return null;
}
