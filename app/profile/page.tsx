'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUserEdit, FaFileMedical } from 'react-icons/fa';

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user', { credentials: "include" });
        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);
  

  if (!user) return <p className="text-center mt-5 text-gray-600">Loading...</p>;
  console.log("User", user);
  
  return (
    <div className="max-w-4xl mx-auto mt-5 p-6 bg-white shadow-xl rounded-lg w-full sm:p-10">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Image
          src={user.avatar || '/profile.jpeg'}
          alt="User Avatar"
          width={80}
          height={80}
          className="rounded-full border shadow border-gray-500"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">{user.name || 'N/A'}</h1>
          <p className="text-gray-600">Email: {user.email || 'N/A'}</p>
          <p className="text-gray-600">Phone: {user.phone || 'N/A'}</p>
          <p className="text-gray-600">Address: {user.address || 'N/A'}</p>
          <p className="text-gray-600">Blood Type: {user.bloodType || 'N/A'}</p>
        </div>
        <button
          onClick={() => router.push('/edit_profile')}
          className="mt-4 sm:mt-0 px-4 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full sm:w-auto"
        >
          <FaUserEdit /> Edit Profile
        </button>
      </div>

      {/* Search History */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold border-b pb-2">Search History</h2>
        <ul className="mt-2 text-gray-700">
          {user.medicalHistory && user.medicalHistory.length > 0 ? (
            user.medicalHistory.map((item: string, index: number) => (
              <li key={index} className="py-1">✅ {item}</li>
            ))
          ) : (
            <p className="text-gray-500">No search history found.</p>
          )}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold border-b pb-2">Health Reports</h2>
        <ul className="mt-2 text-gray-700">
          {user.reports && user.reports.length > 0 ? (
            user.reports.map((report: { _id: string; name: string }) => (
              <li key={report._id} className="flex flex-col sm:flex-row justify-between items-center py-2 border-b">
                <span className="flex items-center gap-2">
                  <FaFileMedical className="text-blue-500" /> {report.name}
                </span>
                <a
                  href={`/uploads/${report.name}`}
                  download
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  Download
                </a>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No reports available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
