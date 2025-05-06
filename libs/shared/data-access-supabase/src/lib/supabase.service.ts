import { inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@zambia/types-supabase';
import { APP_CONFIG } from '@zambia/util-config';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private readonly supabaseClient: SupabaseClient<Database>;
  private config = inject(APP_CONFIG);
  constructor() {
    this.supabaseClient = createClient<Database>(this.config.API_URL, this.config.API_PUBLIC_KEY);
  }

  public getClient(): SupabaseClient<Database> {
    return this.supabaseClient;
  }
}
