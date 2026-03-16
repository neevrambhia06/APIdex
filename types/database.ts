export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          plan: 'free' | 'pro' | 'team'
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          subscription_status: string | null
          subscription_end_date: string | null
          bookmark_count: number
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      apis: {
        Row: {
          id: string
          name: string
          slug: string
          provider: string
          category_id: string | null
          base_url: string
          auth_type: 'none' | 'api_key' | 'oauth2' | 'sdk' | 'bearer'
          pricing_tier: 'free' | 'freemium' | 'paid'
          description: string
          long_description: string | null
          docs_url: string
          logo_url: string | null
          is_featured: boolean
          is_verified: boolean
          bookmark_count: number
          avg_rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      api_categories: {
        Row: {
            id: string
            name: string
            slug: string
            icon: string | null
            color: string | null
            api_count: number
        }
        Insert: any
        Update: any
      }
      bookmarks: {
        Row: {
            id: string
            user_id: string
            api_id: string
            created_at: string
        }
        Insert: any
        Update: any
      }
      api_reviews: {
          Row: {
              id: string
              user_id: string
              api_id: string
              rating: number
              title: string | null
              body: string | null
              created_at: string
          }
          Insert: any
          Update: any
      }
    }
  }
}
