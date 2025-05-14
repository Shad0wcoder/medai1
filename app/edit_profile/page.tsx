'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const EditProfile = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const router = useRouter();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodType: '',
    avatar: '/profile.jpeg',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log("User", user);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user', { credentials: "include" });
        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        if (data.user) {
          setUser((prev) => ({
            ...prev,
            ...data.user, // Ensure fetched data doesn't introduce undefined values
            avatar: data.user.avatar || '/profile.jpeg', // Ensure avatar always has a value
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle avatar change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, avatar: previewUrl }));
  }
};


  // Handle form submission
const handleSave = async () => {
  try {
    let uploadedImageUrl = user.avatar;

    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      const uploadRes = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
        method: "POST",
        body: formData,
      });

      const data = await uploadRes.json();
      console.log("Cloudinary response:", data);

      if (data.secure_url) {
        uploadedImageUrl = data.secure_url;
      } else {
        throw new Error("Cloudinary upload failed");
      }
    }

    const updatedUser = { ...user, avatar: uploadedImageUrl };

    const res = await fetch('/api/auth/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
      credentials: "include",
    });

    if (!res.ok) throw new Error('Failed to update profile');

    const fetchRes = await fetch('/api/auth/user', { credentials: "include" });
    const updatedData = await fetchRes.json();

    setUser(updatedData.user);
    router.push('/profile');
  } catch (error) {
    console.error("Error updating profile:", error);
    setError('Failed to update profile.');
  }
};


  
  

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-5 p-10 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-5">Edit Profile</h2>

      {error && <p className="text-red-500">{error}</p>}

      {/* Profile Picture */}
      <div className="flex items-center gap-4 mb-6">
        <Image
          src={user.avatar || "/profile.jpeg"}
          alt="User Avatar"
          width={80}
          height={80}
          className="w-20 h-20 rounded-full border shadow border-gray-500 object-cover"
        />
        <label className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
          Change Avatar
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>

      {/* Edit Form */}
      <form className="space-y-4">
        {["name", "email", "phone", "address", "bloodType"].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={user[field as keyof typeof user] || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
