export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  body: string;
  content_brief?: string;
  content_type_category?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogSDKConfig {
  supabaseUrl: string;
  supabaseKey: string;
  projectId: string;
  /** Revalidation interval in seconds for ISR. Default: 60 */
  revalidate?: number;
}
