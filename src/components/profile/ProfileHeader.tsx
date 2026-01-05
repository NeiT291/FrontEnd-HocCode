import { Calendar, Mail, Phone, MapPin } from "lucide-react";
import type { UserProfile } from "@/services/api/profile.types";

interface Props {
    profile: UserProfile;
}

const ProfileHeader = ({ profile }: Props) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow mb-8 flex gap-6">
            {/* AVATAR */}
            <img
                src={profile.avatarUrl || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border"
            />

            {/* INFO */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold">
                    {profile.displayName || "Chưa cập nhật tên"}
                </h1>

                {profile.bio && (
                    <p className="text-gray-600 mt-1">
                        {profile.bio}
                    </p>
                )}

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    {profile.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> {profile.email}
                        </div>
                    )}

                    {profile.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {profile.phone}
                        </div>
                    )}

                    {profile.address && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {profile.address}
                        </div>
                    )}

                    {profile.dob && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> {profile.dob}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
