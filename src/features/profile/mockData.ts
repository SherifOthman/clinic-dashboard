export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar: string;
  dateJoined: string;
  lastLogin: string;
  status: "active" | "inactive";
  bio?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    language: string;
    timezone: string;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginSessions: Array<{
      id: string;
      device: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>;
  };
  stats: {
    patientsManaged: number;
    appointmentsScheduled: number;
    recordsCreated: number;
    loginCount: number;
  };
}

export const mockUserProfile: UserProfile = {
  id: "user1",
  firstName: "Dr. Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@clinic.com",
  phone: "+1 (555) 123-4567",
  role: "Doctor",
  department: "Cardiology",
  avatar: "https://i.pravatar.cc/150?u=sarah.johnson",
  dateJoined: "2022-03-15",
  lastLogin: "2024-10-24T10:30:00Z",
  status: "active",
  bio: "Experienced cardiologist with over 10 years of practice. Specialized in interventional cardiology and heart disease prevention.",
  address: {
    street: "123 Medical Center Dr",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "United States",
  },
  preferences: {
    theme: "system",
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    language: "English",
    timezone: "America/Los_Angeles",
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: "2024-09-15",
    loginSessions: [
      {
        id: "session1",
        device: "Chrome on Windows",
        location: "San Francisco, CA",
        lastActive: "2024-10-24T10:30:00Z",
        current: true,
      },
      {
        id: "session2",
        device: "Safari on iPhone",
        location: "San Francisco, CA",
        lastActive: "2024-10-23T18:45:00Z",
        current: false,
      },
      {
        id: "session3",
        device: "Chrome on MacBook",
        location: "San Francisco, CA",
        lastActive: "2024-10-22T14:20:00Z",
        current: false,
      },
    ],
  },
  stats: {
    patientsManaged: 245,
    appointmentsScheduled: 1250,
    recordsCreated: 890,
    loginCount: 456,
  },
};

export interface ActivityLog {
  id: string;
  type:
    | "login"
    | "patient_added"
    | "appointment_scheduled"
    | "record_created"
    | "profile_updated";
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const mockActivityLogs: ActivityLog[] = [
  {
    id: "act1",
    type: "login",
    description: "Logged in from Chrome on Windows",
    timestamp: "2024-10-24T10:30:00Z",
    metadata: { device: "Chrome on Windows", location: "San Francisco, CA" },
  },
  {
    id: "act2",
    type: "patient_added",
    description: "Added new patient: John Smith",
    timestamp: "2024-10-24T09:15:00Z",
    metadata: { patientId: "pat123", patientName: "John Smith" },
  },
  {
    id: "act3",
    type: "appointment_scheduled",
    description: "Scheduled appointment for Emily Davis",
    timestamp: "2024-10-24T08:45:00Z",
    metadata: { appointmentId: "app456", patientName: "Emily Davis" },
  },
  {
    id: "act4",
    type: "record_created",
    description: "Created medical record for Michael Brown",
    timestamp: "2024-10-23T16:30:00Z",
    metadata: { recordId: "rec789", patientName: "Michael Brown" },
  },
  {
    id: "act5",
    type: "profile_updated",
    description: "Updated profile information",
    timestamp: "2024-10-23T14:20:00Z",
    metadata: { fields: ["phone", "bio"] },
  },
  {
    id: "act6",
    type: "login",
    description: "Logged in from Safari on iPhone",
    timestamp: "2024-10-23T18:45:00Z",
    metadata: { device: "Safari on iPhone", location: "San Francisco, CA" },
  },
];
