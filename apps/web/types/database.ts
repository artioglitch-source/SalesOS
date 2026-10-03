export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          address: string | null
          city: string | null
          classification: string | null
          country: string | null
          created_at: string
          credit_limit: number
          customer_code: string | null
          email: string | null
          id: string
          industry: string | null
          is_new_flag: boolean
          name: string
          notes: string | null
          opening_balance: number
          org_id: string
          owner_id: string | null
          payment_terms_days: number
          phone: string | null
          region_id: string | null
          rep_id: string | null
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          classification?: string | null
          country?: string | null
          created_at?: string
          credit_limit?: number
          customer_code?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          is_new_flag?: boolean
          name: string
          notes?: string | null
          opening_balance?: number
          org_id: string
          owner_id?: string | null
          payment_terms_days?: number
          phone?: string | null
          region_id?: string | null
          rep_id?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          classification?: string | null
          country?: string | null
          created_at?: string
          credit_limit?: number
          customer_code?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          is_new_flag?: boolean
          name?: string
          notes?: string | null
          opening_balance?: number
          org_id?: string
          owner_id?: string | null
          payment_terms_days?: number
          phone?: string | null
          region_id?: string | null
          rep_id?: string | null
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "reps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "v_rep_month"
            referencedColumns: ["rep_id"]
          },
        ]
      }
      activities: {
        Row: {
          account_id: string | null
          actor_id: string | null
          body: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string
          deal_id: string | null
          id: string
          org_id: string
          scheduled_at: string | null
          subject: string
          type: string
        }
        Insert: {
          account_id?: string | null
          actor_id?: string | null
          body?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          id?: string
          org_id: string
          scheduled_at?: string | null
          subject: string
          type: string
        }
        Update: {
          account_id?: string | null
          actor_id?: string | null
          body?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          id?: string
          org_id?: string
          scheduled_at?: string | null
          subject?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "activities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          org_id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          body: string
          created_at: string
          data: Json
          id: string
          org_id: string
          status: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json
          id?: string
          org_id: string
          status?: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json
          id?: string
          org_id?: string
          status?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          org_id: string
          role: string
          tool_name: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          org_id: string
          role: string
          tool_name?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          org_id?: string
          role?: string
          tool_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_messages_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage: {
        Row: {
          completion_tokens: number | null
          created_at: string
          id: number
          model: string | null
          org_id: string
          prompt_tokens: number | null
          provider: string
          tool_calls: number | null
          user_id: string | null
        }
        Insert: {
          completion_tokens?: number | null
          created_at?: string
          id?: number
          model?: string | null
          org_id: string
          prompt_tokens?: number | null
          provider: string
          tool_calls?: number | null
          user_id?: string | null
        }
        Update: {
          completion_tokens?: number | null
          created_at?: string
          id?: number
          model?: string | null
          org_id?: string
          prompt_tokens?: number | null
          provider?: string
          tool_calls?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_rules: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          key: string
          label: string
          org_id: string
          params: Json
          severity: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          key: string
          label: string
          org_id: string
          params?: Json
          severity?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          key?: string
          label?: string
          org_id?: string
          params?: Json
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_rules_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          assignee_id: string | null
          created_at: string
          id: string
          org_id: string
          resolved_at: string | null
          rule_id: string | null
          severity: string
          snoozed_until: string | null
          status: string
          subject_id: string | null
          subject_type: string | null
          suggested_action: string | null
          title: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          id?: string
          org_id: string
          resolved_at?: string | null
          rule_id?: string | null
          severity?: string
          snoozed_until?: string | null
          status?: string
          subject_id?: string | null
          subject_type?: string | null
          suggested_action?: string | null
          title: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          id?: string
          org_id?: string
          resolved_at?: string | null
          rule_id?: string | null
          severity?: string
          snoozed_until?: string | null
          status?: string
          subject_id?: string | null
          subject_type?: string | null
          suggested_action?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "alert_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          org_id: string
          revoked_at: string | null
          scopes: string[]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          org_id: string
          revoked_at?: string | null
          scopes?: string[]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          org_id?: string
          revoked_at?: string | null
          scopes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          clock_in: string | null
          clock_out: string | null
          created_at: string
          id: string
          notes: string | null
          org_id: string
          status: string
          user_id: string
          work_date: string
        }
        Insert: {
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          org_id: string
          status?: string
          user_id: string
          work_date: string
        }
        Update: {
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          org_id?: string
          status?: string
          user_id?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: number
          metadata: Json
          org_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          metadata?: Json
          org_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          metadata?: Json
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          actions: Json
          conditions: Json
          created_at: string
          enabled: boolean
          id: string
          name: string
          org_id: string
          trigger_key: string
        }
        Insert: {
          actions?: Json
          conditions?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          name: string
          org_id: string
          trigger_key: string
        }
        Update: {
          actions?: Json
          conditions?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          org_id?: string
          trigger_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "automations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bonus_rules: {
        Row: {
          id: string
          org_id: string
          plan_id: string
          thresholds: Json
          type: string
        }
        Insert: {
          id?: string
          org_id: string
          plan_id: string
          thresholds?: Json
          type: string
        }
        Update: {
          id?: string
          org_id?: string
          plan_id?: string
          thresholds?: Json
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "bonus_rules_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonus_rules_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "commission_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      category_plans: {
        Row: {
          activation_plan: string | null
          created_at: string
          id: string
          org_id: string
          owner_rep_id: string | null
          period: string
          product_group_id: string | null
          target: number
          target_customers: number
        }
        Insert: {
          activation_plan?: string | null
          created_at?: string
          id?: string
          org_id: string
          owner_rep_id?: string | null
          period: string
          product_group_id?: string | null
          target?: number
          target_customers?: number
        }
        Update: {
          activation_plan?: string | null
          created_at?: string
          id?: string
          org_id?: string
          owner_rep_id?: string | null
          period?: string
          product_group_id?: string | null
          target?: number
          target_customers?: number
        }
        Relationships: [
          {
            foreignKeyName: "category_plans_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_plans_owner_rep_id_fkey"
            columns: ["owner_rep_id"]
            isOneToOne: false
            referencedRelation: "reps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_plans_owner_rep_id_fkey"
            columns: ["owner_rep_id"]
            isOneToOne: false
            referencedRelation: "v_rep_month"
            referencedColumns: ["rep_id"]
          },
          {
            foreignKeyName: "category_plans_product_group_id_fkey"
            columns: ["product_group_id"]
            isOneToOne: false
            referencedRelation: "product_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_plans_product_group_id_fkey"
            columns: ["product_group_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["product_group_id"]
          },
        ]
      }
      commission_plans: {
        Row: {
          active: boolean
          created_at: string
          formula_type: string
          id: string
          name: string
          org_id: string
          params: Json
        }
        Insert: {
          active?: boolean
          created_at?: string
          formula_type: string
          id?: string
          name: string
          org_id: string
          params?: Json
        }
        Update: {
          active?: boolean
          created_at?: string
          formula_type?: string
          id?: string
          name?: string
          org_id?: string
          params?: Json
        }
        Relationships: [
          {
            foreignKeyName: "commission_plans_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_tiers: {
        Row: {
          achievement_from: number
          achievement_to: number | null
          id: string
          org_id: string
          plan_id: string
          rate: number
        }
        Insert: {
          achievement_from: number
          achievement_to?: number | null
          id?: string
          org_id: string
          plan_id: string
          rate?: number
        }
        Update: {
          achievement_from?: number
          achievement_to?: number | null
          id?: string
          org_id?: string
          plan_id?: string
          rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "commission_tiers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_tiers_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "commission_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          amount: number
          basis_amount: number
          created_at: string
          deal_id: string | null
          id: string
          org_id: string
          rate: number
          status: string
          user_id: string
        }
        Insert: {
          amount?: number
          basis_amount?: number
          created_at?: string
          deal_id?: string | null
          id?: string
          org_id: string
          rate?: number
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          basis_amount?: number
          created_at?: string
          deal_id?: string | null
          id?: string
          org_id?: string
          rate?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commissions_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commissions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          account_id: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          notes: string | null
          org_id: string
          owner_id: string | null
          phone: string | null
          source: string | null
          status: string
          title: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          notes?: string | null
          org_id: string
          owner_id?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          notes?: string | null
          org_id?: string
          owner_id?: string | null
          phone?: string | null
          source?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_fields: {
        Row: {
          created_at: string
          entity: string
          field_type: string
          id: string
          key: string
          label_ar: string
          label_en: string
          options: Json
          org_id: string
          required: boolean
        }
        Insert: {
          created_at?: string
          entity: string
          field_type: string
          id?: string
          key: string
          label_ar: string
          label_en: string
          options?: Json
          org_id: string
          required?: boolean
        }
        Update: {
          created_at?: string
          entity?: string
          field_type?: string
          id?: string
          key?: string
          label_ar?: string
          label_en?: string
          options?: Json
          org_id?: string
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "custom_fields_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_briefs: {
        Row: {
          brief_date: string
          content: Json
          created_at: string
          id: string
          org_id: string
          user_id: string | null
        }
        Insert: {
          brief_date: string
          content?: Json
          created_at?: string
          id?: string
          org_id: string
          user_id?: string | null
        }
        Update: {
          brief_date?: string
          content?: Json
          created_at?: string
          id?: string
          org_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_briefs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          collection_amount: number
          contacts_count: number
          created_at: string
          day_sales: number
          day_target: number
          id: string
          offers_count: number
          orders_count: number
          org_id: string
          rep_id: string | null
          report_date: string
          submitted_at: string | null
          tomorrow_action: string | null
          top_opportunity: string | null
          top_problem: string | null
          visits_count: number
        }
        Insert: {
          collection_amount?: number
          contacts_count?: number
          created_at?: string
          day_sales?: number
          day_target?: number
          id?: string
          offers_count?: number
          orders_count?: number
          org_id: string
          rep_id?: string | null
          report_date: string
          submitted_at?: string | null
          tomorrow_action?: string | null
          top_opportunity?: string | null
          top_problem?: string | null
          visits_count?: number
        }
        Update: {
          collection_amount?: number
          contacts_count?: number
          created_at?: string
          day_sales?: number
          day_target?: number
          id?: string
          offers_count?: number
          orders_count?: number
          org_id?: string
          rep_id?: string | null
          report_date?: string
          submitted_at?: string | null
          tomorrow_action?: string | null
          top_opportunity?: string | null
          top_problem?: string | null
          visits_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "reps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "v_rep_month"
            referencedColumns: ["rep_id"]
          },
        ]
      }
      deal_items: {
        Row: {
          deal_id: string
          description: string | null
          discount: number
          id: string
          org_id: string
          product_id: string | null
          quantity: number
          tax: number
          unit_price: number
        }
        Insert: {
          deal_id: string
          description?: string | null
          discount?: number
          id?: string
          org_id: string
          product_id?: string | null
          quantity?: number
          tax?: number
          unit_price?: number
        }
        Update: {
          deal_id?: string
          description?: string | null
          discount?: number
          id?: string
          org_id?: string
          product_id?: string | null
          quantity?: number
          tax?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "deal_items_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_items_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_perf"
            referencedColumns: ["product_id"]
          },
        ]
      }
      deals: {
        Row: {
          account_id: string | null
          contact_id: string | null
          created_at: string
          currency: string
          expected_close_date: string | null
          id: string
          loss_reason: string | null
          notes: string | null
          org_id: string
          owner_id: string | null
          stage_id: string | null
          status: string
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          account_id?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string
          expected_close_date?: string | null
          id?: string
          loss_reason?: string | null
          notes?: string | null
          org_id: string
          owner_id?: string | null
          stage_id?: string | null
          status?: string
          title: string
          updated_at?: string
          value?: number
        }
        Update: {
          account_id?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string
          expected_close_date?: string | null
          id?: string
          loss_reason?: string | null
          notes?: string | null
          org_id?: string
          owner_id?: string | null
          stage_id?: string | null
          status?: string
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "deals_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          description: string | null
          expense_date: string
          id: string
          org_id: string
          receipt_url: string | null
          status: string
          submitted_by: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          currency?: string
          description?: string | null
          expense_date?: string
          id?: string
          org_id: string
          receipt_url?: string | null
          status?: string
          submitted_by?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          expense_date?: string
          id?: string
          org_id?: string
          receipt_url?: string | null
          status?: string
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      extension_installs: {
        Row: {
          config: Json
          enabled: boolean
          extension_id: string
          id: string
          installed_at: string
          org_id: string
          version: string
        }
        Insert: {
          config?: Json
          enabled?: boolean
          extension_id: string
          id?: string
          installed_at?: string
          org_id: string
          version: string
        }
        Update: {
          config?: Json
          enabled?: boolean
          extension_id?: string
          id?: string
          installed_at?: string
          org_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "extension_installs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      extensions: {
        Row: {
          created_at: string
          enabled: boolean
          extension_id: string
          id: string
          manifest: Json
          name: string
          org_id: string
          version: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          extension_id: string
          id?: string
          manifest?: Json
          name: string
          org_id: string
          version: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          extension_id?: string
          id?: string
          manifest?: Json
          name?: string
          org_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "extensions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          enabled: boolean
          key: string
          org_id: string
          rollout_percentage: number
        }
        Insert: {
          enabled?: boolean
          key: string
          org_id: string
          rollout_percentage?: number
        }
        Update: {
          enabled?: boolean
          key?: string
          org_id?: string
          rollout_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "feature_flags_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      gp_factor_tiers: {
        Row: {
          factor: number
          gp_from: number
          gp_to: number | null
          id: string
          org_id: string
          plan_id: string
        }
        Insert: {
          factor?: number
          gp_from: number
          gp_to?: number | null
          id?: string
          org_id: string
          plan_id: string
        }
        Update: {
          factor?: number
          gp_from?: number
          gp_to?: number | null
          id?: string
          org_id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gp_factor_tiers_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gp_factor_tiers_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "commission_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      import_jobs: {
        Row: {
          created_at: string
          created_by: string | null
          entity: string
          errors: Json
          file_name: string
          id: string
          mapping: Json
          org_id: string
          rows_total: number
          rows_valid: number
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity: string
          errors?: Json
          file_name: string
          id?: string
          mapping?: Json
          org_id: string
          rows_total?: number
          rows_valid?: number
          status?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity?: string
          errors?: Json
          file_name?: string
          id?: string
          mapping?: Json
          org_id?: string
          rows_total?: number
          rows_valid?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_jobs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          description: string
          id: string
          invoice_id: string
          org_id: string
          product_id: string | null
          quantity: number
          tax: number
          total: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          invoice_id: string
          org_id: string
          product_id?: string | null
          quantity?: number
          tax?: number
          total?: number
          unit_price?: number
        }
        Update: {
          description?: string
          id?: string
          invoice_id?: string
          org_id?: string
          product_id?: string | null
          quantity?: number
          tax?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_receivables_aging"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_sales_lines"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_items_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_perf"
            referencedColumns: ["product_id"]
          },
        ]
      }
      invoice_lines: {
        Row: {
          cost_total: number
          created_at: string
          discount: number
          gross_profit: number | null
          id: string
          invoice_id: string
          net_sales: number | null
          org_id: string
          product_id: string | null
          qty: number
          unit_price: number
        }
        Insert: {
          cost_total?: number
          created_at?: string
          discount?: number
          gross_profit?: number | null
          id?: string
          invoice_id: string
          net_sales?: number | null
          org_id: string
          product_id?: string | null
          qty?: number
          unit_price?: number
        }
        Update: {
          cost_total?: number
          created_at?: string
          discount?: number
          gross_profit?: number | null
          id?: string
          invoice_id?: string
          net_sales?: number | null
          org_id?: string
          product_id?: string | null
          qty?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_receivables_aging"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_sales_lines"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_lines_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_perf"
            referencedColumns: ["product_id"]
          },
        ]
      }
      invoices: {
        Row: {
          account_id: string | null
          balance_due: number
          created_at: string
          created_by: string | null
          currency: string
          deal_id: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          org_id: string
          payment_method: string | null
          region_id: string | null
          rep_id: string | null
          status: string
          subtotal: number
          tax: number
          total: number
        }
        Insert: {
          account_id?: string | null
          balance_due?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          deal_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          org_id: string
          payment_method?: string | null
          region_id?: string | null
          rep_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
        }
        Update: {
          account_id?: string | null
          balance_due?: number
          created_at?: string
          created_by?: string | null
          currency?: string
          deal_id?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          org_id?: string
          payment_method?: string | null
          region_id?: string | null
          rep_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "reps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "v_rep_month"
            referencedColumns: ["rep_id"]
          },
        ]
      }
      kpi_evaluations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          band: string | null
          created_at: string
          final_score: number
          id: string
          manager_action: string | null
          notes: string | null
          org_id: string
          period: string
          rep_id: string | null
          status: string
          template_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          band?: string | null
          created_at?: string
          final_score?: number
          id?: string
          manager_action?: string | null
          notes?: string | null
          org_id: string
          period: string
          rep_id?: string | null
          status?: string
          template_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          band?: string | null
          created_at?: string
          final_score?: number
          id?: string
          manager_action?: string | null
          notes?: string | null
          org_id?: string
          period?: string
          rep_id?: string | null
          status?: string
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_evaluations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_evaluations_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "reps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_evaluations_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "v_rep_month"
            referencedColumns: ["rep_id"]
          },
          {
            foreignKeyName: "kpi_evaluations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "kpi_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_metrics: {
        Row: {
          cap_pct: number
          category: string
          created_at: string
          id: string
          key: string
          label_ar: string
          label_en: string
          measurement: string
          org_id: string
          source: string
          target_value: number
          template_id: string
          weight: number
        }
        Insert: {
          cap_pct?: number
          category: string
          created_at?: string
          id?: string
          key: string
          label_ar: string
          label_en: string
          measurement: string
          org_id: string
          source?: string
          target_value?: number
          template_id: string
          weight?: number
        }
        Update: {
          cap_pct?: number
          category?: string
          created_at?: string
          id?: string
          key?: string
          label_ar?: string
          label_en?: string
          measurement?: string
          org_id?: string
          source?: string
          target_value?: number
          template_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_metrics_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_metrics_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "kpi_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_scores: {
        Row: {
          actual: number
          created_at: string
          evaluation_id: string
          id: string
          is_override: boolean
          metric_id: string
          org_id: string
          overridden_by: string | null
          override_reason: string | null
          score: number
          target: number
        }
        Insert: {
          actual?: number
          created_at?: string
          evaluation_id: string
          id?: string
          is_override?: boolean
          metric_id: string
          org_id: string
          overridden_by?: string | null
          override_reason?: string | null
          score?: number
          target?: number
        }
        Update: {
          actual?: number
          created_at?: string
          evaluation_id?: string
          id?: string
          is_override?: boolean
          metric_id?: string
          org_id?: string
          overridden_by?: string | null
          override_reason?: string | null
          score?: number
          target?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_scores_evaluation_id_fkey"
            columns: ["evaluation_id"]
            isOneToOne: false
            referencedRelation: "kpi_evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_scores_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "kpi_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_scores_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_templates: {
        Row: {
          active: boolean
          applies_to: string
          bands: Json
          created_at: string
          id: string
          name: string
          org_id: string
        }
        Insert: {
          active?: boolean
          applies_to?: string
          bands?: Json
          created_at?: string
          id?: string
          name: string
          org_id: string
        }
        Update: {
          active?: boolean
          applies_to?: string
          bands?: Json
          created_at?: string
          id?: string
          name?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kpi_templates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          actor_id: string | null
          body: string | null
          id: string
          lead_id: string
          occurred_at: string
          org_id: string
          subject: string | null
          type: string
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          id?: string
          lead_id: string
          occurred_at?: string
          org_id: string
          subject?: string | null
          type: string
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          id?: string
          lead_id?: string
          occurred_at?: string
          org_id?: string
          subject?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activities_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          account_id: string | null
          company: string | null
          contact_id: string | null
          created_at: string
          email: string | null
          expected_value: number
          id: string
          name: string
          notes: string | null
          org_id: string
          owner_id: string | null
          phone: string | null
          score: number
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          company?: string | null
          contact_id?: string | null
          created_at?: string
          email?: string | null
          expected_value?: number
          id?: string
          name: string
          notes?: string | null
          org_id: string
          owner_id?: string | null
          phone?: string | null
          score?: number
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          company?: string | null
          contact_id?: string | null
          created_at?: string
          email?: string | null
          expected_value?: number
          id?: string
          name?: string
          notes?: string | null
          org_id?: string
          owner_id?: string | null
          phone?: string | null
          score?: number
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "leads_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          org_id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          org_id: string
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          org_id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_settings: {
        Row: {
          daily_target: number
          default_currency: string
          locale: string
          monthly_target: number
          org_id: string
          timezone: string
          updated_at: string
          working_days: number[]
        }
        Insert: {
          daily_target?: number
          default_currency?: string
          locale?: string
          monthly_target?: number
          org_id: string
          timezone?: string
          updated_at?: string
          working_days?: number[]
        }
        Update: {
          daily_target?: number
          default_currency?: string
          locale?: string
          monthly_target?: number
          org_id?: string
          timezone?: string
          updated_at?: string
          working_days?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "org_settings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      payment_allocations: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          org_id: string
          payment_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          org_id: string
          payment_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          org_id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_allocations_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_receivables_aging"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "payment_allocations_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_sales_lines"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "payment_allocations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          invoice_id: string | null
          method: string
          notes: string | null
          org_id: string
          payment_date: string
          reference: string | null
          status: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string | null
          org_id: string
          payment_date?: string
          reference?: string | null
          status?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id?: string | null
          method?: string
          notes?: string | null
          org_id?: string
          payment_date?: string
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "payments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_receivables_aging"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "v_sales_lines"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "payments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_entries: {
        Row: {
          base_salary: number
          bonus: number
          commission: number
          created_at: string
          deductions: number
          id: string
          net_salary: number
          org_id: string
          period_end: string
          period_start: string
          status: string
          user_id: string
        }
        Insert: {
          base_salary?: number
          bonus?: number
          commission?: number
          created_at?: string
          deductions?: number
          id?: string
          net_salary?: number
          org_id: string
          period_end: string
          period_start: string
          status?: string
          user_id: string
        }
        Update: {
          base_salary?: number
          bonus?: number
          commission?: number
          created_at?: string
          deductions?: number
          id?: string
          net_salary?: number
          org_id?: string
          period_end?: string
          period_start?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_entries_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_lines: {
        Row: {
          achievement: number
          base_commission: number
          basic_salary: number
          collection_gate: string
          collection_pct: number
          commission_rate: number
          created_at: string
          deductions: number
          final_commission: number
          gp_factor: number
          gp_pct: number
          gross_profit: number
          id: string
          kpi_bonus: number
          kpi_score: number
          net_sales: number
          notes: string | null
          org_id: string
          other_bonus: number
          rep_id: string | null
          run_id: string
          snapshot: Json
          target: number
          total_gross: number
          total_variable: number
        }
        Insert: {
          achievement?: number
          base_commission?: number
          basic_salary?: number
          collection_gate?: string
          collection_pct?: number
          commission_rate?: number
          created_at?: string
          deductions?: number
          final_commission?: number
          gp_factor?: number
          gp_pct?: number
          gross_profit?: number
          id?: string
          kpi_bonus?: number
          kpi_score?: number
          net_sales?: number
          notes?: string | null
          org_id: string
          other_bonus?: number
          rep_id?: string | null
          run_id: string
          snapshot?: Json
          target?: number
          total_gross?: number
          total_variable?: number
        }
        Update: {
          achievement?: number
          base_commission?: number
          basic_salary?: number
          collection_gate?: string
          collection_pct?: number
          commission_rate?: number
          created_at?: string
          deductions?: number
          final_commission?: number
          gp_factor?: number
          gp_pct?: number
          gross_profit?: number
          id?: string
          kpi_bonus?: number
          kpi_score?: number
          net_sales?: number
          notes?: string | null
          org_id?: string
          other_bonus?: number
          rep_id?: string | null
          run_id?: string
          snapshot?: Json
          target?: number
          total_gross?: number
          total_variable?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_lines_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_lines_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "reps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_lines_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "v_rep_month"
            referencedColumns: ["rep_id"]
          },
          {
            foreignKeyName: "payroll_lines_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "payroll_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_runs: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          locked_at: string | null
          org_id: string
          period: string
          status: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          locked_at?: string | null
          org_id: string
          period: string
          status?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          locked_at?: string | null
          org_id?: string
          period?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_runs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          code: string
          description: string | null
        }
        Insert: {
          code: string
          description?: string | null
        }
        Update: {
          code?: string
          description?: string | null
        }
        Relationships: []
      }
      pipeline_stages: {
        Row: {
          created_at: string
          id: string
          is_closed: boolean
          name: string
          org_id: string
          probability: number
          stage_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_closed?: boolean
          name: string
          org_id: string
          probability?: number
          stage_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_closed?: boolean
          name?: string
          org_id?: string
          probability?: number
          stage_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          org_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          org_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_groups_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          code: string | null
          cost_price: number
          created_at: string
          description: string | null
          group_id: string | null
          id: string
          name: string
          org_id: string
          sku: string | null
          tax_rate: number
          unit: string | null
          unit_price: number
        }
        Insert: {
          active?: boolean
          code?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          group_id?: string | null
          id?: string
          name: string
          org_id: string
          sku?: string | null
          tax_rate?: number
          unit?: string | null
          unit_price?: number
        }
        Update: {
          active?: boolean
          code?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          group_id?: string | null
          id?: string
          name?: string
          org_id?: string
          sku?: string | null
          tax_rate?: number
          unit?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "product_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["product_group_id"]
          },
          {
            foreignKeyName: "products_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          locale: string
          theme: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          locale?: string
          theme?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          locale?: string
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_lines: {
        Row: {
          description: string | null
          discount: number
          id: string
          org_id: string
          product_id: string | null
          qty: number
          quote_id: string
          unit_price: number
        }
        Insert: {
          description?: string | null
          discount?: number
          id?: string
          org_id: string
          product_id?: string | null
          qty?: number
          quote_id: string
          unit_price?: number
        }
        Update: {
          description?: string | null
          discount?: number
          id?: string
          org_id?: string
          product_id?: string | null
          qty?: number
          quote_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_lines_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_perf"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "quote_lines_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          converted_invoice_id: string | null
          created_at: string
          customer_id: string | null
          follow_up_date: string | null
          id: string
          notes: string | null
          org_id: string
          quote_date: string
          quote_number: string
          rep_id: string | null
          stage: string
          value: number
          win_loss_reason: string | null
        }
        Insert: {
          converted_invoice_id?: string | null
          created_at?: string
          customer_id?: string | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          org_id: string
          quote_date?: string
          quote_number: string
          rep_id?: string | null
          stage?: string
          value?: number
          win_loss_reason?: string | null
        }
        Update: {
          converted_invoice_id?: string | null
          created_at?: string
          customer_id?: string | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          org_id?: string
          quote_date?: string
          quote_number?: string
          rep_id?: string | null
          stage?: string
          value?: number
          win_loss_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_converted_invoice_id_fkey"
            columns: ["converted_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_converted_invoice_id_fkey"
            columns: ["converted_invoice_id"]
            isOneToOne: false
            referencedRelation: "v_receivables_aging"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "quotes_converted_invoice_id_fkey"
            columns: ["converted_invoice_id"]
            isOneToOne: false
            referencedRelation: "v_sales_lines"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "quotes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "reps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "v_rep_month"
            referencedColumns: ["rep_id"]
          },
        ]
      }
      regions: {
        Row: {
          created_at: string
          id: string
          name: string
          org_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          org_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "regions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      reps: {
        Row: {
          active: boolean
          basic_salary: number
          created_at: string
          hire_date: string | null
          id: string
          manager_id: string | null
          org_id: string
          profile_id: string | null
          region_id: string | null
          sales_type: string
          team_id: string | null
        }
        Insert: {
          active?: boolean
          basic_salary?: number
          created_at?: string
          hire_date?: string | null
          id?: string
          manager_id?: string | null
          org_id: string
          profile_id?: string | null
          region_id?: string | null
          sales_type?: string
          team_id?: string | null
        }
        Update: {
          active?: boolean
          basic_salary?: number
          created_at?: string
          hire_date?: string | null
          id?: string
          manager_id?: string | null
          org_id?: string
          profile_id?: string | null
          region_id?: string | null
          sales_type?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reps_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reps_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reps_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reps_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_code: string
          role: string
        }
        Insert: {
          permission_code: string
          role: string
        }
        Update: {
          permission_code?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_code_fkey"
            columns: ["permission_code"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["code"]
          },
        ]
      }
      saved_views: {
        Row: {
          columns: Json
          created_at: string
          entity: string
          filters: Json
          id: string
          name: string
          org_id: string
          owner_id: string | null
          shared: boolean
          sort: Json
        }
        Insert: {
          columns?: Json
          created_at?: string
          entity: string
          filters?: Json
          id?: string
          name: string
          org_id: string
          owner_id?: string | null
          shared?: boolean
          sort?: Json
        }
        Update: {
          columns?: Json
          created_at?: string
          entity?: string
          filters?: Json
          id?: string
          name?: string
          org_id?: string
          owner_id?: string | null
          shared?: boolean
          sort?: Json
        }
        Relationships: [
          {
            foreignKeyName: "saved_views_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      targets: {
        Row: {
          created_at: string
          created_by: string | null
          daily_working_days: number
          id: string
          metric: string
          notes: string | null
          org_id: string
          period: string
          scope: string
          scope_id: string | null
          value: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          daily_working_days?: number
          id?: string
          metric: string
          notes?: string | null
          org_id: string
          period: string
          scope: string
          scope_id?: string | null
          value?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          daily_working_days?: number
          id?: string
          metric?: string
          notes?: string | null
          org_id?: string
          period?: string
          scope?: string
          scope_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "targets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      targets_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_value: number
          org_id: string
          previous_value: number | null
          reason: string | null
          target_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value: number
          org_id: string
          previous_value?: number | null
          reason?: string | null
          target_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value?: number
          org_id?: string
          previous_value?: number | null
          reason?: string | null
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "targets_history_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "targets_history_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "targets"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          account_id: string | null
          assignee_id: string | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          description: string | null
          due_at: string | null
          id: string
          lead_id: string | null
          org_id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          assignee_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          org_id: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          assignee_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string | null
          org_id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "tasks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          manager_id: string | null
          name: string
          org_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          manager_id?: string | null
          name: string
          org_id: string
        }
        Update: {
          created_at?: string
          id?: string
          manager_id?: string | null
          name?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_deliveries: {
        Row: {
          attempt_count: number
          created_at: string
          event_name: string
          id: string
          org_id: string
          response_body: string | null
          status_code: number | null
          webhook_id: string | null
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          event_name: string
          id?: string
          org_id: string
          response_body?: string | null
          status_code?: number | null
          webhook_id?: string | null
        }
        Update: {
          attempt_count?: number
          created_at?: string
          event_name?: string
          id?: string
          org_id?: string
          response_body?: string | null
          status_code?: number | null
          webhook_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string
          enabled: boolean
          events: string[]
          id: string
          name: string
          org_id: string
          secret: string | null
          url: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          events?: string[]
          id?: string
          name: string
          org_id: string
          secret?: string | null
          url: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          events?: string[]
          id?: string
          name?: string
          org_id?: string
          secret?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_plans: {
        Row: {
          created_at: string
          id: string
          manager_notes: string | null
          new_customers_target: number
          org_id: string
          priorities: Json
          rep_id: string | null
          sales_target: number
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          manager_notes?: string | null
          new_customers_target?: number
          org_id: string
          priorities?: Json
          rep_id?: string | null
          sales_target?: number
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          manager_notes?: string | null
          new_customers_target?: number
          org_id?: string
          priorities?: Json
          rep_id?: string | null
          sales_target?: number
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_plans_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_plans_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "reps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_plans_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "v_rep_month"
            referencedColumns: ["rep_id"]
          },
        ]
      }
    }
    Views: {
      v_cross_sell_gaps: {
        Row: {
          account_id: string | null
          customer_name: string | null
          missing_group: string | null
          org_id: string | null
          product_group_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_customer_health: {
        Row: {
          avg_order: number | null
          health_status: string | null
          id: string | null
          last_purchase: string | null
          name: string | null
          org_id: string | null
          owner_id: string | null
          sales_12m: number | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_customer_product_matrix: {
        Row: {
          account_id: string | null
          group_id: string | null
          org_id: string | null
          product_id: string | null
          qty: number | null
          sales: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_perf"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "product_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["product_group_id"]
          },
        ]
      }
      v_monthly_trend: {
        Row: {
          gp: number | null
          org_id: string | null
          period_month: string | null
          sales: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_pipeline: {
        Row: {
          org_id: string | null
          quote_count: number | null
          stage: string | null
          total_value: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_product_perf: {
        Row: {
          gp: number | null
          gp_pct: number | null
          name: string | null
          org_id: string | null
          product_group: string | null
          product_id: string | null
          qty: number | null
          sales: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_receivables_aging: {
        Row: {
          account_id: string | null
          aging_bucket: string | null
          balance_due: number | null
          due_date: string | null
          invoice_id: string | null
          invoice_number: string | null
          org_id: string | null
          total: number | null
        }
        Insert: {
          account_id?: string | null
          aging_bucket?: never
          balance_due?: never
          due_date?: string | null
          invoice_id?: string | null
          invoice_number?: string | null
          org_id?: string | null
          total?: number | null
        }
        Update: {
          account_id?: string | null
          aging_bucket?: never
          balance_due?: never
          due_date?: string | null
          invoice_id?: string | null
          invoice_number?: string | null
          org_id?: string | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      v_region_perf: {
        Row: {
          invoices: number | null
          org_id: string | null
          region_id: string | null
          region_name: string | null
          sales: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      v_rep_month: {
        Row: {
          achievement: number | null
          gp: number | null
          gp_pct: number | null
          invoices: number | null
          org_id: string | null
          period: string | null
          profile_id: string | null
          rep_id: string | null
          sales: number | null
          sales_type: string | null
          status: string | null
          target: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reps_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reps_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_sales_lines: {
        Row: {
          account_id: string | null
          cost_total: number | null
          discount: number | null
          gp_pct: number | null
          gross_profit: number | null
          invoice_id: string | null
          invoice_number: string | null
          issue_date: string | null
          line_id: string | null
          net_sales: number | null
          org_id: string | null
          product_group: string | null
          product_id: string | null
          product_name: string | null
          qty: number | null
          region_id: string | null
          rep_id: string | null
          unit_price: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_perf"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_cross_sell_gaps"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "invoices_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "v_customer_health"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "reps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_rep_id_fkey"
            columns: ["rep_id"]
            isOneToOne: false
            referencedRelation: "v_rep_month"
            referencedColumns: ["rep_id"]
          },
        ]
      }
    }
    Functions: {
      calculate_commission: {
        Args: {
          p_collection_pct: number
          p_gp: number
          p_kpi_score: number
          p_net_sales: number
          p_plan: string
          p_target: number
        }
        Returns: Json
      }
      commission_rate_for_achievement: {
        Args: { p_achievement: number; p_plan: string }
        Returns: number
      }
      create_organization: { Args: { p_name: string }; Returns: string }
      evaluate_kpi_score: { Args: { p_evaluation_id: string }; Returns: number }
      get_dashboard_summary: { Args: { target_org_id: string }; Returns: Json }
      gp_amount: { Args: { cost: number; net: number }; Returns: number }
      gp_factor_for_pct: {
        Args: { p_gp_pct: number; p_plan: string }
        Returns: number
      }
      net_sales: {
        Args: { discount: number; q: number; unit_price: number }
        Returns: number
      }
      rep_status: { Args: { achievement: number }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
