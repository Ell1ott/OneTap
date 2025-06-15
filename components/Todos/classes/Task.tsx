import AppText from 'components/base/AppText';
import { JSX } from 'react';
import { Tables } from 'utils/supabase/database.types';
import { tasks$ } from 'utils/supabase/SupaLegend';

export class Task {
  r: Tables<'todos'> | Tables<'events'> | Tables<'categories'>;

  constructor(data: Tables<'todos'> | Tables<'events'> | Tables<'categories'>) {
    this.r = data;
  }

  get subtext(): string | null {
    // return this.r.note;
    return 'hh';
    // TODO: Add subtext (Elliott)
  }

  $ = () => tasks$[this.r.id as string];

  getSubtextClasses = () => '';
  renderSubtext = () =>
    this.subtext && (
      <AppText
        className={`-mt-0.5 font-medium italic text-foregroundMuted ${this.getSubtextClasses()}`}>
        {this.subtext}
      </AppText>
    );

  EndContent = (): JSX.Element | null => null;

  isToday = () => false;
  isPriority = () => false;
}
