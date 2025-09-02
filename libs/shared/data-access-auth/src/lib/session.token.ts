import { InjectionToken, Signal } from '@angular/core';
import { Session } from '@supabase/supabase-js';

export const SESSION_SIGNAL_TOKEN = new InjectionToken<Signal<Session | null>>('Session signal from AuthService');
