// Database entity interfaces
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  subscription_tier?: string;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  title?: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size: number;
  taken_at?: string;
  location?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  user_id: string;
  name: string;
  relationship?: string;
  avatar_memory_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FaceDetection {
  id: string;
  memory_id: string;
  person_id?: string;
  bounding_box: any; // JSON object with face coordinates
  confidence: number;
  is_verified: boolean;
  face_embedding?: number[];
  created_at: string;
  updated_at: string;
}

// Request types
export interface CreatePersonRequest {
  name: string;
  relationship?: string;
  reference_memory_id: string;
  face_region: any; // Face bounding box coordinates
}

export interface VerifyFaceRequest {
  face_id: string;
  person_id: string;
  is_correct: boolean;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        subscriptionTier?: string;
      };
    }
  }
}