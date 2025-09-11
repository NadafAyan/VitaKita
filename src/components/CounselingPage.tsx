import { useState } from "react";
import { Calendar, Video, Phone, Star } from "lucide-react";

// Counselor type
type Counselor = {
  id: number;
  name: string;
  specialty: string;
  days: string;
  modes: string[];
  rating: number;
  experience: number;
};

// Session type
type Session = {
  id: number;
  date: string;
  time: string;
  counselor: string;
  status: "confirmed" | "pending";
  mode: string;
};

// Dummy data
const counselors: Counselor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    days: "Mon, Wed, Fri",
    modes: ["In-person", "Video", "Phone"],
    rating: 4.9,
    experience: 8,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Stress & Academic Pressure",
    days: "Tue, Thu, Sat",
    modes: ["In-person", "Video"],
    rating: 4.8,
    experience: 6,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Relationship & Social Issues",
    days: "Mon–Thu",
    modes: ["In-person", "Video"],
    rating: 4.9,
    experience: 10,
  },
];

const sessions: Session[] = [
  {
    id: 1,
    date: "Dec 8, 2024",
    time: "2:00 PM",
    counselor: "Dr. Sarah Johnson",
    status: "confirmed",
    mode: "Video Session",
  },
  {
    id: 2,
    date: "Dec 15, 2024",
    time: "10:00 AM",
    counselor: "Dr. Emily Rodriguez",
    status: "pending",
    mode: "In-person",
  },
];

export default function CounselingPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(
    null
  );

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6 mt-8">
      {/* Counselors List */}
      <div className="md:col-span-2 bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Choose Your Counselor</h2>
        <div className="space-y-4">
          {counselors.map((counselor) => (
            <div
              key={counselor.id}
              onClick={() => setSelectedCounselor(counselor.id)}
              className={`border rounded-xl p-4 cursor-pointer transition ${
                selectedCounselor === counselor.id
                  ? "border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{counselor.name}</h3>
                  <p className="text-sm text-gray-600">{counselor.specialty}</p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" /> {counselor.days}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {counselor.modes.includes("In-person") && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        In-person
                      </span>
                    )}
                    {counselor.modes.includes("Video") && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center">
                        <Video className="w-3 h-3 mr-1" /> Video
                      </span>
                    )}
                    {counselor.modes.includes("Phone") && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center">
                        <Phone className="w-3 h-3 mr-1" /> Phone
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="flex items-center text-yellow-500 font-medium">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                    {counselor.rating}
                  </p>
                  <p className="text-xs text-gray-500">
                    {counselor.experience} years
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
        <div className="space-y-3">
          {sessions?.map((session) => (
            <div
              key={session.id}
              className="p-3 border rounded-xl flex flex-col gap-1"
            >
              <p className="font-medium">
                {session.date} - {session.time}
              </p>
              <p className="text-sm text-gray-600">{session.counselor}</p>
              <p className="text-sm text-gray-500">{session.mode}</p>
              <span
                className={`text-xs font-medium px-2 py-1 rounded w-fit ${
                  session.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {session.status}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
          View All Appointments
        </button>
      </div>

      {/* Selected Counselor UI */}
      {selectedCounselor && (
        <div className="md:col-span-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
          <p className="text-sm text-blue-700">
            ✅ Selected Counselor:{" "}
            <span className="font-semibold">
              {counselors.find((c) => c.id === selectedCounselor)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
